import Constants from "expo-constants";

const { adsTest, hideAds } = Constants?.expoConfig?.extra || {};

export const EXPO_CONFIG_EXTRA = {
  adsTest,
  hideAds,
};
