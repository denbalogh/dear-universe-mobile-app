import { spacing } from "@/common/constants/theme";
import { useConfirmDialog } from "@/common/providers/ConfirmDialogProvider";
import { useSnackbar } from "@/common/providers/SnackbarProvider";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import { cancelAllScheduledNotificationsAsync } from "expo-notifications";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";
import { useSettings } from "../../SettingsProvider";
import database from "@/common/models/db";
import { formatDateToHoursMinutes } from "@/common/utils/time";

const DailyReminderButton = () => {
  const router = useRouter();
  const theme = useCustomTheme();
  const { showSnackbar } = useSnackbar();
  const { showDialog } = useConfirmDialog();
  const settings = useSettings();

  const { dailyReminderAt } = settings;

  const handleOnPress = () => {
    router.navigate({ pathname: "/dailyReminder" });
  };

  const handleDeleteReminder = async () => {
    await cancelAllScheduledNotificationsAsync();

    await database.write(async () => {
      await settings.update((s) => {
        s.dailyReminderAt = undefined;
        s.dailyReminderMessage = "";
      });
    });

    showSnackbar("Daily reminder deleted");
  };

  const onDeletePress = () => {
    showDialog(
      "Do you wish to delete the daily reminder?",
      handleDeleteReminder,
    );
  };

  if (dailyReminderAt) {
    return (
      <Card style={styles.wrapper} mode="contained" onPress={handleOnPress}>
        <Card.Title
          title="Daily reminder"
          subtitle={`Reminder set at ${formatDateToHoursMinutes(dailyReminderAt)}`}
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
