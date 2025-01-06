import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB, Text, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { formatFullDate, parseDateId } from "@/utils/date";
import { NewEntrySearchTermParams } from "@/types/newEntryTextScreen";
import useCamera from "@/hooks/useCamera";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { getInfoAsync, makeDirectoryAsync, moveAsync } from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
import { getThumbnailAsync } from "expo-video-thumbnails";
import { VideoWithThumbnail as VideoWithThumbnailType } from "@/components/MediaGallery/VideoGallery";
import EditableVideoGallery from "@/components/MediaGallery/EditableVideoGallery";
import { THUMBNAILS_DIR, VIDEOS_DIR } from "@/constants/files";
import { Entry, VideoWithThumbnail } from "@/models/Entry";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

const NewEntryVideoScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId } = useLocalSearchParams<NewEntrySearchTermParams>();
  const dayObject = useObject(Day, dateId);

  useEffect(() => {
    if (dayObject === null) {
      realm.write(() => {
        realm.create(Day, {
          _id: dateId,
        });
      });
    }
  }, [dateId, dayObject, realm]);

  const [videosWithThumbnail, setVideosWithThumbnail] = useState<
    VideoWithThumbnailType[]
  >([]);

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

  const { showConfirmDialog } = useConfirmDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showConfirmDialog("Do you wish to discard the videos?", router.back);
  }, [showConfirmDialog, router.back]);

  const handleBackPress = () => {
    if (hasVideos) {
      handleShowDiscardDialog();
    } else {
      router.back();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (hasVideos) {
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
    }, [hasVideos, handleShowDiscardDialog]),
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

    const newVideos = [];

    for (const { videoUri, thumbnailUri } of videosWithThumbnail) {
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
    }

    createEntryWithVideos(newVideos);
  };

  const createEntryWithVideos = (
    videosWithThumbnail: VideoWithThumbnailType[],
  ) => {
    if (dayObject === null) {
      return;
    }

    realm.write(() => {
      const entry = realm.create(Entry, {
        videosWithThumbnail: videosWithThumbnail as VideoWithThumbnail[],
        day: dayObject,
      });

      dayObject.entryObjects.push(entry);
    });

    router.dismissTo({
      pathname: "/day/[dateId]",
      params: { dateId },
    });
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
          Creating new entry with videos
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
              saveButton={{ onPress: handleSavePress }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default NewEntryVideoScreen;

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
    marginTop: spacing.spaceExtraSmall,
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
    paddingBottom: spacing.spaceLarge,
    marginTop: spacing.spaceMedium,
  },
  videoSourceButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  videoSourceTitle: {
    marginBottom: spacing.spaceMedium,
    textAlign: "center",
  },
  bottomButtons: {
    padding: spacing.spaceMedium,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
