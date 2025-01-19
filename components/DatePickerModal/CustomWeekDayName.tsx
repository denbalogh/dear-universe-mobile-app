import React from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export const WEEK_DAY_NAME_HEIGHT = 50;

export type CustomWeekDayNameProps = {
  weekDays: string[];
};

const CustomWeekDayName = ({ weekDays }: CustomWeekDayNameProps) => (
  <View style={styles.wrapper}>
    {weekDays.map((dayName, index) => (
      <Text style={styles.dayName} key={index} variant="bodySmall">
        {dayName}
      </Text>
    ))}
  </View>
);

export default CustomWeekDayName;

const styles = StyleSheet.create({
  wrapper: {
    height: WEEK_DAY_NAME_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  dayName: {
    width: `${100 / 7}%`,
    textAlign: "center",
  },
});
