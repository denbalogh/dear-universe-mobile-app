import React from "react";
import type { Preview } from "@storybook/react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { spacing, themeDark, themeLight } from "../constants/theme";

const preview: Preview = {
  decorators: [
    (Story) => {
      const colorScheme = useColorScheme();
      const activeTheme = colorScheme === "dark" ? themeDark : themeLight;

      return (
        <PaperProvider theme={activeTheme}>
          <View style={styles.wrapper}>
            <Story />
          </View>
        </PaperProvider>
      );
    },
  ],
};

export default preview;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: spacing.spaceMedium,
  },
});
