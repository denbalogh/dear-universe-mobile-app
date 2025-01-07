import { spacing } from "@/constants/theme";
import useCamera from "@/hooks/useCamera";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { VideoWithThumbnail } from "../MediaGallery/VideoGallery";
import { getThumbnailAsync } from "expo-video-thumbnails";
import EditableVideoGallery from "../MediaGallery/EditableVideoGallery";

type Props = {
  videosWithThumbnail: VideoWithThumbnail[];
  onVideosChange: (videosWithThumbnail: VideoWithThumbnail[]) => void;
  onVideoDelete?: (videoWithThumbnail: VideoWithThumbnail) => void;
} & ViewProps;

const VideosSection = ({
  videosWithThumbnail,
  onVideosChange,
  onVideoDelete,
  ...viewProps
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddVideos = async (newVideos: ImagePickerAsset[]) => {
    const newVideosWithThumbnail: VideoWithThumbnail[] = [];

    for (const video of newVideos) {
      const { uri: thumbnailUri } = await getThumbnailAsync(video.uri, {
        time: 0,
      });

      newVideosWithThumbnail.push({ videoUri: video.uri, thumbnailUri });
    }

    onVideosChange([...videosWithThumbnail, ...newVideosWithThumbnail]);
    setIsLoading(false);
  };

  const handleOnCancel = () => {
    setIsLoading(false);
  };

  const openCamera = useCamera("videos", handleAddVideos, handleOnCancel);
  const handleOpenCamera = () => {
    openCamera();
    setIsLoading(true);
  };

  const openImageLibrary = useMediaLibrary(
    "videos",
    handleAddVideos,
    handleOnCancel,
  );
  const handleOpenImageLibrary = () => {
    openImageLibrary();
    setIsLoading(true);
  };

  const hasVideos = videosWithThumbnail.length > 0;

  const handleOnDeletePress = (index: number) => {
    const newVideos = videosWithThumbnail.filter((_, i) => i !== index);

    if (onVideoDelete) {
      onVideoDelete(videosWithThumbnail[index]);
    }

    onVideosChange(newVideos);
  };

  const handleMoveLeftPress = (index: number) => {
    const newVideos = [...videosWithThumbnail];
    const [removedVideo] = newVideos.splice(index, 1);
    newVideos.splice(index - 1, 0, removedVideo);
    onVideosChange(newVideos);
  };

  const handleMoveRightPress = (index: number) => {
    const newVideos = [...videosWithThumbnail];
    const [removedVideo] = newVideos.splice(index, 1);
    newVideos.splice(index + 1, 0, removedVideo);
    onVideosChange(newVideos);
  };

  return (
    <View {...viewProps}>
      {!hasVideos ? (
        <>
          {isLoading && (
            <View style={styles.loadingIndicatorWrapper}>
              <ActivityIndicator size="large" />
            </View>
          )}
          <View style={styles.videoSourceWrapper}>
            <Button
              mode="elevated"
              icon="camera"
              onPress={handleOpenCamera}
              style={styles.leftButton}
              disabled={isLoading}
            >
              Record a video
            </Button>
            <Button
              mode="elevated"
              icon="filmstrip-box-multiple"
              onPress={handleOpenImageLibrary}
              style={styles.rightButton}
              disabled={isLoading}
            >
              From gallery
            </Button>
          </View>
        </>
      ) : (
        <EditableVideoGallery
          videosWithThumbnail={videosWithThumbnail}
          addButtons={[
            {
              leadingIcon: "camera",
              title: "Record a video",
              onPress: handleOpenCamera,
            },
            {
              leadingIcon: "filmstrip-box-multiple",
              title: "From gallery",
              onPress: handleOpenImageLibrary,
            },
          ]}
          addButtonsLoading={isLoading}
          optionsCallbacks={{
            onDeletePress: handleOnDeletePress,
            onMoveLeftPress: handleMoveLeftPress,
            onMoveRightPress: handleMoveRightPress,
          }}
        />
      )}
    </View>
  );
};

export default VideosSection;

const styles = StyleSheet.create({
  videoSourceWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  loadingIndicatorWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.spaceLarge,
  },
  leftButton: {
    flex: 1,
    marginRight: spacing.spaceExtraSmall,
  },
  rightButton: {
    flex: 1,
    marginLeft: spacing.spaceExtraSmall,
  },
});
