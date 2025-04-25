import React, { memo, useMemo } from "react";
import { Image, ImageProps } from "expo-image";
import { Icon, TouchableRipple } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { getBorderRadius } from "./utils";
import { roundness, sizing, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { getColorWithOpacity } from "@/utils/style";
import { Media } from "@/types/Media";

export type MediaGalleryItemProps = {
  item: Media;
  index: number;
  imagesCount: number;
  gridSize: number;
  onPress: (index: number) => void;
  style: ImageProps["style"];
};

const MediaGalleryItem = ({
  item: { uri, mediaType },
  index,
  imagesCount,
  gridSize,
  style,
  onPress,
}: MediaGalleryItemProps) => {
  const theme = useCustomTheme();
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, gridSize),
    [index, imagesCount, gridSize],
  );

  const isVideo = mediaType === "video";

  const handleOnPress = () => {
    onPress(index);
  };

  return (
    <TouchableRipple
      onPress={handleOnPress}
      style={[styles.touchable, { ...borderRadii }]}
      background={{
        borderless: false,
        foreground: true,
      }}
    >
      <View>
        <Image style={[style, { ...borderRadii }]} source={uri} />
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

export default memo(MediaGalleryItem);

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
