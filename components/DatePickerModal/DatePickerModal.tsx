import {
  CalendarList,
  dateStringToDate,
  toLocaleDateString,
} from "@fowusu/calendar-kit";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Appbar, Modal, Portal } from "react-native-paper";
import CustomMonthName, {
  MONTH_NAME_HEIGHT,
  MonthNameProps,
} from "./CustomMonthName";
import { spacing } from "@/constants/theme";
import CustomDay, { CustomDayProps } from "./CustomDay";
import CustomWeekDayName, {
  CustomWeekDayNameProps,
  WEEK_DAY_NAME_HEIGHT,
} from "./CustomWeekDayName";
import { Realm } from "@realm/react";
import useActiveColorScheme from "@/hooks/useActiveColorScheme";

const APPBAR_HEIGHT = 70;
const WEEKS_HEIGHT = 290;

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
  onConfirm: (date: Date) => void;
  realm: Realm; // Need to pass realm instance because modal is outside RealmProvider
};

const DatePickerModal = ({ isVisible, onDismiss, onConfirm, realm }: Props) => {
  const { height } = useWindowDimensions();
  const { theme, statusBarStyle } = useActiveColorScheme();

  const calendarSize = useMemo(
    () => ({
      height: height - APPBAR_HEIGHT,
    }),
    [height],
  );

  const todayDateString = toLocaleDateString(new Date());

  const estimatedCalendarSize = useMemo(
    () => ({
      fiveWeekCalendarSize:
        WEEKS_HEIGHT + MONTH_NAME_HEIGHT + WEEK_DAY_NAME_HEIGHT,
      monthTitleSize: MONTH_NAME_HEIGHT,
      weekDayNameSize: WEEK_DAY_NAME_HEIGHT,
    }),
    [],
  );

  const onDayPress = useCallback(
    (dateString: string) => {
      onConfirm(dateStringToDate(dateString));
      onDismiss();
    },
    [onConfirm, onDismiss],
  );

  const renderMonthComponent = useCallback(
    (props: MonthNameProps) => <CustomMonthName {...props} />,
    [],
  );

  const renderWeekDayNameComponent = useCallback(
    (props: CustomWeekDayNameProps) => <CustomWeekDayName {...props} />,
    [],
  );

  const renderDayComponent = useCallback(
    (props: CustomDayProps) => <CustomDay {...props} realm={realm} />,
    [realm],
  );

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContentContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <StatusBar
          backgroundColor={theme.colors.background}
          style={statusBarStyle}
        />
        <Appbar.Header
          statusBarHeight={0}
          style={[
            styles.appBar,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
          elevated={true}
          mode="center-aligned"
        >
          <Appbar.BackAction onPress={onDismiss} />
          <Appbar.Content title="Search date" />
        </Appbar.Header>
        <CalendarList
          calendarSize={calendarSize}
          currentDate={todayDateString}
          estimatedCalendarSize={estimatedCalendarSize}
          futureMonthsCount={0}
          pastMonthsCount={24} // #TODO - Extend if last described day is out of the range
          onDayPress={onDayPress}
          showExtraDays={false}
          maxDate={todayDateString}
          MonthNameComponent={renderMonthComponent}
          WeekDayNameComponent={renderWeekDayNameComponent}
          DayComponent={renderDayComponent}
          weeksContainerStyle={styles.weeksContainer}
        />
      </Modal>
    </Portal>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  modalContentContainer: {
    flex: 1,
  },
  appBar: {
    height: APPBAR_HEIGHT,
  },
  weeksContainer: {
    height: WEEKS_HEIGHT,
    justifyContent: "space-between",
    paddingLeft: spacing.spaceExtraSmall,
  },
});
