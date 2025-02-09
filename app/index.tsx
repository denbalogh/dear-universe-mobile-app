import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import InfiniteDaysList from "@/components/InfiniteDaysList/InfiniteDaysList";
import { formatMonthYear } from "@/utils/date";
import { useSettingsDrawer } from "@/contexts/SettingsDrawerContext";
import useLockScreenHandler from "@/hooks/useLockScreenHandler";
import useNotificationHandler from "@/hooks/useNotificationHandler";
import useFirebaseAuthAndAnalyticsConsentHandler from "@/hooks/useFirebaseAuthAndAnalyticsConsentHandler";
import useAdsConsentHandler from "@/hooks/useAdsConsentHandler";
import NativeAdBannerSlim from "@/components/NativeAdBanner/NativeAdBannerSlim";
import { spacing } from "@/constants/theme";

const App = () => {
  const theme = useTheme();
  const { showSettingsDrawer } = useSettingsDrawer();

  const [monthYear, setMonthYear] = useState(formatMonthYear(new Date()));

  // Navigates to lock screen if the lock is set
  useLockScreenHandler();

  // Handles notification actions
  useNotificationHandler();

  // Handles Firebase authentication and analytics consent
  useFirebaseAuthAndAnalyticsConsentHandler();

  // Handles ads consent
  useAdsConsentHandler();

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header
              style={{ backgroundColor: theme.colors.background }}
              elevated={true}
            >
              <Appbar.Content
                title={monthYear}
                titleStyle={{ color: theme.colors.onBackground }}
              />
              <Appbar.Action
                icon="cog"
                onPress={showSettingsDrawer}
                color={theme.colors.onBackground}
              />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.background,
        }}
      />
      <NativeAdBannerSlim style={styles.adBanner} />
      <InfiniteDaysList onMonthYearChange={setMonthYear} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  adBanner: {
    margin: spacing.spaceSmall,
  },
});
