export function packDetuneMultiple(detune: number, multiple: number): number {
  let out = 0;
  out |= 0x70 & (detune << 4);
  out |= 0x0f & multiple;

  return out;
}

export function packRateScalingAttack(
  rateScaling: number,
  attack: number
): number {
  let out = 0;
  out |= 0xc0 & (rateScaling << 6);
  out |= 0x1f & attack;

  return out;
}

export function packAmEnableFirstDecay(
  amEnable: number,
  firstDecay: number
): number {
  let out = 0;
  out |= 0x80 & (amEnable << 7);
  out |= 0x1f & firstDecay;

  return out;
}

export function packSustainRelease(sustain: number, release: number): number {
  let out = 0;
  out |= 0xf0 & (sustain << 4);
  out |= 0x0f & release;

  return out;
}
