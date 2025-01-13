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
  onImageLongPress: (index: number) => void;
  selectable?: {
    selected: number[];
    onSelectedChange: (selected: number[]) => void;
  };
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
  selectable,
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

  const handleOnSelect = (index: number) => {
    if (selectable) {
      const { selected, onSelectedChange } = selectable;
      const isSelected = selected.includes(index);
      onSelectedChange(
        isSelected
          ? selected.filter((item) => item !== index)
          : [...selected, index],
      );
    }
  };

  return (
    <>
      <View
        {...props}
        style={[style, styles.wrapper]}
        onLayout={handleOnLayout}
      >
        {imagesUri.map((item, index) => {
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

          const isSelected = selectable?.selected.includes(index);

          return (
            <View key={`${item}-${index}`}>
              <ImageGridItem
                source={{ uri: item }}
                index={index}
                imagesCount={imagesCount}
                gridSize={gridSize}
                style={{ width: imageSize, height: imageSize }}
                touchableProps={{
                  onPress: () => onImagePress(index),
                  onLongPress: () => onImageLongPress(index),
                }}
              />
              {selectable ? (
                <View
                  style={[
                    styles.select,
                    { backgroundColor: theme.colors.background },
                  ]}
                >
                  <Checkbox
                    status={isSelected ? "checked" : "unchecked"}
                    onPress={() => handleOnSelect(index)}
                  />
                </View>
              ) : (
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
              )}
            </View>
          );
        })}
        <AddImageGridItem
          imagesCount={imagesCount}
          gridSize={gridSize}
          addButtons={addButtons}
          style={{ width: imageSize, height: imageSize }}
          loading={addButtonsLoading}
          disabled={!!selectable}
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
    bottom: spacing.spaceSmall,
    right: spacing.spaceSmall,
    borderRadius: roundness,
  },
});
