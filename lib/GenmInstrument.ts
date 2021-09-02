import { GenMInstrumentValues } from "./main.d";
import { mapToCCRange } from "./utils/map-to-cc-range";

interface GenMdmMidiParameter {
  cc: number;
}
interface GenmInstrumentParameter {
  size: number;
  genMdmMidi?: GenMdmMidiParameter;
}

interface GenmInstrumentParameterList {
  [key: string]: GenmInstrumentParameter;
}

const genmInstrumentParameters: GenmInstrumentParameterList = {
  instrumentIndex: { size: 128 },
  algorithm: { size: 8, genMdmMidi: { cc: 14 } },
  lfoFm: { size: 8, genMdmMidi: { cc: 75 } },
  lfoAm: { size: 8, genMdmMidi: { cc: 76 } },
  fmFeedback: { size: 8, genMdmMidi: { cc: 15 } },
  panning: { size: 4, genMdmMidi: { cc: 77 } },
  op1TotalLevel: { size: 128, genMdmMidi: { cc: 16 } },
  op2TotalLevel: { size: 128, genMdmMidi: { cc: 17 } },
  op3TotalLevel: { size: 128, genMdmMidi: { cc: 18 } },
  op4TotalLevel: { size: 128, genMdmMidi: { cc: 19 } },
  op1Detune: { size: 8, genMdmMidi: { cc: 24 } },
  op2Detune: { size: 8, genMdmMidi: { cc: 25 } },
  op3Detune: { size: 8, genMdmMidi: { cc: 26 } },
  op4Detune: { size: 8, genMdmMidi: { cc: 27 } },
  op1Attack: { size: 32, genMdmMidi: { cc: 43 } },
  op2Attack: { size: 32, genMdmMidi: { cc: 44 } },
  op3Attack: { size: 32, genMdmMidi: { cc: 45 } },
  op4Attack: { size: 32, genMdmMidi: { cc: 46 } },
  op1Decay1: { size: 32, genMdmMidi: { cc: 47 } },
  op2Decay1: { size: 32, genMdmMidi: { cc: 48 } },
  op3Decay1: { size: 32, genMdmMidi: { cc: 49 } },
  op4Decay1: { size: 32, genMdmMidi: { cc: 50 } },
  op1Decay2: { size: 32, genMdmMidi: { cc: 51 } },
  op2Decay2: { size: 32, genMdmMidi: { cc: 52 } },
  op3Decay2: { size: 32, genMdmMidi: { cc: 53 } },
  op4Decay2: { size: 32, genMdmMidi: { cc: 54 } },
  op1Multiple: { size: 16, genMdmMidi: { cc: 20 } },
  op2Multiple: { size: 16, genMdmMidi: { cc: 21 } },
  op3Multiple: { size: 16, genMdmMidi: { cc: 22 } },
  op4Multiple: { size: 16, genMdmMidi: { cc: 23 } },
  op1RateScaling: { size: 4, genMdmMidi: { cc: 39 } },
  op2RateScaling: { size: 4, genMdmMidi: { cc: 40 } },
  op3RateScaling: { size: 4, genMdmMidi: { cc: 41 } },
  op4RateScaling: { size: 4, genMdmMidi: { cc: 42 } },
  op1Level2: { size: 16, genMdmMidi: { cc: 55 } },
  op2Level2: { size: 16, genMdmMidi: { cc: 56 } },
  op3Level2: { size: 16, genMdmMidi: { cc: 57 } },
  op4Level2: { size: 16, genMdmMidi: { cc: 58 } },
  op1Release: { size: 16, genMdmMidi: { cc: 59 } },
  op2Release: { size: 16, genMdmMidi: { cc: 60 } },
  op3Release: { size: 16, genMdmMidi: { cc: 61 } },
  op4Release: { size: 16, genMdmMidi: { cc: 62 } },
  op1LfoEnable: { size: 2, genMdmMidi: { cc: 70 } },
  op2LfoEnable: { size: 2, genMdmMidi: { cc: 71 } },
  op3LfoEnable: { size: 2, genMdmMidi: { cc: 72 } },
  op4LfoEnable: { size: 2, genMdmMidi: { cc: 73 } },
  op1SSGEG: { size: 16, genMdmMidi: { cc: 90 } },
  op2SSGEG: { size: 16, genMdmMidi: { cc: 91 } },
  op3SSGEG: { size: 16, genMdmMidi: { cc: 92 } },
  op4SSGEG: { size: 16, genMdmMidi: { cc: 93 } },
};

