import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import ImageGridItem from "./ImageGridItem";
import { Checkbox, MenuItemProps } from "react-native-paper";
import AddImageGridItem from "./ImageGridAddItem";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { roundness, sizing, spacing } from "@/constants/theme";
import MediaGalleryPreview from "./MediaGalleryPreview/MediaGalleryPreview";

export type Media = {
  imageUri: string;
  videoUri?: string;
};

type Props = {
  media: Media[];
  gridSize?: number;
  addButtons: MenuItemProps[];
  addButtonsLoading?: boolean;
  onMoveLeftPress: (index: number) => void;
  onMoveToStartPress: (index: number) => void;
  onMoveRightPress: (index: number) => void;
  onMoveToEndPress: (index: number) => void;
  onMediaLongPress: (imageUri: string) => void;
  selectedMediaImagesUri: string[];
  onSelectedMediaImagesUriChange: (selectedUri: string[]) => void;
} & ViewProps;

const EditableMediaGallery = ({
  media,
  gridSize = 3,
  style,
  addButtons,
  addButtonsLoading = false,
  onMoveLeftPress,
  onMoveToStartPress,
  onMoveRightPress,
  onMoveToEndPress,
  onMediaLongPress,
  selectedMediaImagesUri,
  onSelectedMediaImagesUriChange,
  ...props
}: Props) => {
  const theme = useCustomTheme();

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

  const imageSize = Math.floor((gridWidth / gridSize) * 1000) / 1000; // Floor to 3 decimal places, because it was wrapping incorrectly
  const itemCountPlusAddButton = media.length + 1;

  const handleOnSelect = (imageUri: string) => {
    const isSelected = selectedMediaImagesUri.includes(imageUri);
    onSelectedMediaImagesUriChange(
      isSelected
        ? selectedMediaImagesUri.filter((item) => item !== imageUri)
        : [...selectedMediaImagesUri, imageUri],
    );
  };

  return (
    <>
      <View
        {...props}
        style={[style, styles.wrapper]}
        onLayout={handleOnLayout}
      >
        {media.map(({ imageUri, videoUri }, index) => {
          const menuItems = [];

          if (index > 0) {
            menuItems.push({
              leadingIcon: "arrow-collapse-left",
              onPress: () => onMoveToStartPress(index),
              title: "To start",
            });
            menuItems.push({
              leadingIcon: "arrow-left",
              onPress: () => onMoveLeftPress(index),
              title: "Left",
            });
          }

          if (index < media.length - 1) {
            menuItems.push({
              leadingIcon: "arrow-right",
              onPress: () => onMoveRightPress(index),
              title: "Right",
            });
            menuItems.push({
              leadingIcon: "arrow-collapse-right",
              onPress: () => onMoveToEndPress(index),
              title: "To end",
            });
          }

          const isSelected = selectedMediaImagesUri.includes(imageUri);

          return (
            <View key={`${imageUri}-${index}`}>
              <ImageGridItem
                source={{ uri: imageUri }}
                index={index}
                imagesCount={itemCountPlusAddButton}
                gridSize={gridSize}
                style={{ width: imageSize, height: imageSize }}
                touchableProps={{
                  onPress: () => handleOnImagePress(index),
                  onLongPress: () => onMediaLongPress(imageUri),
                }}
                showPlayIcon={!!videoUri}
                playIconPosition="bottomLeft"
              />
              <View
                style={[
                  styles.select,
                  { backgroundColor: `${theme.colors.background}96` },
                ]}
              >
                <Checkbox
                  status={isSelected ? "checked" : "unchecked"}
                  onPress={() => handleOnSelect(imageUri)}
                  color={theme.colors.onBackground}
                />
              </View>
              <View style={styles.buttons}>
                <IconButtonMenu
                  iconButtonProps={{
                    icon: "arrow-left-right",
                    mode: "contained-tonal",
                    size: sizing.sizeSmall,
                  }}
                  menuItems={menuItems}
                />
              </View>
            </View>
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
  buttons: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  select: {
    position: "absolute",
    top: spacing.spaceSmall,
    left: spacing.spaceSmall,
    borderRadius: roundness,
  },
});
