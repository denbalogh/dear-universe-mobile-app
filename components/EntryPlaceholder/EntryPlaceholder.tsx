import { roundness, spacing } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { getRandomEntry, RandomEntry } from "./utils";
import MediaPlaceholder from "./MediaPlaceholder/MediaPlaceholder";
import BottomBarPlaceholder from "./BottomBarPlaceholder";
import RecordingPlaceholder from "./RecordingPlaceholder";
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const EntryPlaceholder = () => {
  const [entry, setEntry] = useState<RandomEntry>(getRandomEntry());
  const opacity = useSharedValue(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeout(() => setEntry(getRandomEntry()), 500);
      opacity.value = withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      );
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [entry, opacity]);

  const { title, description, media, hasRecording, feelingsGroupName } = entry;

  return (
    <>
      <Card style={styles.wrapper} mode="contained">
        <Card.Content style={styles.cardContent}>
          <Text variant="labelSmall">Example entry</Text>
          <Animated.View style={[styles.titleWrapper, { opacity }]}>
            <Text variant="titleLarge">{title}</Text>
          </Animated.View>
          <MediaPlaceholder media={media} style={{ opacity }} />
          {hasRecording && <RecordingPlaceholder style={{ opacity }} />}
          <Animated.View style={[styles.descriptionWrapper, { opacity }]}>
            <Text variant="bodyMedium">{description}</Text>
          </Animated.View>
          <BottomBarPlaceholder
            feelingsGroupName={feelingsGroupName}
            style={{ opacity }}
          />
        </Card.Content>
      </Card>
      <Text style={styles.bottomMessage} variant="titleMedium">
        You can add multiple entries with text, recording, images, videos and
        feelings.
      </Text>
    </>
  );
};

export default EntryPlaceholder;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
  },
  cardContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingBottom: spacing.spaceSmall,
    paddingTop: spacing.spaceExtraSmall,
  },
  titleWrapper: {
    paddingVertical: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
  descriptionWrapper: {
    paddingVertical: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
  bottomMessage: {
    textAlign: "center",
    marginTop: spacing.spaceMedium,
    paddingHorizontal: spacing.spaceMedium,
  },
});
