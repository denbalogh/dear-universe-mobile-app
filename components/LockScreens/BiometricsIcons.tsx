import { sizing, spacing } from "@/constants/theme";
import React, { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-paper";

type Props = { size?: number } & Omit<
  ComponentProps<typeof Icon>,
  "source" | "size"
>;

const BiometricsIcons = ({ size = sizing.sizeMedium, ...iconProps }: Props) => (
  <View style={styles.iconsWrapper}>
    <View style={styles.icon}>
      <Icon source="fingerprint" size={size} {...iconProps} />
    </View>
    <View style={styles.icon}>
      <Icon source="face-recognition" size={size} {...iconProps} />
    </View>
  </View>
);

export default BiometricsIcons;

const styles = StyleSheet.create({
  iconsWrapper: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: spacing.spaceSmall,
  },
});