function rangeCheck(parameter: string, value: number): number {
  if (value < 0 || value > genmInstrumentParameters[parameter].size) {
    throw new Error(
      `${parameter} must be in range of 0 and ${
        genmInstrumentParameters[parameter].size - 1
      }. got ${value}`
    );
  }

  return value;
}

export class GenmInstrument {
  [key: string]:
    | string
    | number
    | GenMInstrumentValues
    | GenmInstrumentParameterList
    | (() => string)
    | (() => Uint8Array)
    | (() => GenMInstrumentValues)
    | (() => Map<number, number>);

  instrument = {} as GenMInstrumentValues;

  toString(): string {
    const parameters: string[] = Object.keys(this.genmInstrumentParameters);
    parameters.shift();

    let string = "";
    string += `${this.instrumentIndex}, `;

    parameters.forEach((parameter: string, index: number) => {
      string += `${this[parameter]}${index < parameters.length - 1 ? " " : ""}`;
    });

    string += ` ${this.instrumentName};`;

    return string;
  }

  toJSON(): GenMInstrumentValues {
    return this.instrument;
  }

  /* TFI format
   * ----------
   * Thank goodness for https://plutiedev.com/format-tfi
   * as this isn't documented anywhere else!
   *
   *
   *  Index          | Description   | Range
   * ----------------|---------------|---------
   *   0             | Algorithm     | 0 - 7
   *   1             | Feedback      | 0 - 7
   *   2, 12, 22, 32 | Multiplier    | 0 - 15
   *   3, 13, 23, 33 | Detune        | 0 - 7
   *   4, 14, 24, 34 | Total Level   | 0 - 127
   *   5, 15, 25, 35 | Rate Scaling  | 0 - 3
   *   6, 16, 26, 36 | Attack Rate   | 0 - 31
   *   7, 17, 27, 37 | Decay Rate 1  | 0 - 31
   *   8, 18, 28, 38 | Decay Rate 2  | 0 - 31
   *   9, 19, 29, 39 | Release Rate  | 0 - 15
   *  10, 20, 30, 40 | Sustain Level | 0 - 15
   *  11, 21, 31, 41 | SSG-EG        | 0 - 15 [0-7 disabled (set to 0), 8-15 enabled]
   */
  toTFI(): Uint8Array {
    const tfiData = new Uint8Array(42);
    // algorithm
    tfiData[0] = this.algorithm;
    // feedback
    tfiData[1] = this.fmFeedback;

    for (let i = 0; i < 4; ++i) {
      const index = i + 1;

      tfiData[2 + 10 * i] = Number(this[`op${index}Multiple`]);
      tfiData[3 + 10 * i] = Number(this[`op${index}Detune`]);
      tfiData[4 + 10 * i] = 127 - Number(this[`op${index}TotalLevel`]);
      tfiData[5 + 10 * i] = Number(this[`op${index}RateScaling`]);
      tfiData[6 + 10 * i] = Number(this[`op${index}Attack`]);
      tfiData[7 + 10 * i] = Number(this[`op${index}Decay1`]);
      tfiData[8 + 10 * i] = Number(this[`op${index}Decay2`]);
      tfiData[9 + 10 * i] = Number(this[`op${index}Release`]);
      tfiData[10 + 10 * i] = Number(this[`op${index}Level2`]);
      tfiData[11 + 10 * i] = Number(this[`op${index}SSGEG`]);
    }

    return tfiData;
  }

