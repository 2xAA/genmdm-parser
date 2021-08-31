import GenMDMParser from "../lib/main";

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
