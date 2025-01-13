// Polyfill for React Native's `crypto` module
import "react-native-get-random-values";

import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import Constants from "expo-constants";
import Storybook from "../.storybook";
import { RealmProvider } from "@realm/react";
import { schemas } from "@/models";

import { themeDark, themeLight } from "@/constants/theme";
import { Appearance, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { SnackbarContextProvider } from "@/contexts/SnackbarContext";
import { setBackgroundColorAsync } from "expo-system-ui";
import { ConfirmDialogContextProvider } from "@/contexts/ConfirmDialogContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

registerTranslation("en", enGB);

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const App = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(({ colorScheme }) => {
    setColorScheme(colorScheme);
  });

  const theme = colorScheme === "dark" ? themeDark : themeLight;

  useEffect(() => {
    const setRootBackgroundColor = async () =>
      await setBackgroundColorAsync(theme.colors.surface); // For keyboard background color

    setRootBackgroundColor();
  }, [theme]);

  return (
    <PaperProvider theme={theme}>
      <RealmProvider schema={schemas} schemaVersion={3}>
        <ConfirmDialogContextProvider>
          <SnackbarContextProvider>
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: theme.colors.background },
              ]}
            />
            <StatusBar translucent={true} />
            <GestureHandlerRootView>
              <Stack />
            </GestureHandlerRootView>
          </SnackbarContextProvider>
        </ConfirmDialogContextProvider>
      </RealmProvider>
    </PaperProvider>
  );
};

let AppEntryPoint = App;

if (Constants?.expoConfig?.extra?.storybookEnabled === "true") {
  AppEntryPoint = Storybook;
}

export default AppEntryPoint;
