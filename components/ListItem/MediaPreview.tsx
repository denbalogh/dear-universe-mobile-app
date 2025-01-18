import React, { useEffect, useState } from "react";
import { Media } from "../MediaGallery/EditableMediaGallery";
import { StyleSheet, View } from "react-native";
import { ITEM_HEIGHT } from "../InfiniteDaysList/constants";
import { Image } from "expo-image";
import { roundness, sizing, spacing } from "@/constants/theme";
import { Icon } from "react-native-paper";
import { useCustomTheme } from "@/hooks/useCustomTheme";

type Props = {
  media: Media[];
};

const MediaPreview = ({ media }: Props) => {
  const theme = useCustomTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const isLastIndex = activeIndex === media.length - 1;
      setActiveIndex(isLastIndex ? 0 : activeIndex + 1);
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [activeIndex, media]);

  if (media.length === 0) {
    return null;
  }

  const uri = media[activeIndex].imageUri;
  const hasVideo = !!media[activeIndex].videoUri;

  return (
    <View style={styles.wrapper}>
      <Image style={styles.image} source={{ uri }} />
      {hasVideo && (
        <View
          style={[
            styles.videoIconWrapper,
            { backgroundColor: `${theme.colors.surfaceVariant}96` },
          ]}
        >
          <Icon
            source="play"
            size={sizing.sizeSmall}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      )}
    </View>
  );
};

export default MediaPreview;

const styles = StyleSheet.create({
  wrapper: {
    height: ITEM_HEIGHT,
    width: ITEM_HEIGHT,
  },
  image: {
    height: "100%",
    width: "100%",
    borderTopEndRadius: roundness,
    borderBottomEndRadius: roundness,
  },
  videoIconWrapper: {
    position: "absolute",
    left: spacing.spaceSmall,
    bottom: spacing.spaceSmall,
    backgroundColor: "red",
    borderRadius: roundness,
  },
});
