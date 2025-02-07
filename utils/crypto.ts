import { getCrashlytics, log } from "@react-native-firebase/crashlytics";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";

export const getHashFromString = async (str: string): Promise<string> => {
  log(getCrashlytics(), "Hashing string");
  return await digestStringAsync(CryptoDigestAlgorithm.SHA512, str);
};
