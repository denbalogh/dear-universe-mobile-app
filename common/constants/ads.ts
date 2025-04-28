import { Platform } from "react-native";
import { EXPO_CONFIG_EXTRA } from "./expoConfig";

export const AD_ID = {
  android: EXPO_CONFIG_EXTRA.GOOGLE_ADS_ANDROID_APP_ID,
  ios: EXPO_CONFIG_EXTRA.GOOGLE_ADS_IOS_APP_ID,
}[Platform.OS as "android" | "ios"];
