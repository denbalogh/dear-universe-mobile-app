// Polyfill for React Native's `crypto` module
import "react-native-get-random-values";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import PaperProviderWithTheme from "@/common/providers/PaperProviderWithTheme";
import { setNotificationHandler } from "expo-notifications";
import ConfirmDialogProvider from "@/common/providers/ConfirmDialogProvider";
import SnackbarProvider from "@/common/providers/SnackbarProvider";
import SettingsDrawerProvider from "@/common/providers/SettingsDrawerProvider/SettingsDrawerProvider";
import SettingsProvider from "@/common/providers/SettingsProvider";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Layout() {
  return (
    <SettingsProvider>
      <PaperProviderWithTheme>
        <ConfirmDialogProvider>
          <SnackbarProvider>
            <GestureHandlerRootView>
              <SettingsDrawerProvider>
                <Stack screenOptions={{ animation: "fade_from_bottom" }} />
              </SettingsDrawerProvider>
            </GestureHandlerRootView>
          </SnackbarProvider>
        </ConfirmDialogProvider>
      </PaperProviderWithTheme>
    </SettingsProvider>
  );
}
