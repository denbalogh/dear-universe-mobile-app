import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import useSettingsObject from "./useSettingsObject";

const useLockScreenHandler = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

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
};

export default useLockScreenHandler;
