import { GenmInstrument } from "./GenmInstrument";
import { mapToRange } from "./utils/map-to-range";
import {
  unpackDetuneMultiple,
  unpackRateScalingAttack,
  unpackAmEnableFirstDecay,
  unpackSustainRelease,
} from "./utils/register-unpack";
import { getDmpInfo } from "./utils/get-dmp-info";

const genmInstrumentRegex = /(\d{1,3}), ((?:\d{1,3} ){49})(.*?);/g;
// Captures three groups:
// 0
// 4 0 0 4 3 97 97 100 100 6 0 6 0 31 31 24 24 16 13 12 12 2 2 8 8 4 4 2 4 0 0 0 0 4 3 1 1 2 2 6 6 0 0 0 0 0 0 0 0
// 01_capcom_logo_37.tfi

export class GenMDMParser {
  parseGenm(input: string): GenmInstrument[] {
    const matches = [...input.matchAll(genmInstrumentRegex)];

    return matches.map((match): GenmInstrument => {
      const instrumentIndex = match[1];
      const instrumentData = match[2];
      const instrumentName = match[3];

      const genmInstrument = new GenmInstrument();
      const genmInstrumentParameterOrder = Object.keys(
        genmInstrument.genmInstrumentParameters
      );
      genmInstrumentParameterOrder.shift();

      genmInstrument.instrumentIndex = parseInt(instrumentIndex, 10);

      const parameters: number[] = instrumentData
        .split(" ")
        .filter((parameter) => parameter.trim().length)
        .map((parameter) => parseInt(parameter, 10));

      for (let i = 0; i < genmInstrumentParameterOrder.length; i++) {
        const parameter = genmInstrumentParameterOrder[i];
        const value = parameters[i];

        genmInstrument[parameter] = value;
      }

      genmInstrument.instrumentName = instrumentName;

      return genmInstrument;
    });
  }

  generateGenm(instruments: GenmInstrument[]): string {
    const genmInstruments: string[] = instruments.map((instrument) =>
      instrument.toString()
    );

    return genmInstruments.join("\n");
  }

  parseTfi(tfi: Uint8Array): GenmInstrument {
    const instrument = new GenmInstrument();

    instrument.algorithm = tfi[0];
    instrument.fmFeedback = tfi[1];

    for (let i = 0; i < 4; ++i) {
      const index = i + 1;

      instrument[`op${index}Multiple`] = tfi[2 + 10 * i];
      instrument[`op${index}Detune`] = tfi[3 + 10 * i];
      instrument[`op${index}TotalLevel`] = 127 - tfi[4 + 10 * i];
      instrument[`op${index}RateScaling`] = tfi[5 + 10 * i];
      instrument[`op${index}Attack`] = tfi[6 + 10 * i];
      instrument[`op${index}Decay1`] = tfi[7 + 10 * i];
      instrument[`op${index}Decay2`] = tfi[8 + 10 * i];
      instrument[`op${index}Release`] = tfi[9 + 10 * i];
      instrument[`op${index}Level2`] = tfi[10 + 10 * i];
      instrument[`op${index}SSGEG`] = tfi[11 + 10 * i];
    }

    return instrument;
  }