  /* DMP format
   * 0x00 1 Byte:  FILE_VERSION, must be 11 (0x0B) for DefleMask v0.12.0
   * 0x01 1 Byte:  System:
   *               SYSTEM_GENESIS  0x02
   * 0x02 1 Byte:  Instrument Mode (1=FM, 0=STANDARD)
   *
   * // IF INSTRUMENT MODE IS FM ( = 1)
   * 0x03 1 Byte: LFO (FMS on YM2612, PMS on YM2151)
   * 0x04 1 Byte: FB
   * 0x05 1 Byte: ALG
   * 0x06 1 Byte: LFO2 (AMS on YM2612, AMS on YM2151)
   *
   *        Repeat this TOTAL_OPERATORS times
   * 0x07 + n  1 Byte: MULT
   * 0x08 + n  1 Byte: TL
   * 0x09 + n  1 Byte: AR
   * 0x0A + n  1 Byte: DR
   * 0x0B + n  1 Byte: SL
   * 0x0C + n  1 Byte: RR
   * 0x0D + n  1 Byte: AM
   * 0x0E + n  1 Byte: RS
   * 0x0F + n  1 Byte: DT (DT2<<4 | DT on YM2151)
   * 0x10 + n  1 Byte: D2R
   * 0x11 + n  1 Byte: SSGEG_Enabled <<3 | SSGEG
   */
  toDMP(): Uint8Array {
    const dmpData = new Uint8Array(32);

    // file version
    dmpData[0x00] = 0x0b;
    // system
    dmpData[0x01] = 0x02;
    // instrument Mode
    dmpData[0x02] = 0x01;

    dmpData[0x03] = this.lfoFm;
    dmpData[0x04] = this.fmFeedback;
    dmpData[0x05] = this.algorithm;
    dmpData[0x06] = this.lfoFm;

    for (let i = 0; i < 4; ++i) {
      const index = i + 1;

      dmpData[0x07 + 11 * i] = Number(this[`op${index}Multiple`]);
      dmpData[0x08 + 11 * i] = 127 - Number(this[`op${index}TotalLevel`]);
      dmpData[0x09 + 11 * i] = Number(this[`op${index}Attack`]);
      dmpData[0x0a + 11 * i] = Number(this[`op${index}Decay1`]);
      dmpData[0x0b + 11 * i] = Number(this[`op${index}Level2`]);
      dmpData[0x0c + 11 * i] = Number(this[`op${index}Release`]);
      dmpData[0x0d + 11 * i] = Number(this[`op${index}LfoEnable`]);
      dmpData[0x0e + 11 * i] = Number(this[`op${index}RateScaling`]);
      dmpData[0x0f + 11 * i] = Number(this[`op${index}Detune`]);
      dmpData[0x10 + 11 * i] = Number(this[`op${index}Decay2`]);
      dmpData[0x11 + 11 * i] = Number(this[`op${index}SSGEG`]);
    }

    return dmpData;
  }

  toGenMDM(): Map<number, number> {
    const map = new Map<number, number>();
    const parameters: string[] = Object.keys(this.genmInstrumentParameters);
    parameters.shift();

    parameters.forEach((parameter: string) => {
      const cc = this.genmInstrumentParameters[parameter].genMdmMidi?.cc;
      const size = this.genmInstrumentParameters[parameter].size - 1;

      if (cc) {
        map.set(cc, mapToCCRange(Number(this[parameter]), size));
      }
    });

    return map;
  }

  get genmInstrumentParameters(): GenmInstrumentParameterList {
    return genmInstrumentParameters;
  }

  get instrumentName(): string {
    return this.instrument.instrumentName;
  }

  set instrumentName(name: string) {
    this.instrument.instrumentName = name;
  }

  get instrumentIndex(): number {
    return this.instrument.instrumentIndex;
  }

  set instrumentIndex(index: number) {
    this.instrument.instrumentIndex = rangeCheck("instrumentIndex", index);
  }
  get algorithm(): number {
    return this.instrument.algorithm;
  }

  set algorithm(algorithm: number) {
    this.instrument.algorithm = rangeCheck("algorithm", algorithm);
  }

  get lfoFm(): number {
    return this.instrument.lfoFm;
  }

  set lfoFm(lfoFm: number) {
    this.instrument.lfoFm = rangeCheck("lfoFm", lfoFm);
  }

  get lfoAm(): number {
    return this.instrument.lfoAm;
  }

  set lfoAm(lfoAm: number) {
    this.instrument.lfoAm = rangeCheck("lfoAm", lfoAm);
  }

  get fmFeedback(): number {
    return this.instrument.fmFeedback;
  }

  set fmFeedback(fmFeedback: number) {
    this.instrument.fmFeedback = rangeCheck("fmFeedback", fmFeedback);
  }
  get panning(): number {
    return this.instrument.panning;
  }

  set panning(panning: number) {
    this.instrument.panning = rangeCheck("panning", panning);
  }
  get op1TotalLevel(): number {
    return this.instrument.op1TotalLevel;
  }

  set op1TotalLevel(op1TotalLevel: number) {
    this.instrument.op1TotalLevel = rangeCheck("op1TotalLevel", op1TotalLevel);
  }

  get op2TotalLevel(): number {
    return this.instrument.op2TotalLevel;
  }

  set op2TotalLevel(op2TotalLevel: number) {
    this.instrument.op2TotalLevel = rangeCheck("op2TotalLevel", op2TotalLevel);
  }

  get op3TotalLevel(): number {
    return this.instrument.op3TotalLevel;
  }

  set op3TotalLevel(op3TotalLevel: number) {
    this.instrument.op3TotalLevel = rangeCheck("op3TotalLevel", op3TotalLevel);
  }

  get op4TotalLevel(): number {
    return this.instrument.op4TotalLevel;
  }

  set op4TotalLevel(op4TotalLevel: number) {
    this.instrument.op4TotalLevel = rangeCheck("op4TotalLevel", op4TotalLevel);
  }

