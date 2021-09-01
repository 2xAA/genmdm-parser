import * as chai from "chai";
import chaiBytes from "chai-bytes";
import { GenMDMParser } from "./main";

const { expect } = chai.use(chaiBytes);

const genMdmFile = `0, 4 0 0 4 3 97 97 100 100 6 0 6 0 31 31 24 24 16 13 12 12 2 2 8 8 4 4 2 4 0 0 0 0 4 3 1 1 2 2 6 6 0 0 0 0 0 0 0 0 01_capcom_logo_37.tfi;
1, 0 0 0 0 3 107 103 107 100 5 6 4 6 31 26 28 31 20 16 20 7 3 4 2 3 6 0 5 1 2 1 1 2 4 2 6 1 3 3 3 6 0 0 0 0 0 0 0 0 03_player_select_12.tfi;`;

const badGenMdmFile = `0, 4 0 0 4 3 97 97 100 100 100 0 6 0 31 31 24 24 16 13 12 12 2 2 8 8 4 4 2 4 0 0 0 0 4 3 1 1 2 2 6 6 0 0 0 0 0 0 0 0 01_capcom_logo_37.tfi;
1, 0 0 0 0 3 107 103 107 100 5 6 4 6 31 26 28 31 20 16 20 7 3 4 2 3 6 0 5 1 2 1 1 2 4 2 6 1 3 3 3 6 0 0 0 0 0 0 0 0 03_player_select_12.tfi;`;

const genMdmParsed = [
  {
    instrumentIndex: 0,
    algorithm: 4,
    lfoFm: 0,
    lfoAm: 0,
    fmFeedback: 4,
    panning: 3,
    op1TotalLevel: 97,
    op2TotalLevel: 97,
    op3TotalLevel: 100,
    op4TotalLevel: 100,
    op1Detune: 6,
    op2Detune: 0,
    op3Detune: 6,
    op4Detune: 0,
    op1Attack: 31,
    op2Attack: 31,
    op3Attack: 24,
    op4Attack: 24,
    op1Decay1: 16,
    op2Decay1: 13,
    op3Decay1: 12,
    op4Decay1: 12,
    op1Decay2: 2,
    op2Decay2: 2,
    op3Decay2: 8,
    op4Decay2: 8,
    op1Multiple: 4,
    op2Multiple: 4,
    op3Multiple: 2,
    op4Multiple: 4,
    op1RateScaling: 0,
    op2RateScaling: 0,
    op3RateScaling: 0,
    op4RateScaling: 0,
    op1Level2: 4,
    op2Level2: 3,
    op3Level2: 1,
    op4Level2: 1,
    op1Release: 2,
    op2Release: 2,
    op3Release: 6,
    op4Release: 6,
    op1LfoEnable: 0,
    op2LfoEnable: 0,
    op3LfoEnable: 0,
    op4LfoEnable: 0,
    op1SSGEG: 0,
    op2SSGEG: 0,
    op3SSGEG: 0,
    op4SSGEG: 0,
    instrumentName: "01_capcom_logo_37.tfi",
  },
  {
    instrumentIndex: 1,
    algorithm: 0,
    lfoFm: 0,
    lfoAm: 0,
    fmFeedback: 0,
    panning: 3,
    op1TotalLevel: 107,
    op2TotalLevel: 103,
    op3TotalLevel: 107,
    op4TotalLevel: 100,
    op1Detune: 5,
    op2Detune: 6,
    op3Detune: 4,
    op4Detune: 6,
    op1Attack: 31,
    op2Attack: 26,
    op3Attack: 28,
    op4Attack: 31,
    op1Decay1: 20,
    op2Decay1: 16,
    op3Decay1: 20,
    op4Decay1: 7,
    op1Decay2: 3,
    op2Decay2: 4,
    op3Decay2: 2,
    op4Decay2: 3,
    op1Multiple: 6,
    op2Multiple: 0,
    op3Multiple: 5,
    op4Multiple: 1,
    op1RateScaling: 2,
    op2RateScaling: 1,
    op3RateScaling: 1,
    op4RateScaling: 2,
    op1Level2: 4,
    op2Level2: 2,
    op3Level2: 6,
    op4Level2: 1,
    op1Release: 3,
    op2Release: 3,
    op3Release: 3,
    op4Release: 6,
    op1LfoEnable: 0,
    op2LfoEnable: 0,
    op3LfoEnable: 0,
    op4LfoEnable: 0,
    op1SSGEG: 0,
    op2SSGEG: 0,
    op3SSGEG: 0,
    op4SSGEG: 0,
    instrumentName: "03_player_select_12.tfi",
  },
];