  /**
   * Huge help: https://github.com/Wohlstand/OPN2BankEditor/blob/master/src/FileFormats/format_gens_y12.cpp
   */
  parseY12(y12: Uint8Array): GenmInstrument {
    const instrument = new GenmInstrument();

    if (y12.length !== 128) {
      throw new Error(`Y12 file is not of length 128: ${y12.length}`);
    }

    for (let i = 0; i < 4; ++i) {
      const index = i + 1;

      const [detuneRegister, multiple] = unpackDetuneMultiple(y12[0 + i * 16]);
      let detune = detuneRegister;

      // converts from register detune value to tfi/genm detune value
      // we convert from 0, +1, +2, +3, 0, -1, -2, -3 to -3, -2, -1, 0, 1, 2, 3
      //                 0,  1,  2,  3, 4,  5,  6,  7     0,  1,  2, 3, 4, 5, 6

      if (detune === 0 || detune === 4) {
        detune = 3;
      } else if (detune > 0 && detune < 4) {
        detune = detune + 3;
      } else if (detune > 4) {
        detune = detune - 5;
      }

      instrument[`op${index}Detune`] = detune;
      instrument[`op${index}Multiple`] = multiple;

      instrument[`op${index}TotalLevel`] = 127 - (y12[1 + 16 * i] & 0x7f);

      const [rateScaling, attack] = unpackRateScalingAttack(y12[2 + 16 * i]);
      instrument[`op${index}RateScaling`] = rateScaling;
      instrument[`op${index}Attack`] = attack;

      const [amEnable, firstDecay] = unpackAmEnableFirstDecay(y12[3 + 16 * i]);
      instrument[`op${index}LfoEnable`] = amEnable;
      instrument[`op${index}Decay1`] = firstDecay;

      instrument[`op${index}Decay2`] = y12[4 + 16 * i] & 0x1f;

      const [sustain, release] = unpackSustainRelease(y12[5 + 16 * i]);

      instrument[`op${index}Release`] = release;
      instrument[`op${index}Level2`] = sustain;

      instrument[`op${index}SSGEG`] = y12[8 + 16 * i] & 0x0f;
    }

    instrument.algorithm = y12[4 * 16 + 0];
    instrument.fmFeedback = y12[4 * 16 + 1];
    instrument.instrumentName = String.fromCharCode(
      ...y12.slice(5 * 16, 5 * 16 + 16)
    );

    return instrument;
  }

  parseGenMDM(midiCC: Map<number, number>): GenmInstrument {
    const instrument = new GenmInstrument();
    const { genmInstrumentParameters: parameters } = instrument;

    Object.keys(parameters).forEach((parameter) => {
      const hasCC = parameters[parameter].genMdmMidi;
      let value;
      if (hasCC && "cc" in hasCC) {
        value = midiCC.get(hasCC.cc);
      }

      if (value !== undefined) {
        const mapped = mapToRange(value, 127, parameters[parameter].size - 1);

        instrument[parameter] = mapped;
      }
    });

    return instrument;
  }

  parseDMP(dmp: Uint8Array): GenmInstrument {
    const instrument = new GenmInstrument();
    const { dataOffset, headOffset } = getDmpInfo(dmp);

    instrument.lfoFm = dmp[headOffset + 0];
    instrument.fmFeedback = dmp[headOffset + 1];
    instrument.algorithm = dmp[headOffset + 2];
    instrument.lfoAm = dmp[headOffset + 3];

    for (let i = 0; i < 4; ++i) {
      const index = i + 1;

      instrument[`op${index}Multiple`] = dmp[dataOffset + 0 + 11 * i];
      instrument[`op${index}TotalLevel`] = 127 - dmp[dataOffset + 1 + 11 * i];
      instrument[`op${index}Attack`] = dmp[dataOffset + 2 + 11 * i];
      instrument[`op${index}Decay1`] = dmp[dataOffset + 3 + 11 * i];
      instrument[`op${index}Level2`] = dmp[dataOffset + 4 + 11 * i];
      instrument[`op${index}Release`] = dmp[dataOffset + 5 + 11 * i];
      instrument[`op${index}LfoEnable`] = dmp[dataOffset + 6 + 11 * i];
      instrument[`op${index}RateScaling`] = dmp[dataOffset + 7 + 11 * i];
      instrument[`op${index}Detune`] = dmp[dataOffset + 8 + 11 * i];
      instrument[`op${index}Decay2`] = dmp[dataOffset + 9 + 11 * i];
      instrument[`op${index}SSGEG`] = dmp[dataOffset + 10 + 11 * i];
    }

    return instrument;
  }
}
