import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { Day } from "@/models/Day";
import { formatDateId } from "@/utils/date";
import { InnerDayProps } from "@fowusu/calendar-kit";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Realm } from "realm";

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

  const isDayEmpty = useMemo(
    () => !title && (!dayObject || entryObjects.length === 0),
    [dayObject, title, entryObjects],
  );

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

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.innerWrapper,
          {
            backgroundColor: isDayEmpty
              ? theme.colors.background
              : theme.colors.surfaceVariant,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: textColor,
            },
          ]}
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
    paddingRight: spacing.spaceExtraSmall,
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
