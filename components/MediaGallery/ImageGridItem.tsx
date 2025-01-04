import React, { useMemo } from "react";
import { Image, ImageProps } from "expo-image";
import {
  Icon,
  TouchableRipple,
  TouchableRippleProps,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { getBorderRadius } from "./utils";
import { roundness, sizing, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";

type Props = {
  index: number;
  imagesCount: number;
  gridSize: number;
  touchableProps: Omit<TouchableRippleProps, "children">;
  showPlayIcon?: boolean;
} & ImageProps;

const ImageGridItem = ({
  index,
  imagesCount,
  gridSize,
  style,
  touchableProps,
  showPlayIcon = false,
  ...props
}: Props) => {
  const theme = useCustomTheme();
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, gridSize),
    [index, imagesCount, gridSize],
  );

  return (
    <TouchableRipple
      {...touchableProps}
      style={[styles.touchable, { ...borderRadii }]}
      background={{
        borderless: false,
        foreground: true,
      }}
    >
      <View>
        <Image style={[style, { ...borderRadii }]} {...props} />
        {showPlayIcon && (
          <View style={[StyleSheet.absoluteFill, styles.playIconWrapper]}>
            <View
              style={[
                styles.playIcon,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Icon
                source="play"
                size={sizing.sizeMedium}
                color={theme.colors.onSurface}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableRipple>
  );
};

export default ImageGridItem;

const styles = StyleSheet.create({
  touchable: {
    overflow: "hidden",
  },
  playIconWrapper: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: spacing.spaceSmall,
  },
  playIcon: {
    borderRadius: roundness,
  },
});
