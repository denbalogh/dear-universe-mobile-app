import { useRouter } from "expo-router";
import { useEffect } from "react";
import useSettingsObject from "./useSettingsObject";
import useAppState from "./useAppState";
import { LOCK_SCREEN_NAVIGATE_TO_PREVIOUS } from "@/constants/screens";

const useLockScreenHandler = () => {
  const router = useRouter();
  const { settingsObject } = useSettingsObject();
  const appState = useAppState();

  const hasLock = !!settingsObject?.lockCodeHash;

  useEffect(() => {
    if (appState !== "active" && hasLock) {
      router.navigate({
        pathname: "/lock",
        params: LOCK_SCREEN_NAVIGATE_TO_PREVIOUS,
      });
    }
  }, [appState, hasLock, router]);
};

export default useLockScreenHandler;
