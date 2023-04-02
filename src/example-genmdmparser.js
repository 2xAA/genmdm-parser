import { GenMDMParser } from "../lib/main";

window.GenMDMParser = GenMDMParser;

const expected = `0, 4 0 0 4 3 97 97 100 100 6 0 6 0 31 31 24 24 16 13 12 12 2 2 8 8 4 4 2 4 0 0 0 0 4 3 1 1 2 2 6 6 0 0 0 0 0 0 0 0 01_capcom_logo_37.tfi;
1, 0 0 0 0 3 107 103 107 100 5 6 4 6 31 26 28 31 20 16 20 7 3 4 2 3 6 0 5 1 2 1 1 2 4 2 6 1 3 3 3 6 0 0 0 0 0 0 0 0 03_player_select_12.tfi;`;

console.log("input genm");
console.log(expected);

const parser = new GenMDMParser();
const parsed = parser.parseGenm(expected);

console.log("\nparsed genm data");
console.log(parsed);

const genM = parser.generateGenm(parsed);
console.log("\ngenerated genm");
console.log(genM);

console.log("\ngenm output matches genm input?", expected === genM);

console.log("\ngenerated TFI");
console.log(parsed.map((instrument) => instrument.toTFI()));

console.log("\ngenerated DMP");
console.log(parsed.map((instrument) => instrument.toDMP()));

const y12 = new Uint8Array([
  100, 15, 5, 31, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 14, 5, 31, 8, 9, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 4, 21, 31, 31, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
  21, 31, 31, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 84, 105, 109, 101, 32, 84, 114, 97, 120, 32, 40, 112, 114,
  111, 116, 111, 84, 105, 109, 101, 32, 84, 114, 97, 120, 32, 40, 112, 114, 111,
  116, 111, 84, 105, 109, 101, 32, 84, 114, 97, 120, 32, 40, 112, 114, 111, 116,
  111,
]);

const parsedY12 = parser.parseY12(y12);
console.log("\nparsed y12");
console.log(parsedY12);

console.log("\ntfi from y12");
console.log(parsedY12.toTFI());
