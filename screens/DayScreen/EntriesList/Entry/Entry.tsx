import { roundness, sizing, spacing } from "@/common/constants/theme";
import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import AudioPlayer from "@/common/components/AudioPlayer/AudioPlayer";
import { Media } from "@/common/types/Media";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import CustomMenu from "@/common/components/CustomMenu";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import MediaGallery from "./MediaGallery/MediaGallery";

export type EntryData = {
  text: string;
  recordingUri: string;
  media: Media[];
  feelingsGroup: FEELING_GROUP_NAMES;
  feelingsEmotions: string[];
};

type Props = { isDraft?: boolean } & EntryData;

const Entry = ({
  text,
  recordingUri,
  media,
  feelingsGroup,
  feelingsEmotions,
  isDraft = false,
}: Props) => {
  const theme = useCustomTheme();
  const hasMedia = media.length > 0;
  const hasRecording = !!recordingUri;
  const hasText = !!text;
  const hasFeelings = feelingsEmotions.length > 0;

  const { clear } = useEntryDraft();

  const optionsMenu = useMemo(() => {
    if (isDraft) {
      return [
        {
          title: "Clear",
          onPress: clear,
          leadingIcon: "close",
        },
      ];
    }

    return [];
  }, [isDraft, clear]);

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
      <Card.Content style={styles.cardContent}>
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
        {hasMedia && (
          <View style={styles.mediaGallery}>
            <MediaGallery media={media} />
          </View>
        )}
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
        <View style={styles.bottomBarWrapper}>
          <View style={styles.emotionsWrapper}>
            {(hasFeelings ? feelingsEmotions : [feelingsGroup]).map(
              (emotion, index) => (
                <Text
                  key={`${emotion}-${index}`}
                  style={[
                    styles.emotion,
                    {
                      backgroundColor:
                        theme.colors[`${feelingsGroup}Container`],
                    },
                  ]}
                >
                  {emotion}
                </Text>
              ),
            )}
          </View>
          <CustomMenu menuItems={optionsMenu}>
            {({ openMenu }) => (
              <IconButton
                size={sizing.sizeMedium}
                icon="dots-horizontal"
                onPress={openMenu}
                style={styles.bottomBarIconButton}
              />
            )}
          </CustomMenu>
        </View>
      </Card.Content>
    </Card>
  );
};

export default memo(Entry);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
    marginVertical: spacing.spaceSmall,
  },
  cardContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingTop: spacing.spaceSmall,
    paddingBottom: spacing.spaceExtraSmall,
  },
  draftText: {
    paddingHorizontal: spacing.spaceExtraSmall,
    position: "absolute",
    top: -12,
    left: spacing.spaceSmall,
    zIndex: 3,
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
  bottomBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emotionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  emotion: {
    marginRight: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
    padding: spacing.spaceExtraSmall,
    borderRadius: roundness,
  },
  bottomBarIconButton: {
    height: 25,
  },
});
