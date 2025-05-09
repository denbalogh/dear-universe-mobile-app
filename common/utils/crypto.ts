import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";

export const getHashFromString = async (str: string): Promise<string> => {
  return await digestStringAsync(CryptoDigestAlgorithm.SHA512, str);
};
