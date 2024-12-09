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
import { useState } from "react";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { SnackbarContextProvider } from "@/contexts/SnackbarContext/SnackbarContext";

registerTranslation("en", enGB);

const App = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(({ colorScheme }) => {
    setColorScheme(colorScheme);
  });

  const theme = colorScheme === "dark" ? themeDark : themeLight;

  return (
    <PaperProvider theme={theme}>
      <RealmProvider schema={schemas} schemaVersion={3}>
        <SnackbarContextProvider>
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.colors.background },
            ]}
          />
          <Stack />
        </SnackbarContextProvider>
      </RealmProvider>
    </PaperProvider>
  );
};

let AppEntryPoint = App;

if (Constants?.expoConfig?.extra?.storybookEnabled === "true") {
  AppEntryPoint = Storybook;
}

export default AppEntryPoint;
