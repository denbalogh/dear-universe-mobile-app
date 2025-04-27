import { getHashFromString } from "@/common/utils/crypto";
import { LOCK_LENGTH } from "./constants";

export const isCodeLengthValid = (code: string) => {
  return code.length === LOCK_LENGTH;
};

export const areCodesMatching = (code: string, codeConfirm: string) => {
  return code === codeConfirm;
};

export const isCodeHashValid = async (code: string, hash: string) => {
  return (await getHashFromString(code)) === hash;
};
