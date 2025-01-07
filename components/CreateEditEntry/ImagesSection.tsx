import { spacing } from "@/constants/theme";
import useCamera from "@/hooks/useCamera";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import EditableImageGallery from "../MediaGallery/EditableImageGallery";

type Props = {
  imagesUri: string[];
  onImagesChange: (imagesUri: string[]) => void;
  onImageDelete?: (imageUri: string) => void;
} & ViewProps;

const ImagesSection = ({
  imagesUri,
  onImagesChange,
  onImageDelete,
  ...viewProps
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddImages = (newImages: ImagePickerAsset[]) => {
    const newImagesUri = newImages.map((image) => image.uri);
    onImagesChange([...imagesUri, ...newImagesUri]);
    setIsLoading(false);
  };

  const handleOnCancel = () => {
    setIsLoading(false);
  };

  const openCamera = useCamera("images", handleAddImages, handleOnCancel);
  const handleOpenCamera = () => {
    openCamera();
    setIsLoading(true);
  };

  const openImageLibrary = useMediaLibrary(
    "images",
    handleAddImages,
    handleOnCancel,
  );
  const handleOpenImageLibrary = () => {
    openImageLibrary();
    setIsLoading(true);
  };

  const hasImages = imagesUri.length > 0;

  const handleOnDeletePress = (index: number) => {
    const newImagesUri = imagesUri.filter((_, i) => i !== index);

    if (onImageDelete) {
      onImageDelete(imagesUri[index]);
    }

    onImagesChange(newImagesUri);
  };

  const handleMoveLeftPress = (index: number) => {
    const newImagesUri = [...imagesUri];
    const [removedImageUri] = newImagesUri.splice(index, 1);
    newImagesUri.splice(index - 1, 0, removedImageUri);
    onImagesChange(newImagesUri);
  };

  const handleMoveRightPress = (index: number) => {
    const newImagesUri = [...imagesUri];
    const [removedImageUri] = newImagesUri.splice(index, 1);
    newImagesUri.splice(index + 1, 0, removedImageUri);
    onImagesChange(newImagesUri);
  };

  return (
    <View {...viewProps}>
      {!hasImages ? (
        <>
          {isLoading && (
            <View style={styles.loadingIndicatorWrapper}>
              <ActivityIndicator size="large" />
            </View>
          )}
          <View style={styles.imageSourceWrapper}>
            <Button
              mode="elevated"
              icon="camera"
              onPress={handleOpenCamera}
              style={styles.buttonLeft}
              loading={isLoading}
              disabled={isLoading}
            >
              Take a photo
            </Button>
            <Button
              mode="elevated"
              icon="folder-multiple-image"
              onPress={handleOpenImageLibrary}
              style={styles.buttonRight}
              loading={isLoading}
              disabled={isLoading}
            >
              From gallery
            </Button>
          </View>
        </>
      ) : (
        <EditableImageGallery
          imagesUri={imagesUri}
          optionsCallbacks={{
            onDeletePress: handleOnDeletePress,
            onMoveLeftPress: handleMoveLeftPress,
            onMoveRightPress: handleMoveRightPress,
          }}
          addButtons={[
            {
              leadingIcon: "camera",
              title: "Take a photo",
              onPress: handleOpenCamera,
            },
            {
              leadingIcon: "folder-multiple-image",
              title: "From gallery",
              onPress: handleOpenImageLibrary,
            },
          ]}
          addButtonsLoading={isLoading}
        />
      )}
    </View>
  );
};

export default ImagesSection;

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
  buttonLeft: {
    flex: 1,
    marginRight: spacing.spaceExtraSmall,
  },
  buttonRight: {
    flex: 1,
    marginLeft: spacing.spaceExtraSmall,
  },
});
