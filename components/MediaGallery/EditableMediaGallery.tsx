import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import { MenuItemProps } from "react-native-paper";
import AddImageGridItem from "./EditableMediaGalleryAddItem";
import MediaGalleryPreview from "./MediaGalleryPreview/MediaGalleryPreview";
import { DndProvider, DndProviderProps } from "@mgcrea/react-native-dnd";
import EditableMediaGalleryItem from "./EditableMediaGalleryItem";
import { runOnJS } from "react-native-reanimated";

export type Media = {
  imageUri: string;
  videoUri?: string;
};

type Props = {
  media: Media[];
  onOrderChange: (fromId: string, toId: string) => void;
  gridSize?: number;
  addButtons: MenuItemProps[];
  addButtonsLoading?: boolean;
  selectedMediaImagesUri: string[];
  onSelectedMediaImagesUriChange: (selectedUri: string[]) => void;
} & ViewProps;

const EditableMediaGallery = ({
  media,
  onOrderChange,
  gridSize = 3,
  style,
  addButtons,
  addButtonsLoading = false,
  selectedMediaImagesUri,
  onSelectedMediaImagesUriChange,
  ...props
}: Props) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [gridWidth, setGridWidth] = useState(0);

  const handleOnImagePress = (index: number) => {
    setInitialIndex(index);
    setIsPreviewVisible(true);
  };

  const handleOnPreviewClose = () => {
    setIsPreviewVisible(false);
  };

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setGridWidth(width);
  };

  const imageSize = gridWidth / gridSize - 0.001; // to prevent incorrent wrapping
  const itemCountPlusAddButton = media.length + 1;

  const handleOnSelect = (imageUri: string) => {
    const isSelected = selectedMediaImagesUri.includes(imageUri);
    onSelectedMediaImagesUriChange(
      isSelected
        ? selectedMediaImagesUri.filter((item) => item !== imageUri)
        : [...selectedMediaImagesUri, imageUri],
    );
  };

  const handleOnDragEnd: DndProviderProps["onDragEnd"] = ({ active, over }) => {
    "worklet";
    if (over) {
      const activeId = active.id as string;
      const overId = over.id as string;
      runOnJS(onOrderChange)(activeId, overId);
    }
  };

  const mediaConcatKey = useMemo(
    () => media.map(({ imageUri }) => imageUri).join(""),
    [media],
  );

  return (
    <>
      <DndProvider
        key={mediaConcatKey} // When media reorders or changes, we need to reset the DND state, because it was not updating correctly
        activationDelay={500}
        onDragEnd={handleOnDragEnd}
      >
        <View
          {...props}
          style={[style, styles.wrapper]}
          onLayout={handleOnLayout}
        >
          {media.map(({ imageUri, videoUri }, index) => {
            const isSelected = selectedMediaImagesUri.includes(imageUri);

            return (
              <EditableMediaGalleryItem
                key={imageUri}
                item={{ imageUri, videoUri }}
                index={index}
                imagesCount={itemCountPlusAddButton}
                gridSize={gridSize}
                style={{ width: imageSize, height: imageSize }}
                isSelected={isSelected}
                onSelect={handleOnSelect}
                touchableProps={{
                  onPress: () => handleOnImagePress(index),
                }}
              />
            );
          })}
          <AddImageGridItem
            imagesCount={itemCountPlusAddButton}
            gridSize={gridSize}
            addButtons={addButtons}
            style={{ width: imageSize, height: imageSize }}
            loading={addButtonsLoading}
          />
        </View>
      </DndProvider>
      <MediaGalleryPreview
        media={media}
        isVisible={isPreviewVisible}
        initialIndex={initialIndex}
        onClose={handleOnPreviewClose}
      />
    </>
  );
};

export default EditableMediaGallery;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
