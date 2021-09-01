import { mapToRange } from "./map-to-range";

export function mapToCCRange(value: number, range: number): number {
  return mapToRange(value, range, 127);
}
