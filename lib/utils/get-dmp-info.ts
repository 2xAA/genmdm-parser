// format check from
// https://github.com/Wohlstand/OPN2BankEditor/blob/master/src/FileFormats/format_deflemask_dmp.cpp

const dmpInstrumentModeError = new Error(
  `DMP instrument mode error. FM instruments only.`
);

const dmpInstrumentSystemError = new Error(
  `DMP instrument system error. Sega Genesis only.`
);

interface DMPInfo {
  headOffset: number;
  dataOffset: number;
}

export function getDmpInfo(dmp: Uint8Array): DMPInfo {
  let headOffset = 3;
  let dataOffset = 7;

  switch (dmp[0]) {
    case 0x00: // Oldest format
      headOffset = 1;
      dataOffset = 5;
      break;

    case 0x01:
    case 0x02:
    case 0x03:
    case 0x04:
    case 0x05:
    case 0x06:
    case 0x07:
    case 0x08:
    /* FIXME: Check validy of those versions!!! */

    case 0x0a:
      headOffset = 2;
      dataOffset = 6;
      if (dmp[1] != 0x01) {
        // FM only is supported, STANDARD is not supported
        throw dmpInstrumentModeError;
      }
      break;

    case 0x09:
      headOffset = 3;
      dataOffset = 7;
      if (dmp[1] != 0x01) {
        // FM only is supported, STANDARD is not supported
        throw dmpInstrumentModeError;
      }
      break;

    case 0x0b:
      headOffset = 3;
      dataOffset = 7;
      if (dmp[1] != 0x02) {
        // Genesis type is only supported
        throw dmpInstrumentSystemError;
      }

      if (dmp[2] != 0x01) {
        // FM only is supported, STANDARD is not supported
        throw dmpInstrumentModeError;
      }
      break;
    default:
      throw new Error("DMP error - is the DMP version greater than v1.0.0?");
  }

  return {
    dataOffset,
    headOffset,
  };
}
