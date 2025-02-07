import { getCrashlytics, log } from "@react-native-firebase/crashlytics";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

const useIsKeyboardOpen = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    log(getCrashlytics(), "Keyboard - didShow add listener");
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });
    log(getCrashlytics(), "Keyboard - didHide add listener");
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      log(getCrashlytics(), "Keyboard - remove listener");
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return isKeyboardOpen;
};

export default useIsKeyboardOpen;
