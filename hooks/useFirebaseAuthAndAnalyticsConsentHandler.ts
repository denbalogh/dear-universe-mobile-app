import {
  getAuth,
  signInAnonymously,
  signOut,
} from "@react-native-firebase/auth";
import { useCallback, useEffect } from "react";
import useSettingsObject from "./useSettingsObject";
import {
  getCrashlytics,
  setCrashlyticsCollectionEnabled,
} from "@react-native-firebase/crashlytics";
import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from "@react-native-firebase/analytics";

const useFirebaseAuthAndAnalyticsConsentHandler = () => {
  const { settingsObject } = useSettingsObject();

  const { analyticsConsent = false } = settingsObject || {};

  const handleAnonymousSignIn = async () => {
    await signInAnonymously(getAuth());
  };

  const handleLogOut = async () => {
    await signOut(getAuth());
  };

  const handleSetConsent = useCallback((enabled: boolean) => {
    setCrashlyticsCollectionEnabled(getCrashlytics(), enabled);
    setAnalyticsCollectionEnabled(getAnalytics(), enabled);
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
