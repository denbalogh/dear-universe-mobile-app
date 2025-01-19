import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { Day } from "@/models/Day";
import { formatDateId } from "@/utils/date";
import { InnerDayProps } from "@fowusu/calendar-kit";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Realm } from "realm";
import FeelingsIndicator from "../FeelingsIndicator/FeelingsIndicator";

export const DAY_HEIGHT = 50;

export type CustomDayProps = InnerDayProps<unknown>;

const CustomDay = ({
  day,
  isToday,
  state,
  realm,
}: CustomDayProps & { realm: Realm }) => {
  const theme = useCustomTheme();
  const dayFormatted = day.getDate();

  const dayObject = realm.objectForPrimaryKey(Day, formatDateId(day));
  const { title = "", entryObjects = [] } = dayObject || {};

  const isDayEmpty = !title && (!dayObject || entryObjects.length === 0);

  const feelings = useMemo(
    () =>
      entryObjects
        .map((entry) => entry?.feelingsGroupName)
        .filter((feeling) => !!feeling),
    [entryObjects],
  );

  const backgroundColor = isDayEmpty
    ? theme.colors.background
    : theme.colors.surfaceVariant;

  const textColor = useMemo(() => {
    if (isToday) {
      return theme.colors.tertiary;
    }

    if (!isDayEmpty) {
      return theme.colors.onSurfaceVariant;
    }

    return state === "active"
      ? theme.colors.onBackground
      : theme.colors.surfaceDisabled;
  }, [isToday, state, theme.colors, isDayEmpty]);

  const fontWeight = isToday ? "bold" : "normal";

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <FeelingsIndicator
        feelings={feelings}
        style={[StyleSheet.absoluteFill, { height: DAY_HEIGHT }]}
        borderRadius="full"
      />
      <View style={[styles.innerWrapper, { backgroundColor }]}>
        <Text
          style={[styles.text, { color: textColor, fontWeight }]}
          variant="bodyLarge"
        >
          {dayFormatted}
        </Text>
      </View>
    </View>
  );
};

export default CustomDay;

const styles = StyleSheet.create({
  wrapper: {
    height: DAY_HEIGHT,
    marginRight: spacing.spaceExtraSmall,
    padding: spacing.spaceExtraSmall,
    borderRadius: roundness,
  },
  innerWrapper: {
    flex: 1,
    borderRadius: roundness,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});
