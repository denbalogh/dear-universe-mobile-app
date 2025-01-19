import { formatMonthYear } from "@/utils/date";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export const MONTH_NAME_HEIGHT = 30;

export type MonthNameProps = {
  month: Date;
  locale?: string;
};

const CustomMonthName = ({ month }: MonthNameProps) => {
  const formattedMonth = formatMonthYear(month);
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text} variant="titleMedium">
        {formattedMonth}
      </Text>
    </View>
  );
};

export default CustomMonthName;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: MONTH_NAME_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});
