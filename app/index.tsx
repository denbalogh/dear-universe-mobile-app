import { Stack, useRootNavigationState, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTheme } from "react-native-paper";
import useSettingsObject from "@/hooks/useSettingsObject";
import { LOCK_SCREEN_NAVIGATE_TO_APP } from "@/constants/screens";

const LoadingScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { settingsObject } = useSettingsObject();

  const hasLock = settingsObject?.lockCodeHash;

  useEffect(() => {
    if (!rootNavigationState.key) {
      return;
    }

    if (hasLock) {
      router.replace({
        pathname: "/lock",
        params: LOCK_SCREEN_NAVIGATE_TO_APP,
      });
    } else {
      router.replace({ pathname: "/app" });
    }
  }, [hasLock, router, rootNavigationState.key]);

  return (
    <Stack.Screen
      options={{
        navigationBarColor: theme.colors.background,
      }}
    />
  );
};

export default LoadingScreen;
