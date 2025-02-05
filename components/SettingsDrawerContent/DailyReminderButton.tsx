import { spacing } from "@/constants/theme";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import useSettingsObject from "@/hooks/useSettingsObject";
import { cancelAllScheduledNotificationsAsync } from "expo-notifications";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";

type Props = {
  closeSettingsDrawer: () => void;
};

const DailyReminderButton = ({ closeSettingsDrawer }: Props) => {
  const router = useRouter();
  const theme = useCustomTheme();
  const { showSnackbar } = useSnackbar();
  const { showConfirmDialog } = useConfirmDialog();
  const { settingsObject, updateSettingsObject } = useSettingsObject();

  const { dailyReminderTime } = settingsObject || {};

  const hasDailyReminder = !!dailyReminderTime;

  const handleOnPress = () => {
    router.navigate({ pathname: "/dailyReminder" });
    closeSettingsDrawer();
  };

  const handleDeleteReminder = async () => {
    await cancelAllScheduledNotificationsAsync();
    updateSettingsObject({ dailyReminderTime: "", dailyReminderMessage: "" });
    showSnackbar("Daily reminder deleted");
  };

  const onDeletePress = () => {
    showConfirmDialog(
      "Do you wish to delete the daily reminder?",
      handleDeleteReminder,
    );
  };

  if (hasDailyReminder) {
    return (
      <Card style={styles.wrapper} mode="contained" onPress={handleOnPress}>
        <Card.Title
          title="Daily reminder"
          subtitle={`Reminder set at ${dailyReminderTime}`}
          left={(props) => <Avatar.Icon {...props} icon="bell" />}
          subtitleNumberOfLines={2}
        />
        <Card.Actions style={styles.cardActions}>
          <Button mode="text" onPress={handleOnPress}>
            Edit
          </Button>
          <Button
            mode="text"
            textColor={theme.colors.error}
            onPress={onDeletePress}
          >
            Delete
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  return (
    <Card style={styles.wrapper} onPress={handleOnPress} mode="elevated">
      <Card.Title
        title="Daily reminder"
        subtitle="Set up daily reminder notification"
        left={(props) => <Avatar.Icon {...props} icon="bell-off" />}
        subtitleNumberOfLines={2}
      />
    </Card>
  );
};

export default DailyReminderButton;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.spaceMedium,
  },
  cardActions: {
    paddingTop: 0,
  },
});
