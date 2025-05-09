import React, { memo } from "react";
import { Image } from "expo-image";
import { Icon, TouchableRipple } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { roundness, sizing, spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import { getColorWithOpacity } from "@/common/utils/style";
import { Media } from "@/common/types/Media";

export type MediaGalleryItemProps = {
  item: Media;
  index: number;
  onPress: (index: number) => void;
};

const MediaGalleryItem = ({
  item: { uri, mediaType },
  index,
  onPress,
}: MediaGalleryItemProps) => {
  const theme = useCustomTheme();
  const isVideo = mediaType === "video";

  const handleOnPress = () => {
    onPress(index);
  };

  return (
    <TouchableRipple
      onPress={handleOnPress}
      background={{
        borderless: false,
        foreground: true,
      }}
    >
      <View>
        <Image style={styles.image} source={uri} />
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
  image: {
    width: "100%",
    height: 80,
    borderRadius: roundness,
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
