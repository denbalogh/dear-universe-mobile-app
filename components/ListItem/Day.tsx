import { format, fromUnixTime, getDate } from "date-fns";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {
  timestamp: number;
};

const Day = ({ timestamp }: Props) => {
  const theme = useTheme();

  const date = fromUnixTime(timestamp);
  const isToday =
    format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <View style={styles.wrapper}>
      <Text
        variant="displaySmall"
        style={[isToday && { color: theme.colors.tertiary }]}
        aria-label={
          isToday
            ? `Today ${format(date, "do LLLL yyyy")}`
            : format(date, "do LLLL yyyy")
        }
      >
        {getDate(date)}
      </Text>
      <Text variant="bodyLarge" aria-label={format(date, "EEEE")}>
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
    width: 35,
  },
});
