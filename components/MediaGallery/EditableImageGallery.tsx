import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import ImageGridItem from "./ImageGridItem";
import { MenuItemProps } from "react-native-paper";
import AddImageGridItem from "./ImageGridAddItem";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import GalleryPreview from "./GalleryPreview";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { sizing } from "@/constants/theme";

type Props = {
  imagesUri: string[];
  gridSize?: number;
  addButtons: MenuItemProps[];
  addButtonsLoading?: boolean;
  optionsCallbacks?: {
    onDeletePress: (index: number) => void;
    onMoveLeftPress: (index: number) => void;
    onMoveRightPress: (index: number) => void;
  };
} & ViewProps;

const EditableImageGallery = ({
  imagesUri,
  gridSize = 3,
  style,
  addButtons,
  addButtonsLoading = false,
  optionsCallbacks,
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

  return (
    <>
      <View
        {...props}
        style={[style, styles.wrapper]}
        onLayout={handleOnLayout}
      >
        {imagesUri.map((item, index) => {
          const menuItems = [];

          if (optionsCallbacks && index > 0) {
            menuItems.push({
              leadingIcon: "arrow-left",
              onPress: () => optionsCallbacks.onMoveLeftPress(index),
              title: "Move left",
            });
          }

          if (optionsCallbacks && index < imagesUri.length - 1) {
            menuItems.push({
              leadingIcon: "arrow-right",
              onPress: () => optionsCallbacks.onMoveRightPress(index),
              title: "Move right",
            });
          }

          if (optionsCallbacks) {
            menuItems.push({
              leadingIcon: "delete",
              onPress: () => optionsCallbacks.onDeletePress(index),
              title: "Delete",
              titleStyle: { color: theme.colors.error },
            });
          }

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
                }}
              />
              {optionsCallbacks && (
                <View style={styles.buttons}>
                  <IconButtonMenu
                    iconButtonProps={{
                      icon: "dots-vertical",
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
});
