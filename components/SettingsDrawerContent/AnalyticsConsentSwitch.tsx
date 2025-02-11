import { spacing } from "@/constants/theme";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import useSettingsObject from "@/hooks/useSettingsObject";
import { StyleSheet, View } from "react-native";
import { Switch, Text, TouchableRipple } from "react-native-paper";

const AnalyticsConsentSwitch = () => {
  const { showConfirmDialog } = useConfirmDialog();
  const { settingsObject, updateSettingsObject } = useSettingsObject();

  const { analyticsConsent = true } = settingsObject || {};

  const toggle = () => {
    updateSettingsObject({ analyticsConsent: !analyticsConsent });
  };

  const handleOnToggle = () => {
    if (analyticsConsent) {
      showConfirmDialog(
        "Analytics data help us improve the app by fixing issues and enhancing performance. You really wish to disable it?",
        toggle,
      );
    } else {
      toggle();
    }
  };

  return (
    <TouchableRipple onPress={handleOnToggle}>
      <View style={styles.wrapper}>
        <Switch value={analyticsConsent} onValueChange={handleOnToggle} />
        <Text variant="bodySmall" style={styles.text}>
          Enable anonymous analytics data collection for better performance and
          stability. No personal info collected.
        </Text>
      </View>
    </TouchableRipple>
  );
};

export default AnalyticsConsentSwitch;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.spaceSmall,
  },
  text: {
    flexShrink: 1,
    marginLeft: spacing.spaceSmall,
  },
});
