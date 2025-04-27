import { logAppOpen } from "@react-native-firebase/analytics";
import { getApp } from "@react-native-firebase/app";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

const useAppState = (): AppStateStatus => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppStateVisible(nextAppState);

      if (nextAppState === "active") {
        logAppOpen(getApp().analytics());
      } else {
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};

export default useAppState;
