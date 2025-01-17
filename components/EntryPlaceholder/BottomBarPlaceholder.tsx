import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { roundness, sizing, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import { View } from "react-native";
import { Icon } from "react-native-paper";
import Animated, { AnimatedProps } from "react-native-reanimated";

const BottomBarPlaceholder = ({
  feelingsGroupName,
  style,
}: {
  feelingsGroupName: FEELING_GROUP_NAMES;
  style: AnimatedProps<ViewProps>["style"];
}) => {
  const theme = useCustomTheme();

  const menuButtonPlaceholder = (icon: string) => (
    <View style={[styles.menuButtonPlaceholder]}>
      <Icon
        source={icon}
        size={sizing.sizeMedium}
        color={theme.colors.surface}
      />
    </View>
  );

  return (
    <View style={[styles.wrapper]}>
      <Animated.View
        style={[
          styles.feelingsPlaceholder,
          {
            backgroundColor: theme.colors[`${feelingsGroupName}Container`],
          },
          style,
        ]}
      >
        <View
          style={[
            styles.feelingsPlaceholderContent,
            {
              backgroundColor: `${theme.colors[`${feelingsGroupName}`]}10`,
            },
          ]}
        />
      </Animated.View>
      <View style={styles.actionBarMenusWrapper}>
        {menuButtonPlaceholder("delete")}
        {menuButtonPlaceholder("plus-minus")}
      </View>
    </View>
  );
};

export default BottomBarPlaceholder;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.spaceExtraSmall,
  },
  actionBarMenusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.spaceSmall,
  },
  feelingsPlaceholder: {
    flex: 1,
    padding: spacing.spaceSmall,
    borderRadius: roundness,
    marginRight: spacing.spaceLarge,
  },
  feelingsPlaceholderContent: {
    height: spacing.spaceSmall,
    borderRadius: spacing.spaceExtraSmall,
    width: "100%",
  },
  menuButtonPlaceholder: {
    padding: spacing.spaceSmall,
  },
});
