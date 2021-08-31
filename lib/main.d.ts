export declare interface GenMInstrumentValues {
  /** number in the range of 0-127 */
  instrumentIndex: number;

  /** number in the range of 0-7 */
  algorithm: number;

  /** number in the range of 0-7 */
  lfoFm: number;

  /** number in the range of 0-7 */
  lfoAm: number;

  /** number in the range of 0-7 */
  fmFeedback: number;

  /** number in the range of 0-3 */
  panning: number;

  /** number in the range of 0-127 */
  op1TotalLevel: number;

  /** number in the range of 0-127 */
  op2TotalLevel: number;

  /** number in the range of 0-127 */
  op3TotalLevel: number;

  /** number in the range of 0-127 */
  op4TotalLevel: number;

  /** number in the range of 0-7 */
  op1Detune: number;

  /** number in the range of 0-7 */
  op2Detune: number;

  /** number in the range of 0-7 */
  op3Detune: number;

  /** number in the range of 0-7 */
  op4Detune: number;

  /** number in the range of 0-31 */
  op1Attack: number;

  /** number in the range of 0-31 */
  op2Attack: number;

  /** number in the range of 0-31 */
  op3Attack: number;

  /** number in the range of 0-31 */
  op4Attack: number;

  /** number in the range of 0-31 */
  op1Decay1: number;

  /** number in the range of 0-31 */
  op2Decay1: number;

  /** number in the range of 0-31 */
  op3Decay1: number;

  /** number in the range of 0-31 */
  op4Decay1: number;

  /** number in the range of 0-31 */
  op1Decay2: number;

  /** number in the range of 0-31 */
  op2Decay2: number;

  /** number in the range of 0-31 */
  op3Decay2: number;

  /** number in the range of 0-31 */
  op4Decay2: number;

  /** number in the range of 0-15 */
  op1Multiple: number;

  /** number in the range of 0-15 */
  op2Multiple: number;

  /** number in the range of 0-15 */
  op3Multiple: number;

  /** number in the range of 0-15 */
  op4Multiple: number;

  /** number in the range of 0-3 */
  op1RateScaling: number;

  /** number in the range of 0-3 */
  op2RateScaling: number;

  /** number in the range of 0-3 */
  op3RateScaling: number;

  /** number in the range of 0-3 */
  op4RateScaling: number;

  /** number in the range of 0-15 */
  op1Level2: number;

  /** number in the range of 0-15 */
  op2Level2: number;

  /** number in the range of 0-15 */
  op3Level2: number;

  /** number in the range of 0-15 */
  op4Level2: number;

  /** number in the range of 0-15 */
  op1Release: number;

  /** number in the range of 0-15 */
  op2Release: number;

  /** number in the range of 0-15 */
  op3Release: number;

  /** number in the range of 0-15 */
  op4Release: number;

  /** number in the range of 0-1 */
  op1LfoEnable: number;

  /** number in the range of 0-1 */
  op2LfoEnable: number;

  /** number in the range of 0-1 */
  op3LfoEnable: number;

  /** number in the range of 0-1 */
  op4LfoEnable: number;

  /** number in the range of 0-7 */
  op1SSGEG: number;

  /** number in the range of 0-7 */
  op2SSGEG: number;

  /** number in the range of 0-7 */
  op3SSGEG: number;

  /** number in the range of 0-7 */
  op4SSGEG: number;

  instrumentName: string;
}
