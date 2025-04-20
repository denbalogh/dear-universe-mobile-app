import { roundness, spacing } from "@/constants/theme";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import MediaGallery from "@/components/MediaGallery/MediaGallery";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import { Media } from "@/types/Media";
import { useCustomTheme } from "@/hooks/useCustomTheme";

export type EntryData = {
  text: string;
  recordingUri: string;
  media: Media[];
  feelingsGroup: FEELING_GROUP_NAMES;
  feelingsEmotions: string[];
};

type Props = { isDraft: boolean } & EntryData;

const Entry = ({
  text,
  recordingUri,
  media,
  feelingsGroup,
  feelingsEmotions,
  isDraft,
}: Props) => {
  const theme = useCustomTheme();
  const hasMedia = media.length > 0;
  const hasRecording = !!recordingUri;
  const hasText = !!text;
  const hasFeelings = feelingsEmotions.length > 0;

  return (
    <Card
      style={[
        styles.wrapper,
        {
          marginTop: isDraft ? spacing.spaceSmall : 0,
        },
      ]}
      mode={isDraft ? "outlined" : "contained"}
    >
      <Card.Content
        style={[
          styles.cardContent,
          {
            paddingTop: isDraft ? spacing.spaceMedium : spacing.spaceSmall,
          },
        ]}
      >
        {isDraft && (
          <Text
            style={[
              styles.draftText,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            DRAFT
          </Text>
        )}
        {hasMedia && <MediaGallery media={media} style={styles.mediaGallery} />}
        {hasRecording && (
          <View style={styles.recording}>
            <AudioPlayer sourceUri={recordingUri} />
          </View>
        )}
        {hasText && (
          <Text variant="bodyMedium" style={styles.text}>
            {text}
          </Text>
        )}
        <View style={styles.emotionsWrapper}>
          {(hasFeelings ? feelingsEmotions : [feelingsGroup]).map(
            (emotion, index) => (
              <Text
                key={`${emotion}-${index}`}
                style={[
                  styles.emotion,
                  {
                    backgroundColor: theme.colors[`${feelingsGroup}Container`],
                  },
                ]}
              >
                {emotion}
              </Text>
            ),
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export default memo(Entry);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
  },
  cardContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingVertical: spacing.spaceSmall,
  },
  draftText: {
    marginBottom: spacing.spaceSmall,
    paddingHorizontal: spacing.spaceExtraSmall,
    position: "absolute",
    top: -spacing.spaceSmall,
    left: spacing.spaceSmall,
    zIndex: 2,
  },
  mediaGallery: {
    marginVertical: spacing.spaceExtraSmall,
  },
  recording: {
    marginVertical: spacing.spaceExtraSmall,
  },
  text: {
    marginVertical: spacing.spaceExtraSmall,
  },
  emotionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emotion: {
    margin: spacing.spaceExtraSmall,
    padding: spacing.spaceExtraSmall,
    borderRadius: roundness,
  },
});
