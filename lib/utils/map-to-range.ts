export function mapToRange(
  value: number,
  range: number,
  maxValue: number
): number {
  return Math.round((value / range) * maxValue);
}
