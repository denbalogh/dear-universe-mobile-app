import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";

export const getHashFromString = async (str: string): Promise<string> => {
  getCrashlytics().log("Hashing string");
  return await digestStringAsync(CryptoDigestAlgorithm.SHA512, str);
};
