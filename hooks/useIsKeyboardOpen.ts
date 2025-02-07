import logCrashlytics from "@/utils/logCrashlytics";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

const useIsKeyboardOpen = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    logCrashlytics("Keyboard - didShow add listener");
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });
    logCrashlytics("Keyboard - didHide add listener");
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      logCrashlytics("Keyboard - remove listener");
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return isKeyboardOpen;
};

export default useIsKeyboardOpen;
