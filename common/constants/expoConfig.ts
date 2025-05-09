import Constants from "expo-constants";
import { z } from "zod";

const expoConfigSchema = z.object({
  GOOGLE_ADS_ANDROID_APP_ID: z.string(),
  GOOGLE_ADS_IOS_APP_ID: z.string(),
});

export const EXPO_CONFIG_EXTRA = expoConfigSchema.parse(
  Constants?.expoConfig?.extra,
);
