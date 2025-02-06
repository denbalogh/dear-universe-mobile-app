import { spacing } from "@/constants/theme";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import useSettingsObject from "@/hooks/useSettingsObject";
import { isEqual } from "lodash";
import useBackHandler from "@/hooks/useBackHandler";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import useNotificationsPermissions from "@/hooks/useNotificationsPermission";
import {
  AndroidNotificationPriority,
  cancelAllScheduledNotificationsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync,
} from "expo-notifications";
import { useSnackbar } from "@/contexts/SnackbarContext";
import {
  formatDateToHoursMinutes,
  parseHoursMinutesToDate,
} from "@/utils/time";
import DatePicker from "react-native-date-picker";
import useActiveColorScheme from "@/hooks/useActiveColorScheme";
import { getRandomPhrase } from "@/utils/getRandomPhrase";
import { phrases } from "@/constants/dailyReminder";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import FlingGesture from "@/components/FlingGesture/FlingGesture";
import { getCrashlytics } from "@react-native-firebase/crashlytics";

export const DAILY_REMINDER_IDENTIFIER = "daily-reminder";

const DailyReminderSetupScreen = () => {
  const router = useRouter();
  const theme = useCustomTheme();
  const { colorScheme } = useActiveColorScheme();
  const { showConfirmDialog } = useConfirmDialog();
  const { requestPermissions } = useNotificationsPermissions();
  const { showSnackbar } = useSnackbar();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const closeDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  const { settingsObject, updateSettingsObject } = useSettingsObject();
  const { dailyReminderTime = "", dailyReminderMessage = "" } =
    settingsObject || {};

  const initialTime = parseHoursMinutesToDate(dailyReminderTime);
  const [time, setTime] = useState(initialTime);

  const initialMessage = dailyReminderMessage || getRandomPhrase(phrases);
  const [message, setMessage] = useState(initialMessage);

  const isEdited =
    !isEqual(initialTime, time) || !isEqual(message, initialMessage);

  const handleShowDiscardDialog = useCallback(() => {
    showConfirmDialog("Do you wish to discard the changes?", router.back);
  }, [showConfirmDialog, router]);

  const onBackPress = () => {
    if (isEdited) {
      handleShowDiscardDialog();
    } else {
      router.back();
    }
  };

  const onAndroidBackButtonPress = useCallback(() => {
    if (isEdited) {
      handleShowDiscardDialog();
      return true;
    }
    return false;
  }, [isEdited, handleShowDiscardDialog]);

  useBackHandler(onAndroidBackButtonPress);

  const scheduleNotification = useCallback(async () => {
    getCrashlytics().log("Daily reminder - cancel all scheduled notifications");
    await cancelAllScheduledNotificationsAsync();

    const [hours, minutes] = [time.getHours(), time.getMinutes()];

    getCrashlytics().log("Daily reminder - schedule notification");
    await scheduleNotificationAsync({
      content: {
        title: "Daily reminder",
        body: message,
        color: theme.colors.primary,
        interruptionLevel: "active",
        priority: AndroidNotificationPriority.LOW,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
      identifier: DAILY_REMINDER_IDENTIFIER,
    });

    updateSettingsObject({
      dailyReminderTime: formatDateToHoursMinutes(time),
      dailyReminderMessage: message,
    });

    showSnackbar(`Daily reminder set for ${formatDateToHoursMinutes(time)}`);
    router.back();
  }, [
    message,
    theme.colors.primary,
    updateSettingsObject,
    showSnackbar,
    router,
    time,
  ]);

  const onConfirmPress = useCallback(() => {
    requestPermissions(scheduleNotification);
  }, [requestPermissions, scheduleNotification]);

  const onRefreshMessagePress = () => {
    setMessage(getRandomPhrase(phrases));
  };

  return (
    <FlingGesture onFlingDown={onBackPress}>
      <View
        style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
      >
        <Stack.Screen
          options={{
            header: () => (
              <Appbar.Header
                style={{ backgroundColor: theme.colors.background }}
              >
                <Appbar.BackAction onPress={onBackPress} />
              </Appbar.Header>
            ),
            navigationBarColor: theme.colors.background,
            animation: "fade",
          }}
        />
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Text variant="displaySmall" style={styles.headline}>
            Daily reminder
          </Text>
          <Card style={styles.timeCard} onPress={openDatePicker}>
            <Card.Title
              title="Reminder time"
              subtitle={formatDateToHoursMinutes(time)}
              left={(props) => <Avatar.Icon {...props} icon="clock" />}
            />
          </Card>
          <TextInput
            label="Reminder message"
            value={message}
            onChangeText={setMessage}
            mode="outlined"
            multiline={true}
            submitBehavior="blurAndSubmit"
            right={
              <TextInput.Icon
                icon="refresh"
                onPress={onRefreshMessagePress}
                forceTextInputFocus={false}
              />
            }
          />
        </ScrollView>
        <Button
          mode="contained"
          style={styles.confirmButton}
          onPress={onConfirmPress}
        >
          Confirm
        </Button>
        <DatePicker
          modal
          mode="time"
          minuteInterval={5}
          locale="en"
          title="Select reminder time"
          theme={colorScheme}
          open={isDatePickerOpen}
          date={time}
          onConfirm={setTime}
          onCancel={closeDatePicker}
        />
      </View>
    </FlingGesture>
  );
};

export default DailyReminderSetupScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollViewContainer: {
    padding: spacing.spaceMedium,
    paddingVertical: spacing.spaceSmall,
  },
  headline: {
    marginBottom: spacing.spaceLarge,
  },
  timeCard: {
    marginBottom: spacing.spaceMedium,
  },
  confirmButton: {
    margin: spacing.spaceMedium,
  },
});
