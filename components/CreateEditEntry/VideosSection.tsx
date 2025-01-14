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
import SelectableButtons from "./SelectableButtons";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

type Props = {
  videosWithThumbnail: VideoWithThumbnail[];
  onVideosChange: (videosWithThumbnail: VideoWithThumbnail[]) => void;
  initialSelectedThumbnailUri?: string;
} & ViewProps;

const VideosSection = ({
  videosWithThumbnail,
  onVideosChange,
  initialSelectedThumbnailUri,
  ...viewProps
}: Props) => {
  const { showConfirmDialog } = useConfirmDialog();
  const [isLoading, setIsLoading] = useState(false);

  const initialSelectedVideos = initialSelectedThumbnailUri
    ? [initialSelectedThumbnailUri]
    : [];

  const [selectedVideos, setSelectedVideos] = useState<string[]>(
    initialSelectedVideos,
  );

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

  const handleOnVideoLongPress = (thumbnailUri: string) => {
    setSelectedVideos([thumbnailUri]);
  };

  const handleSelectAll = () => {
    setSelectedVideos(videosWithThumbnail.map((video) => video.thumbnailUri));
  };

  const handleCancelSelection = () => {
    setSelectedVideos([]);
  };

  const handleOnSelectedDelete = () => {
    showConfirmDialog("Do you wish to delete the selected videos?", () => {
      const newVideos = videosWithThumbnail.filter(
        (video) => !selectedVideos.includes(video.thumbnailUri),
      );

      onVideosChange(newVideos);
      setSelectedVideos([]);
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
            selectedVideosThumbnailUri={selectedVideos}
            onSelectedVideosThumbnailUriChange={setSelectedVideos}
          />
          <SelectableButtons
            selectAllButtonProps={{ onPress: handleSelectAll }}
            deleteSelectedButtonProps={{
              onPress: handleOnSelectedDelete,
              disabled: !selectedVideos.length,
            }}
            cancelButtonProps={{
              onPress: handleCancelSelection,
              disabled: !selectedVideos.length,
            }}
          />
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
