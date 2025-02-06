import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { BackHandler } from "react-native";

// This hook is used to handle the back button press on Android devices.
// Return TRUE to PREVENT the DEFAULT back button behavior.
// Return FALSE to ALLOW the DEFAULT back button behavior.

const useBackHandler = (func: () => boolean) => {
  useFocusEffect(
    useCallback(() => {
      getCrashlytics().log("Back handler - adding listener");
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        func,
      );
      return () => {
        getCrashlytics().log("Back handler - removing listener");
        subscription.remove();
      };
    }, [func]),
  );
};

export default useBackHandler;
