import { signInAnonymously, signOut } from "@react-native-firebase/auth";
import { useCallback, useEffect } from "react";
import useSettingsObject from "./useSettingsObject";
import { setCrashlyticsCollectionEnabled } from "@react-native-firebase/crashlytics";
import { setAnalyticsCollectionEnabled } from "@react-native-firebase/analytics";
import { getApp } from "@react-native-firebase/app";

const useFirebaseAuthAndAnalyticsConsentHandler = () => {
  const { settingsObject } = useSettingsObject();

  const { analyticsConsent = false } = settingsObject || {};

  const handleAnonymousSignIn = async () => {
    await signInAnonymously(getApp().auth());
  };

  const handleLogOut = async () => {
    await signOut(getApp().auth());
  };

  const handleSetConsent = useCallback((enabled: boolean) => {
    setCrashlyticsCollectionEnabled(getApp().crashlytics(), enabled);
    setAnalyticsCollectionEnabled(getApp().analytics(), enabled);
  }, []);

  useEffect(() => {
    if (analyticsConsent) {
      handleAnonymousSignIn();
      handleSetConsent(true);
    } else {
      handleLogOut();
      handleSetConsent(false);
    }
  }, [analyticsConsent, handleSetConsent]);
};

export default useFirebaseAuthAndAnalyticsConsentHandler;
