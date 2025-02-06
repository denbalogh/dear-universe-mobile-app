import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

const useAppState = (): AppStateStatus => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);

  useEffect(() => {
    getCrashlytics().log("AppState - add listener");
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setAppStateVisible(nextAppState);
    });

    return () => {
      getCrashlytics().log("AppState - remove listener");
      subscription.remove();
    };
  }, []);

  return appStateVisible;
};

export default useAppState;
