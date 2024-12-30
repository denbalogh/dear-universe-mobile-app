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
import useImageLibrary from "@/hooks/useImageLibrary";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
// import { Entry } from "@/models/Entry";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";
import {
  documentDirectory,
  // getInfoAsync,
  // makeDirectoryAsync,
  // moveAsync,
} from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
// import VideoGallery from "@/components/VideoGallery/VideoGallery";
import { getThumbnailAsync } from "expo-video-thumbnails";
import ImageGrid from "@/components/MediaGallery/ImageGrid";
import VideoGallery, {
  VideoWithThumbnail,
} from "@/components/MediaGallery/VideoGallery";

export const IMAGES_DIR = `${documentDirectory}images/`;

const NewEntryVideoScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId, comingFromScreen } =
    useLocalSearchParams<NewEntrySearchTermParams>();
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
    VideoWithThumbnail[]
  >([]);

  console.log(videosWithThumbnail);

  const handleAddVideos = async (newVideos: ImagePickerAsset[]) => {
    const videosWithThumbnails: VideoWithThumbnail[] = [];

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

  const openCamera = useCamera({
    onSuccess: handleAddVideos,
    type: "VIDEOS",
  });

  const openImageLibrary = useImageLibrary({
    onSuccess: handleAddVideos,
    type: "VIDEOS",
  });

  const hasVideos = videosWithThumbnail.length > 0;

  // const handleOnDeletePress = (index: number) => {
  //   setVideosURI((prevVideosURI) =>
  //     prevVideosURI.filter((_, i) => i !== index),
  //   );
  // };

  // const handleMoveLeftPress = (index: number) => {
  //   setVideosURI((prevVideosURI) => {
  //     const newVideosU = [...prevVideosURI];
  //     const [removedImage] = newVideosU.splice(index, 1);
  //     newVideosU.splice(index - 1, 0, removedImage);
  //     return newVideosU;
  //   });
  // };

  // const handleMoveRightPress = (index: number) => {
  //   setVideosURI((prevVideosURI) => {
  //     const newVideosURI = [...prevVideosURI];
  //     const [removedVideoURI] = newVideosURI.splice(index, 1);
  //     newVideosURI.splice(index + 1, 0, removedVideoURI);
  //     return newVideosURI;
  //   });
  // };

  const { showDiscardDialog } = useDiscardDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showDiscardDialog({
      message: "Do you wish to discard the videos?",
      callback: router.back,
    });
  }, [showDiscardDialog, router.back]);

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
    // const { exists } = await getInfoAsync(IMAGES_DIR);
    // if (!exists) {
    //   await makeDirectoryAsync(IMAGES_DIR);
    // }
    // const newImages = [];
    // for (const uri of imagesURI) {
    //   const filename = uri.split("/").pop();
    //   const dest = `${IMAGES_DIR}${filename}`;
    //   await moveAsync({
    //     from: uri,
    //     to: dest,
    //   });
    //   newImages.push(dest);
    // }
    // createEntryWithImages(newImages);
  };

  //   const createEntryWithImages = (imagesURI: string[]) => {
  //     if (dayObject === null) {
  //       return;
  //     }

  //     realm.write(() => {
  //       const entry = realm.create(Entry, {
  //         imagesURI,
  //         day: dayObject,
  //       });

  //       dayObject.entryObjects.push(entry);
  //     });

  //     if (comingFromScreen === "index") {
  //       router.replace({
  //         pathname: "/day/[dateId]",
  //         params: { dateId },
  //       });
  //     } else {
  //       router.back();
  //     }
  //   };

  const thumbnailsUri = videosWithThumbnail.map(
    ({ thumbnailUri }) => thumbnailUri,
  );

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={handleBackPress} />
            </Appbar.Header>
          ),
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
          <View style={styles.imageSourceWrapper}>
            <Text variant="bodyLarge" style={styles.imageSourceTitle}>
              Choose source of the videos:
            </Text>
            <View style={styles.imageSourceButtonsWrapper}>
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
              {/* <VideoGallery
                videosURI={videosURI}
                optionsCallbacks={{
                  onDeletePress: handleOnDeletePress,
                  onMoveLeftPress: handleMoveLeftPress,
                  onMoveRightPress: handleMoveRightPress,
                }}
                addButtons={{
                  onCameraPress: openCamera,
                  onVideoLibraryPress: openImageLibrary,
                }}
              /> */}
              <VideoGallery
                videosWithThumbnail={videosWithThumbnail}
                gridSize={3}
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
  imageSourceWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "stretch",
    paddingBottom: spacing.spaceLarge,
    marginTop: spacing.spaceMedium,
  },
  imageSourceButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  imageSourceTitle: {
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
