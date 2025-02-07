// Polyfill for React Native's `crypto` module
import "react-native-get-random-values";

import { Stack, usePathname } from "expo-router";
import Constants from "expo-constants";
import Storybook from "../.storybook";
import { RealmProvider } from "@realm/react";
import { schemas } from "@/models";
import { SnackbarContextProvider } from "@/contexts/SnackbarContext";
import { ConfirmDialogContextProvider } from "@/contexts/ConfirmDialogContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SettingsDrawerContextProvider } from "@/contexts/SettingsDrawerContext";
import PaperProviderWithTheme from "@/components/PaperProviderWithTheme.tsx/PaperProviderWithTheme";
import { setNotificationHandler } from "expo-notifications";
import { useEffect } from "react";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";
import { getAnalytics, logScreenView } from "@react-native-firebase/analytics";

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

const App = () => {
  const pathname = usePathname();

  useEffect(() => {
    log(getCrashlytics(), "App mounted.");
  }, []);

  useEffect(() => {
    log(getCrashlytics(), `Navigated to ${pathname}`);
    logScreenView(getAnalytics(), { screen_name: pathname });
  }, [pathname]);

  return (
    <RealmProvider schema={schemas} schemaVersion={9} path="default.realm">
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
    </RealmProvider>
  );
};

let AppEntryPoint = App;

if (Constants?.expoConfig?.extra?.storybookEnabled === "true") {
  AppEntryPoint = Storybook;
}

export default AppEntryPoint;
