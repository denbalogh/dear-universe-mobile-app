import { spacing } from "@/constants/theme";
import useCamera from "@/hooks/useCamera";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import EditableImageGallery from "../MediaGallery/EditableImageGallery";
import SelectableButtons from "./SelectableButtons";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

type Props = {
  imagesUri: string[];
  onImagesChange: (imagesUri: string[]) => void;
  initialSelectedIndex?: string;
} & ViewProps;

const ImagesSection = ({
  imagesUri,
  onImagesChange,
  initialSelectedIndex,
  ...viewProps
}: Props) => {
  const { showConfirmDialog } = useConfirmDialog();
  const [isLoading, setIsLoading] = useState(false);

  const initalSelectable = !!initialSelectedIndex;
  const initialSelectedImages = initialSelectedIndex
    ? [parseInt(initialSelectedIndex)]
    : [];

  const [isSelectable, setIsSelectable] = useState(initalSelectable);
  const [selectedImages, setSelectedImages] = useState<number[]>(
    initialSelectedImages,
  );

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

  const handleMoveLeftPress = (index: number) => {
    const newImagesUri = [...imagesUri];
    const [removedImageUri] = newImagesUri.splice(index, 1);
    newImagesUri.splice(index - 1, 0, removedImageUri);
    onImagesChange(newImagesUri);
  };

  const handleMoveToStartPress = (index: number) => {
    const newImagesUri = [...imagesUri];
    const [removedImageUri] = newImagesUri.splice(index, 1);
    newImagesUri.unshift(removedImageUri);
    onImagesChange(newImagesUri);
  };

  const handleMoveRightPress = (index: number) => {
    const newImagesUri = [...imagesUri];
    const [removedImageUri] = newImagesUri.splice(index, 1);
    newImagesUri.splice(index + 1, 0, removedImageUri);
    onImagesChange(newImagesUri);
  };

  const handleMoveToEndPress = (index: number) => {
    const newImagesUri = [...imagesUri];
    const [removedImageUri] = newImagesUri.splice(index, 1);
    newImagesUri.push(removedImageUri);
    onImagesChange(newImagesUri);
  };

  const handleOnImageLongPress = (index: number) => {
    setIsSelectable(true);
    setSelectedImages([index]);
  };

  const handleSelectAll = () => {
    setSelectedImages([...Array(imagesUri.length).keys()]);
  };

  const handleCancelSelection = () => {
    setIsSelectable(false);
    setSelectedImages([]);
  };

  const handleOnSelectedDelete = () => {
    showConfirmDialog("Do you wish to delete the selected images?", () => {
      const newImagesUri = imagesUri.filter(
        (_, index) => !selectedImages.includes(index),
      );

      onImagesChange(newImagesUri);
      setSelectedImages([]);
      setIsSelectable(false);
    });
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
        <>
          {!isSelectable && (
            <Text variant="labelMedium" style={styles.selectionInfoText}>
              Long press image to enable selection
            </Text>
          )}
          <EditableImageGallery
            imagesUri={imagesUri}
            onMoveLeftPress={handleMoveLeftPress}
            onMoveToStartPress={handleMoveToStartPress}
            onMoveRightPress={handleMoveRightPress}
            onMoveToEndPress={handleMoveToEndPress}
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
            onImageLongPress={handleOnImageLongPress}
            selectable={
              isSelectable
                ? {
                    selected: selectedImages,
                    onSelectedChange: setSelectedImages,
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
  selectionInfoText: {
    marginBottom: spacing.spaceSmall,
  },
});
