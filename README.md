# GenMDM Parser
> A parser for file formats related to the GenMDM (.genm, .tfi, .dmp)

## Usage

```TypeScript
import { GenMDMParser } from 'genmdm-parser';

const genmFile = `0, 4 0 0 4 3 97 97 100 100 6 0 6 0 31 31 24 24 16 13 12 12 2 2 8 8 4 4 2 4 0 0 0 0 4 3 1 1 2 2 6 6 0 0 0 0 0 0 0 0 01_capcom_logo_37.tfi;
1, 0 0 0 0 3 107 103 107 100 5 6 4 6 31 26 28 31 20 16 20 7 3 4 2 3 6 0 5 1 2 1 1 2 4 2 6 1 3 3 3 6 0 0 0 0 0 0 0 0 03_player_select_12.tfi;`;

const parser = new GenMDMParser();
const parsed = parser.parseGenm(genmFile);

parsed.forEach(instrument => {
  console.log(instrument.toJSON());
  console.log(instrument.toString());
  console.log(instrument.toTFI());
  console.log(instrument.toDMP());
});
```
