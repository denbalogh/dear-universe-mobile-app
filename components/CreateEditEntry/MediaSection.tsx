import { spacing } from "@/constants/theme";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { getThumbnailAsync } from "expo-video-thumbnails";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import CameraModal from "../CameraModal/CameraModal";
import useCameraPermissions from "@/hooks/useCameraPermissions";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { CameraMode } from "expo-camera";
import CustomMenu from "../CustomMenu/CustomMenu";
import EditableMediaGallery from "../DayScreenComponents/BottomSheet/MediaSection/EditableMediaGallery";
import logCrashlytics from "@/utils/logCrashlytics";

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
  const { showSnackbar } = useSnackbar();
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const [initialCameraMode, setInitialCameraMode] =
    useState<CameraMode>("picture");
  const [isLoading, setIsLoading] = useState(false);

  const { cameraGranted, requestCameraPermission } = useCameraPermissions();

  const handleOpenCameraModal = useCallback(
    (mode: CameraMode) => {
      const openCameraModal = () => {
        setIsCameraModalVisible(true);
        setInitialCameraMode(mode);
      };

      if (cameraGranted) {
        openCameraModal();
      } else {
        requestCameraPermission(openCameraModal);
      }
    },
    [cameraGranted, requestCameraPermission],
  );

  const closeCameraModal = () => {
    setIsCameraModalVisible(false);
  };

  const initialSelectedMediaImagesUri = initialSelectedMediaImageUri
    ? [initialSelectedMediaImageUri]
    : [];

  const [selectedMediaImagesUri, setSelectedMediaImagesUri] = useState<
    string[]
  >(initialSelectedMediaImagesUri);

  const handleAddMediaFromImagePicker = useCallback(
    async (assets: ImagePickerAsset[]) => {
      const newMedia = [];

      logCrashlytics("Adding media from image picker");

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

  const handleAddImageFromCamera = useCallback(
    (imageUri: string) => {
      onMediaChange([...media, { imageUri }]);
      setIsLoading(false);

      showSnackbar("Picture was saved to entry");
    },
    [media, onMediaChange, showSnackbar],
  );

  const handleAddVideoFromCamera = useCallback(
    async (videoUri: string) => {
      logCrashlytics("Adding video from camera");
      const { uri: thumbnailUri } = await getThumbnailAsync(videoUri, {
        time: 0,
      });

      onMediaChange([...media, { imageUri: thumbnailUri, videoUri }]);
      setIsLoading(false);

      showSnackbar("Video was saved to entry");
    },
    [media, onMediaChange, showSnackbar],
  );

  const handleOnCancel = useCallback(() => {
    setIsLoading(false);
  }, []);

  const openImageLibrary = useMediaLibrary(
    ["images", "videos"],
    handleAddMediaFromImagePicker,
    handleOnCancel,
  );

  const handleOpenImageLibrary = () => {
    openImageLibrary();
    setIsLoading(true);
  };

  const hasMedia = media.length > 0;

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

  const handleOrderChange = useCallback(
    (fromId: string, toId: string) => {
      logCrashlytics("Changing media order");
      const fromIndex = media.findIndex(({ imageUri }) => imageUri === fromId);
      const toIndex = media.findIndex(({ imageUri }) => imageUri === toId);

      const newMedia = [...media];
      const [removed] = newMedia.splice(fromIndex, 1);
      newMedia.splice(toIndex, 0, removed);

      onMediaChange(newMedia);
    },
    [media, onMediaChange],
  );

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
              <CustomMenu
                menuItems={[
                  {
                    title: "Take a photo",
                    leadingIcon: "camera",
                    onPress: () => handleOpenCameraModal("picture"),
                  },
                  {
                    title: "Record a video",
                    leadingIcon: "video",
                    onPress: () => handleOpenCameraModal("video"),
                  },
                ]}
              >
                {({ openMenu }) => (
                  <Button
                    mode="elevated"
                    icon="camera"
                    onPress={openMenu}
                    loading={isLoading}
                    style={styles.buttonLeft}
                    disabled={isLoading}
                  >
                    Use camera
                  </Button>
                )}
              </CustomMenu>
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
            onOrderChange={handleOrderChange}
            addButtons={[
              {
                leadingIcon: "camera",
                title: "Take a photo",
                onPress: () => handleOpenCameraModal("picture"),
              },
              {
                leadingIcon: "video",
                title: "Record a video",
                onPress: () => handleOpenCameraModal("video"),
              },
              {
                leadingIcon: "image-multiple",
                title: "From gallery",
                onPress: handleOpenImageLibrary,
              },
            ]}
            addButtonsLoading={isLoading}
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
        onPictureSaved={handleAddImageFromCamera}
        onVideoSaved={handleAddVideoFromCamera}
        initialMode={initialCameraMode}
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
