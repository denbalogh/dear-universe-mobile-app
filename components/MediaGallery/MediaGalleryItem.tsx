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
import { Media } from "./EditableMediaGallery";
import { getColorWithOpacity } from "@/utils/style";

export type MediaGalleryItemProps = {
  item: Media;
  index: number;
  imagesCount: number;
  gridSize: number;
  touchableProps: Omit<TouchableRippleProps, "children">;
  style: ImageProps["style"];
};

const MediaGalleryItem = ({
  item: { imageUri, videoUri },
  index,
  imagesCount,
  gridSize,
  style,
  touchableProps,
}: MediaGalleryItemProps) => {
  const theme = useCustomTheme();
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, gridSize),
    [index, imagesCount, gridSize],
  );

  const isVideo = !!videoUri;

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
        <Image style={[style, { ...borderRadii }]} source={imageUri} />
        {isVideo && (
          <View style={[StyleSheet.absoluteFill, styles.playIconWrapper]}>
            <View
              style={[
                styles.playIcon,
                {
                  backgroundColor: getColorWithOpacity(
                    theme.colors.background,
                    0.6,
                  ),
                },
              ]}
            >
              <Icon
                source="play"
                size={sizing.sizeMedium}
                color={theme.colors.onBackground}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableRipple>
  );
};

export default MediaGalleryItem;

const styles = StyleSheet.create({
  touchable: {
    overflow: "hidden",
  },
  playIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    borderRadius: roundness,
    margin: spacing.spaceSmall,
  },
});
