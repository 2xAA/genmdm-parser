export function unpackDetuneMultiple(value: number): [number, number] {
  return [(value >> 4) & 0x07, value & 0x0f];
}

export function unpackRateScalingAttack(value: number): [number, number] {
  return [(value >> 6) & 0x03, value & 0x1f];
}

export function unpackAmEnableFirstDecay(value: number): [number, number] {
  return [(value >> 7) & 0x01, value & 0x1f];
}

export function unpackSustainRelease(value: number): [number, number] {
  return [(value >> 4) & 0x0f, value & 0x0f];
}
