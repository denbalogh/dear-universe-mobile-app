import { parseDateId } from "@/utils/date";
import { format, getDate, isToday as isTodayDateFns } from "date-fns";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {
  dateId: string;
};

const Day = ({ dateId }: Props) => {
  const theme = useTheme();

  const date = parseDateId(dateId);
  const isToday = isTodayDateFns(date);

  return (
    <View style={styles.wrapper}>
      <Text
        variant="displaySmall"
        style={isToday && [styles.today, { color: theme.colors.tertiary }]}
        accessibilityLabel={
          isToday
            ? `Today ${format(date, "do LLLL yyyy")}`
            : format(date, "do LLLL yyyy")
        }
      >
        {getDate(date)}
      </Text>
      <Text variant="bodyLarge" accessibilityLabel={format(date, "EEEE")}>
        {format(date, "E")}
      </Text>
    </View>
  );
};

export default Day;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  today: {
    fontWeight: "bold",
  },
});
