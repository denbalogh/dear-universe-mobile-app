import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import ThemeButton from "./ThemeButton";
import { spacing } from "@/constants/theme";
import LockButton from "./LockButton";

type Props = {
  closeDrawer: () => void;
};

const SettingsDrawerContent = ({ closeDrawer }: Props) => {
  const theme = useCustomTheme();

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={closeDrawer} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ThemeButton />
        <LockButton closeSettingsDrawer={closeDrawer} />
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
