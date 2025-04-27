// Polyfill for React Native's `crypto` module
import "react-native-get-random-values";

import { Stack } from "expo-router";
import { SnackbarContextProvider } from "@/common/contexts/SnackbarContext";
import { ConfirmDialogContextProvider } from "@/common/contexts/ConfirmDialogContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SettingsDrawerContextProvider } from "@/common/contexts/SettingsDrawerContext/SettingsDrawerContext";
import PaperProviderWithTheme from "@/common/components/PaperProviderWithTheme";
import { setNotificationHandler } from "expo-notifications";

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
    <PaperProviderWithTheme>
      <ConfirmDialogContextProvider>
        <SnackbarContextProvider>
          <GestureHandlerRootView>
            <SettingsDrawerContextProvider>
              <Stack screenOptions={{ animation: "fade_from_bottom" }} />
            </SettingsDrawerContextProvider>
          </GestureHandlerRootView>
        </SnackbarContextProvider>
      </ConfirmDialogContextProvider>
    </PaperProviderWithTheme>
  );
}
