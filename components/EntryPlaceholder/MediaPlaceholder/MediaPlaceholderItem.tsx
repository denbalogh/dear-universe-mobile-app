import React, { useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { roundness, sizing, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { getBorderRadius } from "../../MediaGallery/utils";
import { Icon } from "react-native-paper";

export type MediaPlaceholderItemProps = {
  index: number;
  imagesCount: number;
  gridSize: number;
  icon?: "image" | "video";
  style: ViewProps["style"];
};

const MediaPlaceholderItem = ({
  index,
  imagesCount,
  gridSize,
  icon = "image",
  style,
}: MediaPlaceholderItemProps) => {
  const theme = useCustomTheme();
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, gridSize),
    [index, imagesCount, gridSize],
  );

  return (
    <View
      style={[
        style,
        {
          ...borderRadii,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={[StyleSheet.absoluteFill, styles.playIconWrapper]}>
        <View style={[styles.playIcon]}>
          <Icon
            source={icon}
            size={sizing.sizeMedium}
            color={theme.colors.surfaceVariant}
          />
        </View>
      </View>
    </View>
  );
};

export default MediaPlaceholderItem;

const styles = StyleSheet.create({
  playIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    borderRadius: roundness,
    margin: spacing.spaceSmall,
  },
});
