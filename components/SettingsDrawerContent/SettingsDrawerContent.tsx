import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";
import ThemeButton from "./ThemeButton";
import { spacing } from "@/constants/theme";
import LockButton from "./LockButton";
import DailyReminderButton from "./DailyReminderButton";
import AppLogo from "./AppLogo";
import { useRouter } from "expo-router";

type Props = {
  closeDrawer: () => void;
};

const SettingsDrawerContent = ({ closeDrawer }: Props) => {
  const theme = useCustomTheme();
  const router = useRouter();

  const onTermsButtonPress = () => {
    router.navigate({ pathname: "/terms" });
    closeDrawer();
  };

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={closeDrawer} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          <ThemeButton />
          <LockButton closeSettingsDrawer={closeDrawer} />
          <DailyReminderButton closeSettingsDrawer={closeDrawer} />
          <Button mode="text" onPress={onTermsButtonPress}>
            Terms & policies
          </Button>
        </View>
        <AppLogo />
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
    justifyContent: "space-between",
    flexGrow: 1,
  },
  label: {
    marginBottom: spacing.spaceSmall,
  },
});