const generatedTfi = [
  4, 4, 4, 6, 97, 0, 31, 16, 2, 2, 4, 0, 4, 0, 97, 0, 31, 13, 2, 2, 3, 0, 2, 6,
  100, 0, 24, 12, 8, 6, 1, 0, 4, 0, 100, 0, 24, 12, 8, 6, 1, 0,
];

const parsedTfi = {
  algorithm: 4,
  fmFeedback: 4,
  op1Multiple: 4,
  op1Detune: 6,
  op1TotalLevel: 97,
  op1RateScaling: 0,
  op1Attack: 31,
  op1Decay1: 16,
  op1Decay2: 2,
  op1Release: 2,
  op1Level2: 4,
  op1SSGEG: 0,
  op2Multiple: 4,
  op2Detune: 0,
  op2TotalLevel: 97,
  op2RateScaling: 0,
  op2Attack: 31,
  op2Decay1: 13,
  op2Decay2: 2,
  op2Release: 2,
  op2Level2: 3,
  op2SSGEG: 0,
  op3Multiple: 2,
  op3Detune: 6,
  op3TotalLevel: 100,
  op3RateScaling: 0,
  op3Attack: 24,
  op3Decay1: 12,
  op3Decay2: 8,
  op3Release: 6,
  op3Level2: 1,
  op3SSGEG: 0,
  op4Multiple: 4,
  op4Detune: 0,
  op4TotalLevel: 100,
  op4RateScaling: 0,
  op4Attack: 24,
  op4Decay1: 12,
  op4Decay2: 8,
  op4Release: 6,
  op4Level2: 1,
  op4SSGEG: 0,
};

const generatedDmp = [
  11, 2, 1, 0, 4, 4, 0, 4, 97, 31, 16, 2, 2, 0, 0, 6, 2, 0, 4, 97, 31, 13, 2, 2,
  0, 0, 0, 2, 0, 2, 100, 24,
];

const generatedMidiCcs = new Map<number, number>([
  [14, 64],
  [75, 0],
  [76, 0],
  [15, 64],
  [77, 95],
  [16, 96],
  [17, 96],
  [18, 99],
  [19, 99],
  [24, 95],
  [25, 0],
  [26, 95],
  [27, 0],
  [43, 123],
  [44, 123],
  [45, 95],
  [46, 95],
  [47, 64],
  [48, 52],
  [49, 48],
  [50, 48],
  [51, 8],
  [52, 8],
  [53, 32],
  [54, 32],
  [20, 32],
  [21, 32],
  [22, 16],
  [23, 32],
  [39, 0],
  [40, 0],
  [41, 0],
  [42, 0],
  [55, 32],
  [56, 24],
  [57, 8],
  [58, 8],
  [59, 16],
  [60, 16],
  [61, 48],
  [62, 48],
  [70, 0],
  [71, 0],
  [72, 0],
  [73, 0],
  [90, 0],
  [91, 0],
  [92, 0],
  [93, 0],
]);

describe("GenMDMParser", () => {
  it("can be constructed", () => {
    const parser = new GenMDMParser();

    expect(parser).instanceOf(GenMDMParser);
  });

  it("can parse a genm file", () => {
    const parser = new GenMDMParser();
    const parsed = parser.parseGenm(genMdmFile);
    const instruments = parsed.map((instrument) => instrument.toJSON());

    expect(instruments).to.eql(genMdmParsed);
  });

  it("can generate a genm file", () => {
    const parser = new GenMDMParser();
    const parsed = parser.parseGenm(genMdmFile);
    const genm = parser.generateGenm(parsed);

    expect(genm).equals(genMdmFile);
  });

  it("can parse TFI", () => {
    const parser = new GenMDMParser();
    const parsed = parser.parseTfi(Uint8Array.from(generatedTfi));
    const genm = parsed.toJSON();

    expect(genm).to.eql(parsedTfi);
  });

  it("can generate TFI", () => {
    const parser = new GenMDMParser();
    const parsed = parser.parseGenm(genMdmFile);
    const tfi = parsed.map((instrument) => instrument.toTFI());

    expect(tfi[0]).to.equalBytes(generatedTfi);
  });

  it("can generate DMP", () => {
    const parser = new GenMDMParser();
    const parsed = parser.parseGenm(genMdmFile);
    const dmps = parsed.map((instrument) => instrument.toDMP());

    expect(dmps[0]).to.equalBytes(generatedDmp);
  });

  it("can generate GenMDM MIDI CC values", () => {
    const parser = new GenMDMParser();
    const parsed = parser.parseGenm(genMdmFile);
    const midiCCs = parsed.map((instrument) => instrument.toGenMDM());

    expect(midiCCs[0]).to.eql(generatedMidiCcs);
  });

  it("throws an error when a value is out of range in a genm file", () => {
    const parser = new GenMDMParser();

    expect(() => {
      parser.parseGenm(badGenMdmFile);
    }).to.throw();
  });
});
