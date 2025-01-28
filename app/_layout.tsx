// Polyfill for React Native's `crypto` module
import "react-native-get-random-values";

import { Stack } from "expo-router";
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

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const App = () => (
  <RealmProvider schema={schemas} schemaVersion={3} path="default.realm">
    <PaperProviderWithTheme>
      <ConfirmDialogContextProvider>
        <SnackbarContextProvider>
          <GestureHandlerRootView>
            <SettingsDrawerContextProvider>
              <Stack screenOptions={{ header: () => null }} />
            </SettingsDrawerContextProvider>
          </GestureHandlerRootView>
        </SnackbarContextProvider>
      </ConfirmDialogContextProvider>
    </PaperProviderWithTheme>
  </RealmProvider>
);

let AppEntryPoint = App;

if (Constants?.expoConfig?.extra?.storybookEnabled === "true") {
  AppEntryPoint = Storybook;
}

export default AppEntryPoint;
