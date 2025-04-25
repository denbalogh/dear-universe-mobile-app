import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { roundness, sizing, spacing } from "@/constants/theme";
import { Icon } from "react-native-paper";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import useDayObject from "@/hooks/useDayObject";
import { EntryData } from "@/components/DayScreenComponents/EntriesList/Entry";
import { Media } from "@/types/Media";
import { ITEM_HEIGHT } from "../constants";

type Props = {
  dateId: string;
};

const MediaPreview = ({ dateId }: Props) => {
  const theme = useCustomTheme();
  const [counter, setCounter] = useState(0);

  const { dayObject } = useDayObject(dateId);
  const { entryObjects = [] } = dayObject || {};

  const media = (entryObjects as EntryData[]).reduce(
    (acc, entry) => (entry?.media ? [...acc, ...entry.media] : acc),
    [] as Media[],
  );

  const intervalId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setCounter((curr) => curr + 1);
    }, 5000);

    return () => {
      clearTimeout(intervalId.current);
    };
  }, []);

  if (media.length === 0) {
    return null;
  }

  const activeIndex = counter % media.length;

  const uri = media[activeIndex].uri;
  const hasVideo = media[activeIndex].mediaType === "video";

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
