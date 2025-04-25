import { Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { formatMonthYear } from "@/utils/date";
import { useSettingsDrawer } from "@/contexts/SettingsDrawerContext";
import useLockScreenHandler from "@/hooks/useLockScreenHandler";
import useFirebaseAuthAndAnalyticsConsentHandler from "@/hooks/useFirebaseAuthAndAnalyticsConsentHandler";
import useAdsConsentHandler from "@/hooks/useAdsConsentHandler";
import NativeAdBannerSlim from "@/components/NativeAdBanner/NativeAdBannerSlim";
import { spacing } from "@/constants/theme";
import useTermsAndPoliciesHandler from "@/hooks/useTermsAndPoliciesScreenHandler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InfiniteDaysList from "@/components/MainScreenComponents/InfiniteDaysList/InfiniteDaysList";

const App = () => {
  const theme = useTheme();
  const { showSettingsDrawer } = useSettingsDrawer();
  const { bottom } = useSafeAreaInsets();

  const [monthYear, setMonthYear] = useState(formatMonthYear(new Date()));

  // Handles Firebase authentication and analytics consent
  useFirebaseAuthAndAnalyticsConsentHandler();

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
