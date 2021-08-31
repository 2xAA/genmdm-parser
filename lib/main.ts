import { GenmInstrument } from "./GenmInstrument";

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
}
