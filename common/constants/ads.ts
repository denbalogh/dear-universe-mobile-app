import { Platform } from "react-native";

export const AD_ID = {
  android: process.env.GOOGLE_ADS_ANDROID_APP_ID || "",
  ios: process.env.GOOGLE_ADS_IOS_APP_ID || "",
}[Platform.OS as "android" | "ios"];
