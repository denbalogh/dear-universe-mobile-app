import { EXPO_CONFIG_EXTRA } from "@/common/constants/expoConfig";
import {
  getTrackingPermissionsAsync,
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import { useCallback, useEffect, useRef } from "react";
import MobileAds, {
  AdsConsent,
  MaxAdContentRating,
} from "react-native-google-mobile-ads";

const testDeviceIdentifiers = [
  "EMULATOR",
  "47829423-68ef-4810-8043-83f3f108376c", // Samsung galaxy s24 ultra
  "a75e9df1-5ccb-4f83-ad6c-33f78845f542", // Samsung galaxy s10
];

const useAdsConsentHandler = () => {
  const isMobileAdsStartCalled = useRef(false);

  const startGoogleMobileAdsSDK = async () => {
    if (isMobileAdsStartCalled.current) {
      return;
    }

    const gdprApplies = await AdsConsent.getGdprApplies();
    const purposeContsent = await AdsConsent.getPurposeConsents();

    const hasConsentForPurposeOne =
      gdprApplies && purposeContsent.startsWith("1");

    if (!gdprApplies || hasConsentForPurposeOne) {
      const { status } = await getTrackingPermissionsAsync();
      if (status === PermissionStatus.UNDETERMINED) {
        await requestTrackingPermissionsAsync();
      }
    }

    await MobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
      testDeviceIdentifiers,
    });

    await MobileAds().initialize();
    isMobileAdsStartCalled.current = true;
  };

  const handleAskConsent = useCallback(async () => {
    if (EXPO_CONFIG_EXTRA.hideAds) {
      return;
    }

    const { canRequestAds: gatherConsentCanRequestAds } =
      await AdsConsent.gatherConsent({
        testDeviceIdentifiers,
      });
    const { canRequestAds: getConsentInfoCanRequestAds } =
      await AdsConsent.getConsentInfo();

    if (gatherConsentCanRequestAds || getConsentInfoCanRequestAds) {
      startGoogleMobileAdsSDK();
    }
  }, []);

  useEffect(() => {
    handleAskConsent();
  }, [handleAskConsent]);
};

export default useAdsConsentHandler;
