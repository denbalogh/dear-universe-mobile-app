import { spacing } from "@/constants/theme";
import useCamera from "@/hooks/useCamera";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { VideoWithThumbnail } from "../MediaGallery/VideoGallery";
import { getThumbnailAsync } from "expo-video-thumbnails";
import EditableVideoGallery from "../MediaGallery/EditableVideoGallery";
import SelectableButtons from "./SelectableButtons";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

type Props = {
  videosWithThumbnail: VideoWithThumbnail[];
  onVideosChange: (videosWithThumbnail: VideoWithThumbnail[]) => void;
  onVideosDelete?: (videosWithThumbnail: VideoWithThumbnail[]) => void;
} & ViewProps;

const VideosSection = ({
  videosWithThumbnail,
  onVideosChange,
  onVideosDelete,
  ...viewProps
}: Props) => {
  const { showConfirmDialog } = useConfirmDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectable, setIsSelectable] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

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

  const handleMoveLeftPress = (index: number) => {
    const newVideos = [...videosWithThumbnail];
    const [removedVideo] = newVideos.splice(index, 1);
    newVideos.splice(index - 1, 0, removedVideo);
    onVideosChange(newVideos);
  };

  const handleMoveToStartPress = (index: number) => {
    const newVideos = [...videosWithThumbnail];
    const [removedVideo] = newVideos.splice(index, 1);
    newVideos.unshift(removedVideo);
    onVideosChange(newVideos);
  };

  const handleMoveRightPress = (index: number) => {
    const newVideos = [...videosWithThumbnail];
    const [removedVideo] = newVideos.splice(index, 1);
    newVideos.splice(index + 1, 0, removedVideo);
    onVideosChange(newVideos);
  };

  const handleMoveToEndPress = (index: number) => {
    const newVideos = [...videosWithThumbnail];
    const [removedVideo] = newVideos.splice(index, 1);
    newVideos.push(removedVideo);
    onVideosChange(newVideos);
  };

  const handleOnVideoLongPress = (index: number) => {
    setIsSelectable(true);
    setSelectedVideos([index]);
  };

  const handleSelectAll = () => {
    setSelectedVideos([...Array(videosWithThumbnail.length).keys()]);
  };

  const handleCancelSelection = () => {
    setIsSelectable(false);
    setSelectedVideos([]);
  };

  const handleOnSelectedDelete = () => {
    showConfirmDialog("Do you wish to delete the selected videos?", () => {
      const newImagesUri = videosWithThumbnail.filter(
        (_, index) => !selectedVideos.includes(index),
      );

      if (onVideosDelete) {
        onVideosDelete(
          selectedVideos.map((index) => videosWithThumbnail[index]),
        );
      }

      onVideosChange(newImagesUri);
      setSelectedVideos([]);
      setIsSelectable(false);
    });
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
        <>
          {!isSelectable && (
            <Text variant="labelMedium" style={styles.selectionInfoText}>
              Long press video to enable selection
            </Text>
          )}
          <EditableVideoGallery
            videosWithThumbnail={videosWithThumbnail}
            onMoveLeftPress={handleMoveLeftPress}
            onMoveToStartPress={handleMoveToStartPress}
            onMoveRightPress={handleMoveRightPress}
            onMoveToEndPress={handleMoveToEndPress}
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
            onVideoLongPress={handleOnVideoLongPress}
            selectable={
              isSelectable
                ? {
                    selected: selectedVideos,
                    onSelectedChange: setSelectedVideos,
                  }
                : undefined
            }
          />
          {isSelectable && (
            <SelectableButtons
              selectAllButtonProps={{ onPress: handleSelectAll }}
              deleteSelectedButtonProps={{ onPress: handleOnSelectedDelete }}
              cancelButtonProps={{ onPress: handleCancelSelection }}
            />
          )}
        </>
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
  selectionInfoText: {
    marginBottom: spacing.spaceSmall,
  },
});
