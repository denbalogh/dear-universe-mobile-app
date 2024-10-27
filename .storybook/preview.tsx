import React, { useState } from "react";
import type { Preview } from "@storybook/react";
import { StyleSheet, View } from "react-native";
import { IconButton, PaperProvider } from "react-native-paper";
import { spacing, themeDark, themeLight } from "../constants/theme";

const preview: Preview = {
  decorators: [
    (Story) => {
      const [activeTheme, setActiveTheme] = useState(themeLight);

      const toggleActiveTheme = () => {
        setActiveTheme(activeTheme === themeLight ? themeDark : themeLight);
      };

      return (
        <PaperProvider theme={activeTheme}>
          <View
            style={[
              styles.wrapper,
              { backgroundColor: activeTheme.colors.background },
            ]}
          >
            <IconButton
              icon="theme-light-dark"
              onPress={toggleActiveTheme}
              style={styles.themeSwitcher}
            />
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
  themeSwitcher: {
    position: "absolute",
    bottom: spacing.spaceMedium,
    right: spacing.spaceMedium,
  },
});
