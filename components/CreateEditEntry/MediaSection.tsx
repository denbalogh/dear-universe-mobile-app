import { spacing } from "@/constants/theme";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { getThumbnailAsync } from "expo-video-thumbnails";
import EditableMediaGallery, {
  Media,
} from "@/components/MediaGallery/EditableMediaGallery";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import CameraModal from "../CameraModal/CameraModal";
import useCameraPermissions from "@/hooks/useCameraPermissions";

type Props = {
  media: Media[];
  onMediaChange: (media: Media[]) => void;
  initialSelectedMediaImageUri?: string;
} & ViewProps;

const MediaSection = ({
  media,
  onMediaChange,
  initialSelectedMediaImageUri,
  ...viewProps
}: Props) => {
  const theme = useCustomTheme();
  const { showConfirmDialog } = useConfirmDialog();
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { cameraGranted, requestCameraPermission } = useCameraPermissions();

  const openCameraModal = () => {
    setIsCameraModalVisible(true);
  };

  const handleOpenCameraModal = useCallback(() => {
    if (cameraGranted) {
      openCameraModal();
    } else {
      requestCameraPermission(openCameraModal);
    }
  }, [cameraGranted, requestCameraPermission]);

  const closeCameraModal = () => {
    setIsCameraModalVisible(false);
  };

  const initialSelectedMediaImagesUri = initialSelectedMediaImageUri
    ? [initialSelectedMediaImageUri]
    : [];

  const [selectedMediaImagesUri, setSelectedMediaImagesUri] = useState<
    string[]
  >(initialSelectedMediaImagesUri);

  const handleAddMedia = useCallback(
    async (assets: ImagePickerAsset[]) => {
      const newMedia = [];

      for (const { type, uri } of assets) {
        if (type === "video") {
          const { uri: thumbnailUri } = await getThumbnailAsync(uri, {
            time: 0,
          });
          newMedia.push({ imageUri: thumbnailUri, videoUri: uri });
        }

        if (type === "image") {
          newMedia.push({ imageUri: uri });
        }
      }

      onMediaChange([...media, ...newMedia]);
      setIsLoading(false);
    },
    [media, onMediaChange],
  );

  const handleOnCancel = useCallback(() => {
    setIsLoading(false);
  }, []);

  const openImageLibrary = useMediaLibrary(
    ["images", "videos"],
    handleAddMedia,
    handleOnCancel,
  );

  const handleOpenImageLibrary = () => {
    openImageLibrary();
    setIsLoading(true);
  };

  const hasMedia = media.length > 0;

  const handleMoveLeftPress = (index: number) => {
    const newMedia = [...media];
    const [removedMedia] = newMedia.splice(index, 1);
    newMedia.splice(index - 1, 0, removedMedia);
    onMediaChange(newMedia);
  };

  const handleMoveToStartPress = (index: number) => {
    const newMedia = [...media];
    const [removedMedia] = newMedia.splice(index, 1);
    newMedia.unshift(removedMedia);
    onMediaChange(newMedia);
  };

  const handleMoveRightPress = (index: number) => {
    const newMedia = [...media];
    const [removedMedia] = newMedia.splice(index, 1);
    newMedia.splice(index + 1, 0, removedMedia);
    onMediaChange(newMedia);
  };

  const handleMoveToEndPress = (index: number) => {
    const newMedia = [...media];
    const [removedMedia] = newMedia.splice(index, 1);
    newMedia.push(removedMedia);
    onMediaChange(newMedia);
  };

  const handleSelectSingle = (uri: string) => {
    setSelectedMediaImagesUri([uri]);
  };

  const handleSelectAll = () => {
    setSelectedMediaImagesUri(media.map(({ imageUri }) => imageUri));
  };

  const handleCancelSelection = () => {
    setSelectedMediaImagesUri([]);
  };

  const handleOnSelectedDelete = () => {
    showConfirmDialog("Do you wish to delete the selected media?", () => {
      const newMedia = media.filter(
        ({ imageUri }) => !selectedMediaImagesUri.includes(imageUri),
      );

      onMediaChange(newMedia);
      handleCancelSelection();
    });
  };

  return (
    <View {...viewProps}>
      {!hasMedia ? (
        <>
          {isLoading && (
            <View style={styles.loadingIndicatorWrapper}>
              <ActivityIndicator size="large" />
            </View>
          )}
          <View style={styles.imageSourceWrapper}>
            <View style={styles.addMediaButtonWrapper}>
              <Button
                mode="elevated"
                icon="camera"
                onPress={handleOpenCameraModal}
                loading={isLoading}
                style={styles.buttonLeft}
                disabled={isLoading}
              >
                Use camera
              </Button>
            </View>
            <View style={styles.addMediaButtonWrapper}>
              <Button
                mode="elevated"
                icon="image-multiple"
                onPress={handleOpenImageLibrary}
                style={styles.buttonRight}
                loading={isLoading}
                disabled={isLoading}
              >
                From gallery
              </Button>
            </View>
          </View>
        </>
      ) : (
        <>
          <EditableMediaGallery
            media={media}
            onMoveLeftPress={handleMoveLeftPress}
            onMoveToStartPress={handleMoveToStartPress}
            onMoveRightPress={handleMoveRightPress}
            onMoveToEndPress={handleMoveToEndPress}
            addButtons={[
              {
                leadingIcon: "camera",
                title: "Open camera",
                onPress: handleOpenCameraModal,
              },
              {
                leadingIcon: "image-multiple",
                title: "From gallery",
                onPress: handleOpenImageLibrary,
              },
            ]}
            addButtonsLoading={isLoading}
            onMediaLongPress={handleSelectSingle}
            selectedMediaImagesUri={selectedMediaImagesUri}
            onSelectedMediaImagesUriChange={setSelectedMediaImagesUri}
          />
          <View style={styles.selectionButtonsWrapper}>
            <IconButton onPress={handleSelectAll} icon="check-all" />
            <IconButton
              onPress={handleCancelSelection}
              disabled={!selectedMediaImagesUri.length}
              icon="cancel"
            />
            <Button
              style={styles.selectionButton}
              mode="outlined"
              textColor={theme.colors.error}
              onPress={handleOnSelectedDelete}
              disabled={!selectedMediaImagesUri.length}
            >
              Delete selected
            </Button>
          </View>
        </>
      )}
      <CameraModal
        isVisible={isCameraModalVisible}
        onClose={closeCameraModal}
      />
    </View>
  );
};

export default MediaSection;

const styles = StyleSheet.create({
  imageSourceWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  loadingIndicatorWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.spaceLarge,
  },
  addMediaButtonWrapper: {
    width: "50%",
  },
  buttonLeft: {
    marginRight: spacing.spaceExtraSmall,
  },
  buttonRight: {
    marginLeft: spacing.spaceExtraSmall,
  },
  selectionButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.spaceMedium,
  },
  selectionButton: {
    flex: 1,
    marginLeft: spacing.spaceSmall,
  },
});
