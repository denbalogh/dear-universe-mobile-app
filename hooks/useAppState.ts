import logCrashlytics from "@/utils/logCrashlytics";
import { logAppOpen } from "@react-native-firebase/analytics";
import { getApp } from "@react-native-firebase/app";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

const useAppState = (): AppStateStatus => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);

  useEffect(() => {
    logCrashlytics("AppState - add listener");
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppStateVisible(nextAppState);

      if (nextAppState === "active") {
        logAppOpen(getApp().analytics());
        logCrashlytics("App is in the foreground");
      } else {
        logCrashlytics("App is not in the foreground");
      }
    });

    return () => {
      logCrashlytics("AppState - remove listener");
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};

export default useAppState;
