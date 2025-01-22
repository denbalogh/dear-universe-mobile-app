import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import ThemeButton from "./ThemeButton";
import { spacing } from "@/constants/theme";

type Props = {
  closeDrawer: () => void;
};

const SettingsDrawerContent = ({ closeDrawer }: Props) => {
  const theme = useCustomTheme();

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={closeDrawer} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text variant="labelMedium" style={styles.label}>
          Color scheme:
        </Text>
        <ThemeButton />
      </ScrollView>
    </View>
  );
};

export default SettingsDrawerContent;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollViewContent: {
    padding: spacing.spaceMedium,
  },
  label: {
    marginBottom: spacing.spaceSmall,
  },
});
