import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import GalleryPreview, {
  GalleryOverlayProps,
} from "react-native-gallery-preview";
import { IconButton, Text, useTheme } from "react-native-paper";
import { roundness, sizing, spacing } from "@/constants/theme";
import ImageGalleryItem from "./ImageGalleryItem";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import AddGalleryItem from "./AddGalleryItem";

type Props = {
  imagesURI: string[];
  cols?: number;
  optionsCallbacks?: {
    onDeletePress: (index: number) => void;
    onMoveLeftPress: (index: number) => void;
    onMoveRightPress: (index: number) => void;
  };
  addButtons?: {
    onCameraPress: () => void;
    onImageLibraryPress: () => void;
  };
} & ViewProps;

const ImageGallery = ({
  imagesURI,
  cols = 3,
  optionsCallbacks,
  addButtons,
  style,
  ...props
}: Props) => {
  const theme = useTheme();

  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [galleryWidth, setGalleryWidth] = useState(0);

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setGalleryWidth(width);
  };

  const onImagePress = (index: number) => {
    setInitialIndex(index);
    setIsGalleryVisible(true);
  };

  const imagesForGallery = imagesURI.map((uri) => ({
    uri,
  }));

  const imageSize = galleryWidth / cols;

  const imagesCount = addButtons ? imagesURI.length + 1 : imagesURI.length;

  return (
    <View onLayout={handleOnLayout} style={[styles.wrapper, style]} {...props}>
      <View style={styles.imagesWrapper}>
        {imagesURI.map((uri, index) => {
          const menuItems = [];

          if (optionsCallbacks && index > 0) {
            menuItems.push({
              leadingIcon: "arrow-left",
              onPress: () => optionsCallbacks.onMoveLeftPress(index),
              title: "Move left",
            });
          }

          if (optionsCallbacks && index < imagesURI.length - 1) {
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
            });
          }

          return (
            <View key={index}>
              <ImageGalleryItem
                source={{ uri }}
                index={index}
                imagesCount={imagesCount}
                cols={cols}
                style={{ width: imageSize, height: imageSize }}
                touchableProps={{ onPress: () => onImagePress(index) }}
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
        {addButtons && (
          <AddGalleryItem
            imagesCount={imagesCount}
            cols={cols}
            style={{ width: imageSize, height: imageSize }}
            onCameraPress={addButtons.onCameraPress}
            onImageLibraryPress={addButtons.onImageLibraryPress}
          />
        )}
      </View>
      <GalleryPreview
        isVisible={isGalleryVisible}
        onRequestClose={() => setIsGalleryVisible(false)}
        images={imagesForGallery}
        initialIndex={initialIndex}
        backgroundColor={theme.colors.surfaceVariant}
        OverlayComponent={({
          currentImageIndex,
          imagesLength,
          onClose,
        }: GalleryOverlayProps) => (
          <>
            <IconButton
              icon="close"
              onPress={onClose}
              style={styles.closeButton}
              mode="contained-tonal"
              accessibilityLabel="Close gallery"
            />
            <View style={styles.imagePositionWrapper}>
              <Text
                variant="bodyLarge"
                style={[
                  styles.imagePosition,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >{`${currentImageIndex + 1}/${imagesLength}`}</Text>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default ImageGallery;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  imagesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttons: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  closeButton: {
    position: "absolute",
    top: spacing.spaceSmall,
    left: spacing.spaceSmall,
  },
  imagePositionWrapper: {
    position: "absolute",
    bottom: spacing.spaceSmall,
    right: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePosition: {
    padding: spacing.spaceSmall,
    borderRadius: roundness,
  },
});
