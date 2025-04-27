import { spacing } from "@/common/constants/theme";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import isEqual from "lodash/isEqual";
import useBackHandler from "@/common/hooks/useBackHandler";
import { useConfirmDialog } from "@/common/contexts/ConfirmDialogContext";
import {
  AndroidNotificationPriority,
  cancelAllScheduledNotificationsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync,
} from "expo-notifications";
import { useSnackbar } from "@/common/contexts/SnackbarContext";
import {
  formatDateToHoursMinutes,
  isEqualHoursMinutes,
  parseHoursMinutesToDate,
} from "@/common/utils/time";
import DatePicker from "react-native-date-picker";
import { getRandomPhrase } from "@/common/utils/getRandomPhrase";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import FlingGesture from "@/common/components/FlingGesture";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useActiveColorScheme from "@/common/hooks/useActiveColorScheme";
import { phrases } from "./constants";
import useNotificationsPermissions from "@/common/hooks/useNotificationsPermission";

const DailyReminderScreen = () => {
  const router = useRouter();
  const theme = useCustomTheme();
  const { colorScheme } = useActiveColorScheme();
  const { showConfirmDialog } = useConfirmDialog();
  const { requestPermissions } = useNotificationsPermissions();
  const { showSnackbar } = useSnackbar();
  const { bottom } = useSafeAreaInsets();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const closeDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  // const { settingsObject, updateSettingsObject } = useSettingsObject();
  // const { dailyReminderTime = "", dailyReminderMessage = "" } =
  //   settingsObject || {};

  // const isInitialTimeEmpty = useRef(dailyReminderTime === "");
  // const initialTime = useRef(parseHoursMinutesToDate(dailyReminderTime));
  // const [time, setTime] = useState(initialTime.current);

  const handleSetTime = (newTime: Date) => {
    // setTime(newTime);
    closeDatePicker();
  };

  // const isInitialMessageEmpty = useRef(dailyReminderMessage === "");
  // const initialMessage = useRef(
  //   dailyReminderMessage || getRandomPhrase(phrases),
  // );
  // const [message, setMessage] = useState(initialMessage.current);

  // const isEdited =
  //   !isEqualHoursMinutes(time, initialTime.current) ||
  //   !isEqual(message, initialMessage.current);

  // const isConfirmEnabled =
  //   isInitialTimeEmpty.current || isInitialMessageEmpty.current || isEdited;

  const handleShowDiscardDialog = useCallback(() => {
    showConfirmDialog("Do you wish to discard the changes?", router.back);
  }, [showConfirmDialog, router]);

  const onBackPress = () => {
    // if (isEdited) {
    //   handleShowDiscardDialog();
    // } else {
    //   router.back();
    // }
  };

  // const onAndroidBackButtonPress = useCallback(() => {
  //   if (isEdited) {
  //     handleShowDiscardDialog();
  //     return true;
  //   }
  //   return false;
  // }, [isEdited, handleShowDiscardDialog]);

  // useBackHandler(onAndroidBackButtonPress);

  // const scheduleNotification = useCallback(async () => {
  //   await cancelAllScheduledNotificationsAsync();

  //   const [hours, minutes] = [time.getHours(), time.getMinutes()];

  //   await scheduleNotificationAsync({
  //     content: {
  //       title: "Daily reminder",
  //       body: message,
  //       color: theme.colors.primary,
  //       interruptionLevel: "active",
  //       priority: AndroidNotificationPriority.LOW,
  //     },
  //     trigger: {
  //       type: SchedulableTriggerInputTypes.DAILY,
  //       hour: hours,
  //       minute: minutes,
  //     },
  //   });

  //   updateSettingsObject({
  //     dailyReminderTime: formatDateToHoursMinutes(time),
  //     dailyReminderMessage: message,
  //   });

  //   showSnackbar(`Daily reminder set for ${formatDateToHoursMinutes(time)}`);
  //   router.back();
  // }, [
  //   message,
  //   theme.colors.primary,
  //   updateSettingsObject,
  //   showSnackbar,
  //   router,
  //   time,
  // ]);

  // const onConfirmPress = useCallback(() => {
  //   requestPermissions(scheduleNotification);
  // }, [requestPermissions, scheduleNotification]);

  // const onRefreshMessagePress = () => {
  //   setMessage(getRandomPhrase(phrases));
  // };

  return (
    <FlingGesture onFlingDown={onBackPress}>
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
          {/* <Card style={styles.timeCard} onPress={openDatePicker}>
            <Card.Title
              title="Reminder time"
              subtitle={formatDateToHoursMinutes(time)}
              left={(props) => <Avatar.Icon {...props} icon="clock" />}
            />
          </Card> */}
          {/* <TextInput
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
          /> */}
        </ScrollView>
        {/* <Button
          mode="contained"
          style={styles.confirmButton}
          onPress={onConfirmPress}
          disabled={!isConfirmEnabled}
        >
          Confirm
        </Button>
        <DatePicker
          modal={true}
          mode="time"
          minuteInterval={5}
          locale="en"
          title="Select reminder time"
          theme={colorScheme}
          open={isDatePickerOpen}
          date={time}
          onConfirm={handleSetTime}
          onCancel={closeDatePicker}
        /> */}
      </View>
    </FlingGesture>
  );
};

export default DailyReminderScreen;

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
