import { getAnalytics, logAppOpen } from "@react-native-firebase/analytics";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

const useAppState = (): AppStateStatus => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);

  useEffect(() => {
    log(getCrashlytics(), "AppState - add listener");
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppStateVisible(nextAppState);

      if (nextAppState === "active") {
        logAppOpen(getAnalytics());
        log(getCrashlytics(), "App is in the foreground");
      } else {
        log(getCrashlytics(), "App is not in the foreground");
      }
    });

    return () => {
      log(getCrashlytics(), "AppState - remove listener");
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};

export default useAppState;