  get op1Detune(): number {
    return this.instrument.op1Detune;
  }

  set op1Detune(op1Detune: number) {
    this.instrument.op1Detune = rangeCheck("op1Detune", op1Detune);
  }

  get op2Detune(): number {
    return this.instrument.op2Detune;
  }

  set op2Detune(op2Detune: number) {
    this.instrument.op2Detune = rangeCheck("op2Detune", op2Detune);
  }

  get op3Detune(): number {
    return this.instrument.op3Detune;
  }

  set op3Detune(op3Detune: number) {
    this.instrument.op3Detune = rangeCheck("op3Detune", op3Detune);
  }

  get op4Detune(): number {
    return this.instrument.op4Detune;
  }

  set op4Detune(op4Detune: number) {
    this.instrument.op4Detune = rangeCheck("op4Detune", op4Detune);
  }

  get op1Attack(): number {
    return this.instrument.op1Attack;
  }

  set op1Attack(op1Attack: number) {
    this.instrument.op1Attack = rangeCheck("op1Attack", op1Attack);
  }

  get op2Attack(): number {
    return this.instrument.op2Attack;
  }

  set op2Attack(op2Attack: number) {
    this.instrument.op2Attack = rangeCheck("op2Attack", op2Attack);
  }

  get op3Attack(): number {
    return this.instrument.op3Attack;
  }

  set op3Attack(op3Attack: number) {
    this.instrument.op3Attack = rangeCheck("op3Attack", op3Attack);
  }

  get op4Attack(): number {
    return this.instrument.op4Attack;
  }

  set op4Attack(op4Attack: number) {
    this.instrument.op4Attack = rangeCheck("op4Attack", op4Attack);
  }

  get op1Decay1(): number {
    return this.instrument.op1Decay1;
  }

  set op1Decay1(op1Decay1: number) {
    this.instrument.op1Decay1 = rangeCheck("op1Decay1", op1Decay1);
  }

  get op2Decay1(): number {
    return this.instrument.op2Decay1;
  }

  set op2Decay1(op2Decay1: number) {
    this.instrument.op2Decay1 = rangeCheck("op2Decay1", op2Decay1);
  }

  get op3Decay1(): number {
    return this.instrument.op3Decay1;
  }

  set op3Decay1(op3Decay1: number) {
    this.instrument.op3Decay1 = rangeCheck("op3Decay1", op3Decay1);
  }

  get op4Decay1(): number {
    return this.instrument.op4Decay1;
  }

  set op4Decay1(op4Decay1: number) {
    this.instrument.op4Decay1 = rangeCheck("op4Decay1", op4Decay1);
  }

  get op1Decay2(): number {
    return this.instrument.op1Decay2;
  }

  set op1Decay2(op1Decay2: number) {
    this.instrument.op1Decay2 = rangeCheck("op1Decay2", op1Decay2);
  }

  get op2Decay2(): number {
    return this.instrument.op2Decay2;
  }

  set op2Decay2(op2Decay2: number) {
    this.instrument.op2Decay2 = rangeCheck("op2Decay2", op2Decay2);
  }

  get op3Decay2(): number {
    return this.instrument.op3Decay2;
  }

  set op3Decay2(op3Decay2: number) {
    this.instrument.op3Decay2 = rangeCheck("op3Decay2", op3Decay2);
  }

  get op4Decay2(): number {
    return this.instrument.op4Decay2;
  }

  set op4Decay2(op4Decay2: number) {
    this.instrument.op4Decay2 = rangeCheck("op4Decay2", op4Decay2);
  }

  get op1Multiple(): number {
    return this.instrument.op1Multiple;
  }

  set op1Multiple(op1Multiple: number) {
    this.instrument.op1Multiple = rangeCheck("op1Multiple", op1Multiple);
  }

  get op2Multiple(): number {
    return this.instrument.op2Multiple;
  }

  set op2Multiple(op2Multiple: number) {
    this.instrument.op2Multiple = rangeCheck("op2Multiple", op2Multiple);
  }

  get op3Multiple(): number {
    return this.instrument.op3Multiple;
  }

  set op3Multiple(op3Multiple: number) {
    this.instrument.op3Multiple = rangeCheck("op3Multiple", op3Multiple);
  }

  get op4Multiple(): number {
    return this.instrument.op4Multiple;
  }

  set op4Multiple(op4Multiple: number) {
    this.instrument.op4Multiple = rangeCheck("op4Multiple", op4Multiple);
  }

  get op1RateScaling(): number {
    return this.instrument.op1RateScaling;
  }

