import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { formatMonthYear } from "@/common/utils/date";
import { useSettingsDrawer } from "@/common/contexts/SettingsDrawerContext/SettingsDrawerContext";
import useLockScreenHandler from "@/screens/MainScreen/hooks/useLockScreenHandler";
import useAdsConsentHandler from "@/screens/MainScreen/hooks/useAdsConsentHandler";
import NativeAdBannerSlim from "@/common/components/NativeAdBanner/NativeAdBannerSlim";
import { spacing } from "@/common/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTermsAndPoliciesHandler from "./hooks/useTermsAndPoliciesScreenHandler";
import CalendarList from "./CalendarList/CalendarList";

const MainScreen = () => {
  const theme = useTheme();
  const { showSettingsDrawer } = useSettingsDrawer();
  const { bottom } = useSafeAreaInsets();

  const [monthYear, setMonthYear] = useState(formatMonthYear(new Date()));

  // Handles ads consent
  useAdsConsentHandler();

  // Navigates to terms and policies screen if user hasn't confirmed
  useTermsAndPoliciesHandler();

  // Navigates to lock screen if the lock is set
  useLockScreenHandler();

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors.background, paddingBottom: bottom },
      ]}
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
                icon="cog-outline"
                onPress={showSettingsDrawer}
                color={theme.colors.onBackground}
              />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.background,
        }}
      />
      <NativeAdBannerSlim style={styles.adBanner} />
      <CalendarList onMonthYearChange={setMonthYear} />
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  adBanner: {
    margin: spacing.spaceSmall,
  },
});
