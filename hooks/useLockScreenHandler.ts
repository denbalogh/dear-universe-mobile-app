import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import useSettingsObject from "./useSettingsObject";
import useAppState from "./useAppState";
import { useSettingsDrawer } from "@/contexts/SettingsDrawerContext";

const useLockScreenHandler = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const appState = useAppState();
  const { closeSettingsDrawer } = useSettingsDrawer();

  const { settingsObject } = useSettingsObject();
  const hasLock = !!settingsObject?.lockCodeHash;

  const hasCheckedTheLockInitially = useRef(false);

  // Initial lock screen check
  useEffect(() => {
    if (!rootNavigationState.key || hasCheckedTheLockInitially.current) {
      return;
    }

    if (hasLock) {
      router.navigate({
        pathname: "/lock",
      });
    }

    hasCheckedTheLockInitially.current = true;
  }, [hasLock, router, rootNavigationState.key]);

  // Lock screen check when app goes into background
  useEffect(() => {
    if (hasLock && appState !== "active") {
      closeSettingsDrawer();
      router.navigate({
        pathname: "/lock",
      });
    }
  }, [appState, hasLock, router, closeSettingsDrawer]);
};

export default useLockScreenHandler;