  set op1RateScaling(op1RateScaling: number) {
    this.instrument.op1RateScaling = rangeCheck(
      "op1RateScaling",
      op1RateScaling
    );
  }

  get op2RateScaling(): number {
    return this.instrument.op2RateScaling;
  }

  set op2RateScaling(op2RateScaling: number) {
    this.instrument.op2RateScaling = rangeCheck(
      "op2RateScaling",
      op2RateScaling
    );
  }

  get op3RateScaling(): number {
    return this.instrument.op3RateScaling;
  }

  set op3RateScaling(op3RateScaling: number) {
    this.instrument.op3RateScaling = rangeCheck(
      "op3RateScaling",
      op3RateScaling
    );
  }

  get op4RateScaling(): number {
    return this.instrument.op4RateScaling;
  }

  set op4RateScaling(op4RateScaling: number) {
    this.instrument.op4RateScaling = rangeCheck(
      "op4RateScaling",
      op4RateScaling
    );
  }

  get op1Level2(): number {
    return this.instrument.op1Level2;
  }

  set op1Level2(op1Level2: number) {
    this.instrument.op1Level2 = rangeCheck("op1Level2", op1Level2);
  }

  get op2Level2(): number {
    return this.instrument.op2Level2;
  }

  set op2Level2(op2Level2: number) {
    this.instrument.op2Level2 = rangeCheck("op2Level2", op2Level2);
  }

  get op3Level2(): number {
    return this.instrument.op3Level2;
  }

  set op3Level2(op3Level2: number) {
    this.instrument.op3Level2 = rangeCheck("op3Level2", op3Level2);
  }

  get op4Level2(): number {
    return this.instrument.op4Level2;
  }

  set op4Level2(op4Level2: number) {
    this.instrument.op4Level2 = rangeCheck("op4Level2", op4Level2);
  }

  get op1Release(): number {
    return this.instrument.op1Release;
  }

  set op1Release(op1Release: number) {
    this.instrument.op1Release = rangeCheck("op1Release", op1Release);
  }

  get op2Release(): number {
    return this.instrument.op2Release;
  }

  set op2Release(op2Release: number) {
    this.instrument.op2Release = rangeCheck("op2Release", op2Release);
  }

  get op3Release(): number {
    return this.instrument.op3Release;
  }

  set op3Release(op3Release: number) {
    this.instrument.op3Release = rangeCheck("op3Release", op3Release);
  }

  get op4Release(): number {
    return this.instrument.op4Release;
  }

  set op4Release(op4Release: number) {
    this.instrument.op4Release = rangeCheck("op4Release", op4Release);
  }

  get op1LfoEnable(): number {
    return this.instrument.op1LfoEnable;
  }

  set op1LfoEnable(op1LfoEnable: number) {
    this.instrument.op1LfoEnable = rangeCheck("op1LfoEnable", op1LfoEnable);
  }

  get op2LfoEnable(): number {
    return this.instrument.op2LfoEnable;
  }

  set op2LfoEnable(op2LfoEnable: number) {
    this.instrument.op2LfoEnable = rangeCheck("op2LfoEnable", op2LfoEnable);
  }

  get op3LfoEnable(): number {
    return this.instrument.op3LfoEnable;
  }

  set op3LfoEnable(op3LfoEnable: number) {
    this.instrument.op3LfoEnable = rangeCheck("op3LfoEnable", op3LfoEnable);
  }

  get op4LfoEnable(): number {
    return this.instrument.op4LfoEnable;
  }

  set op4LfoEnable(op4LfoEnable: number) {
    this.instrument.op4LfoEnable = rangeCheck("op4LfoEnable", op4LfoEnable);
  }

  get op1SSGEG(): number {
    return this.instrument.op1SSGEG;
  }

  set op1SSGEG(op1SSGEG: number) {
    this.instrument.op1SSGEG = rangeCheck("op1SSGEG", op1SSGEG);
  }

  get op2SSGEG(): number {
    return this.instrument.op2SSGEG;
  }

  set op2SSGEG(op2SSGEG: number) {
    this.instrument.op2SSGEG = rangeCheck("op2SSGEG", op2SSGEG);
  }

  get op3SSGEG(): number {
    return this.instrument.op3SSGEG;
  }

  set op3SSGEG(op3SSGEG: number) {
    this.instrument.op3SSGEG = rangeCheck("op3SSGEG", op3SSGEG);
  }

  get op4SSGEG(): number {
    return this.instrument.op4SSGEG;
  }

  set op4SSGEG(op4SSGEG: number) {
    this.instrument.op4SSGEG = rangeCheck("op4SSGEG", op4SSGEG);
  }
}
