import React, { useState } from "react";
import type { Preview } from "@storybook/react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, PaperProvider } from "react-native-paper";
import { spacing, themeDark, themeLight } from "../constants/theme";
import { enGB, registerTranslation } from "react-native-paper-dates";

registerTranslation("en", enGB);

export const ScrollViewDecorator = (Story) => (
  <ScrollView contentContainerStyle={styles.scrollview}>
    <Story />
  </ScrollView>
);

export const ViewDecorator = (Story) => (
  <View style={styles.view}>
    <Story />
  </View>
);

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
            <Story />
            <IconButton
              icon="theme-light-dark"
              onPress={toggleActiveTheme}
              style={styles.themeSwitcher}
            />
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
  },
  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: spacing.spaceMedium,
  },
  scrollview: {
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
