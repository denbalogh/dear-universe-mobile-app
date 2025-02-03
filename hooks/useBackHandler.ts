import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { BackHandler } from "react-native";

// This hook is used to handle the back button press on Android devices.
// Return TRUE to PREVENT the DEFAULT back button behavior.
// Return FALSE to ALLOW the DEFAULT back button behavior.

const useBackHandler = (func: () => boolean) => {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        func,
      );
      return () => subscription.remove();
    }, [func]),
  );
};

export default useBackHandler;
