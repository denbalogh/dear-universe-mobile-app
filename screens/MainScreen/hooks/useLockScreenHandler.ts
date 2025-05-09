import { useSettings } from "@/common/providers/SettingsProvider";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useRef } from "react";

const useLockScreenHandler = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { lockCodeHash } = useSettings();

  const hasCheckedTheLockInitially = useRef(false);

  // Initial lock screen check
  useEffect(() => {
    if (!rootNavigationState.key || hasCheckedTheLockInitially.current) {
      return;
    }

    if (lockCodeHash) {
      router.navigate({
        pathname: "/lock",
      });
    }

    hasCheckedTheLockInitially.current = true;
  }, [lockCodeHash, router, rootNavigationState.key]);
};

export default useLockScreenHandler;
