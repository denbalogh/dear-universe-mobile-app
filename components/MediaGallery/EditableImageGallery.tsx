import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import ImageGridItem from "./ImageGridItem";
import { Checkbox, MenuItemProps } from "react-native-paper";
import AddImageGridItem from "./ImageGridAddItem";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import GalleryPreview from "./GalleryPreview";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { roundness, sizing, spacing } from "@/constants/theme";

type Props = {
  imagesUri: string[];
  gridSize?: number;
  addButtons: MenuItemProps[];
  addButtonsLoading?: boolean;
  onMoveLeftPress: (index: number) => void;
  onMoveToStartPress: (index: number) => void;
  onMoveRightPress: (index: number) => void;
  onMoveToEndPress: (index: number) => void;
  onImageLongPress: (uri: string) => void;
  selectedImagesUri: string[];
  onSelectedImagesUriChange: (selectedUri: string[]) => void;
} & ViewProps;

const EditableImageGallery = ({
  imagesUri,
  gridSize = 3,
  style,
  addButtons,
  addButtonsLoading = false,
  onMoveLeftPress,
  onMoveToStartPress,
  onMoveRightPress,
  onMoveToEndPress,
  onImageLongPress,
  selectedImagesUri,
  onSelectedImagesUriChange,
  ...props
}: Props) => {
  const theme = useCustomTheme();

  const [gridWidth, setGridWidth] = useState(0);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const onImagePress = async (index: number) => {
    await lockAsync(OrientationLock.ALL);
    setInitialIndex(index);
    setIsGalleryVisible(true);
  };

  const handleGalleryPreviewClose = async () => {
    await lockAsync(OrientationLock.PORTRAIT);
    setIsGalleryVisible(false);
  };

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setGridWidth(width);
  };

  const imageSize = Math.floor((gridWidth / gridSize) * 1000) / 1000; // Floor to 3 decimal places, because it was wrapping incorrectly
  const imagesCount = addButtons ? imagesUri.length + 1 : imagesUri.length;

  const handleOnSelect = (uri: string) => {
    const isSelected = selectedImagesUri.includes(uri);
    onSelectedImagesUriChange(
      isSelected
        ? selectedImagesUri.filter((item) => item !== uri)
        : [...selectedImagesUri, uri],
    );
  };

  return (
    <>
      <View
        {...props}
        style={[style, styles.wrapper]}
        onLayout={handleOnLayout}
      >
        {imagesUri.map((uri, index) => {
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

          if (index < imagesUri.length - 1) {
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

          const isSelected = selectedImagesUri.includes(uri);

          return (
            <View key={`${uri}-${index}`}>
              <ImageGridItem
                source={{ uri }}
                index={index}
                imagesCount={imagesCount}
                gridSize={gridSize}
                style={{ width: imageSize, height: imageSize }}
                touchableProps={{
                  onPress: () => onImagePress(index),
                  onLongPress: () => onImageLongPress(uri),
                }}
              />
              <View
                style={[
                  styles.select,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <Checkbox
                  status={isSelected ? "checked" : "unchecked"}
                  onPress={() => handleOnSelect(uri)}
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
          imagesCount={imagesCount}
          gridSize={gridSize}
          addButtons={addButtons}
          style={{ width: imageSize, height: imageSize }}
          loading={addButtonsLoading}
        />
      </View>
      <GalleryPreview
        imagesUri={imagesUri}
        initialIndex={initialIndex}
        isVisible={isGalleryVisible}
        onClose={handleGalleryPreviewClose}
      />
    </>
  );
};

export default EditableImageGallery;

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
