import { spacing } from "@/common/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { ITEM_HEIGHT } from "../constants";

const MonthItem = ({ monthName }: { monthName: string }) => (
  <View style={styles.monthWrapper}>
    <Divider />
    <Text style={styles.monthName} variant="titleMedium">
      {monthName}
    </Text>
  </View>
);

export default MonthItem;

const styles = StyleSheet.create({
  monthWrapper: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
  },
  monthName: {
    marginLeft: spacing.spaceSmall,
    marginTop: spacing.spaceExtraSmall,
  },
});
