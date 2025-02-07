import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import logCrashlytics from "./logCrashlytics";

export const getHashFromString = async (str: string): Promise<string> => {
  logCrashlytics("Hashing string");
  return await digestStringAsync(CryptoDigestAlgorithm.SHA512, str);
};
