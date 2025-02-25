import Constants from "expo-constants";

const { storybookEnabled, adsTest, hideAds } =
  Constants?.expoConfig?.extra || {};

export const EXPO_CONFIG_EXTRA = {
  storybookEnabled,
  adsTest,
  hideAds,
};
