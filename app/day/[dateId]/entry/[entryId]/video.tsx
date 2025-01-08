import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB, Text, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { formatFullDate, parseDateId } from "@/utils/date";
import useCamera from "@/hooks/useCamera";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry, VideoWithThumbnail } from "@/models/Entry";
import { EntrySearchParams } from "@/types/createEditEntryScreen";
import { BSON } from "realm";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  deleteAsync,
  getInfoAsync,
  makeDirectoryAsync,
  moveAsync,
} from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
import { isEqual } from "lodash";
import { THUMBNAILS_DIR, VIDEOS_DIR } from "@/constants/files";
import { VideoWithThumbnail as VideoWithThumbnailType } from "@/components/MediaGallery/VideoGallery";
import { getThumbnailAsync } from "expo-video-thumbnails";
import EditableVideoGallery from "@/components/MediaGallery/EditableVideoGallery";

const EditEntryVideosScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId, entryId } = useLocalSearchParams<EntrySearchParams>();

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const { videosWithThumbnail: initialVideosWithThumbnail = [] } =
    entryObject || {};

  const hasInitialImages = initialVideosWithThumbnail.length > 0;

  const [videosWithThumbnail, setVideosWithThumbnail] = useState<
    VideoWithThumbnailType[]
  >(initialVideosWithThumbnail);
  const videosToDelete = useRef<VideoWithThumbnailType[]>([]);

  const handleAddVideos = async (newVideos: ImagePickerAsset[]) => {
    const videosWithThumbnails: VideoWithThumbnailType[] = [];

    for (const video of newVideos) {
      const { uri: thumbnailUri } = await getThumbnailAsync(video.uri, {
        time: 0,
      });

      videosWithThumbnails.push({ videoUri: video.uri, thumbnailUri });
    }

    setVideosWithThumbnail((prevVideos) => [
      ...prevVideos,
      ...videosWithThumbnails,
    ]);
  };

  const openCamera = useCamera("videos", handleAddVideos);
  const openImageLibrary = useMediaLibrary("videos", handleAddVideos);

  const hasVideos = videosWithThumbnail.length > 0;

  const handleOnDeletePress = (index: number) => {
    videosToDelete.current.push(videosWithThumbnail[index]);

    setVideosWithThumbnail((prevVideosWithThumbnail) =>
      prevVideosWithThumbnail.filter((_, i) => i !== index),
    );
  };

  const handleMoveLeftPress = (index: number) => {
    setVideosWithThumbnail((prevVideosWithThumbnail) => {
      const newVideos = [...prevVideosWithThumbnail];
      const [removedVideo] = newVideos.splice(index, 1);
      newVideos.splice(index - 1, 0, removedVideo);
      return newVideos;
    });
  };

  const handleMoveRightPress = (index: number) => {
    setVideosWithThumbnail((prevVideosWithThumbnail) => {
      const newVideos = [...prevVideosWithThumbnail];
      const [removedVideo] = newVideos.splice(index, 1);
      newVideos.splice(index + 1, 0, removedVideo);
      return newVideos;
    });
  };

  const isEdited = !isEqual(videosWithThumbnail, initialVideosWithThumbnail);

  const { showConfirmDialog } = useConfirmDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showConfirmDialog("Do you wish to discard the changes?", router.back);
  }, [showConfirmDialog, router.back]);

  const handleBackPress = () => {
    if (isEdited) {
      handleShowDiscardDialog();
    } else {
      router.back();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEdited) {
          handleShowDiscardDialog();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [isEdited, handleShowDiscardDialog]),
  );

  const handleSavePress = async () => {
    const { exists: existsVideosDir } = await getInfoAsync(VIDEOS_DIR);
    if (!existsVideosDir) {
      await makeDirectoryAsync(VIDEOS_DIR);
    }

    const { exists: existsThumbnailsDir } = await getInfoAsync(THUMBNAILS_DIR);
    if (!existsThumbnailsDir) {
      await makeDirectoryAsync(THUMBNAILS_DIR);
    }

    // Delete videos and thumbnails that were removed
    for (const { videoUri, thumbnailUri } of videosToDelete.current) {
      await deleteAsync(videoUri);
      await deleteAsync(thumbnailUri);
    }

    const newVideos = [];

    for (const { videoUri, thumbnailUri } of videosWithThumbnail) {
      const isVideoNew = !initialVideosWithThumbnail.some((item) => {
        return item.videoUri === videoUri && item.thumbnailUri === thumbnailUri;
      });

      if (isVideoNew) {
        const videoFilename = videoUri.split("/").pop();
        const thumbnailFilename = thumbnailUri.split("/").pop();

        const videoDest = `${VIDEOS_DIR}${videoFilename}`;
        const thumbnailDest = `${THUMBNAILS_DIR}${thumbnailFilename}`;

        await moveAsync({
          from: videoUri,
          to: videoDest,
        });

        await moveAsync({
          from: thumbnailUri,
          to: thumbnailDest,
        });

        newVideos.push({ videoUri: videoDest, thumbnailUri: thumbnailDest });
      } else {
        newVideos.push({ videoUri, thumbnailUri });
      }
    }

    updateEntryWithVideos(newVideos);
  };

  const updateEntryWithVideos = (
    videosWithThumbnail: VideoWithThumbnailType[],
  ) => {
    if (entryObject === null) {
      return;
    }

    realm.write(() => {
      entryObject.videosWithThumbnail =
        videosWithThumbnail as VideoWithThumbnail[];
    });

    router.back();
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={handleBackPress} />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.surface,
        }}
      />
      <View style={styles.contentWrapper}>
        <Text variant="titleMedium" style={styles.subheading}>
          {formatFullDate(parseDateId(dateId))}
        </Text>
        <Text variant="headlineLarge" style={styles.headline}>
          {hasInitialImages ? "Editing videos" : "Adding videos"}
        </Text>
        {!hasVideos ? (
          <View style={styles.videoSourceWrapper}>
            <Text variant="bodyLarge" style={styles.videoSourceTitle}>
              Choose source of the videos:
            </Text>
            <View style={styles.videoSourceButtonsWrapper}>
              <FAB
                mode="elevated"
                icon="camera"
                label="Record a video"
                onPress={openCamera}
              />
              <FAB
                mode="elevated"
                icon="filmstrip-box-multiple"
                label="From gallery"
                onPress={openImageLibrary}
              />
            </View>
            {hasInitialImages && (
              <CloseSaveButtons
                style={styles.bottomButtons}
                closeButton={{ onPress: handleBackPress }}
                saveButton={{ onPress: handleSavePress, disabled: !isEdited }}
              />
            )}
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <EditableVideoGallery
                videosWithThumbnail={videosWithThumbnail}
                addButtons={[
                  {
                    leadingIcon: "camera",
                    title: "Record a video",
                    onPress: openCamera,
                  },
                  {
                    leadingIcon: "filmstrip-box-multiple",
                    title: "From gallery",
                    onPress: openImageLibrary,
                  },
                ]}
                optionsCallbacks={{
                  onDeletePress: handleOnDeletePress,
                  onMoveLeftPress: handleMoveLeftPress,
                  onMoveRightPress: handleMoveRightPress,
                }}
              />
            </ScrollView>
            <CloseSaveButtons
              style={styles.bottomButtons}
              closeButton={{ onPress: handleBackPress }}
              saveButton={{ onPress: handleSavePress, disabled: !isEdited }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default EditEntryVideosScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  subheading: {
    margin: spacing.spaceMedium,
    marginBottom: 0,
  },
  headline: {
    margin: spacing.spaceMedium,
    marginTop: 0,
  },
  scrollViewContent: {
    padding: spacing.spaceMedium,
  },
  extraItemWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoSourceWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "stretch",
    marginTop: spacing.spaceMedium,
  },
  videoSourceButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: spacing.spaceLarge,
  },
  videoSourceTitle: {
    marginBottom: spacing.spaceMedium,
    textAlign: "center",
  },
  bottomButtons: {
    padding: spacing.spaceMedium,
  },
});
