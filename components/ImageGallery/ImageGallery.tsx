import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ImageURISource,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { ImageProps } from "expo-image";
import { CustomImageProps } from "../CustomImage/CustomImage";
import GalleryPreview, {
  GalleryOverlayProps,
} from "react-native-gallery-preview";
import { IconButton, Text, useTheme } from "react-native-paper";
import { roundness, spacing } from "@/constants/theme";
import ImageGalleryItem from "./ImageGalleryItem";

type Props = {
  images: ImageProps[];
  checkbox?: CustomImageProps["checkbox"]; // For testing purposes
} & ViewProps;

const ImageGallery = ({ images, style, checkbox, ...props }: Props) => {
  const theme = useTheme();
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  // Temporary solution for local images
  const parsedImages = images.map((image) => ({
    uri: Image.resolveAssetSource(image.source as ImageSourcePropType)?.uri,
  })) as ImageURISource[];

  const onImagePress = (index: number) => {
    setInitialIndex(index);
    setIsGalleryVisible(true);
  };

  return (
    <View style={[styles.wrapper, style]} {...props}>
      {images.map((image, index) => (
        <ImageGalleryItem
          key={index}
          imageProps={image}
          index={index}
          imagesCount={images.length}
          touchableProps={{ onPress: () => onImagePress(index) }}
          checkbox={checkbox}
        />
      ))}
      <GalleryPreview
        isVisible={isGalleryVisible}
        onRequestClose={() => setIsGalleryVisible(false)}
        images={parsedImages}
        initialIndex={initialIndex}
        backgroundColor={theme.colors.background}
        OverlayComponent={(props: GalleryOverlayProps) => (
          <>
            <IconButton
              icon="close"
              onPress={props.onClose}
              style={styles.closeButton}
              mode="contained"
              accessibilityLabel="Close gallery"
            />
            <Text
              variant="bodyLarge"
              style={[
                styles.imagePosition,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  color: theme.colors.onSurfaceVariant,
                },
              ]}
            >{`${props.currentImageIndex + 1}/${props.imagesLength}`}</Text>
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
    flexDirection: "row",
    flexWrap: "wrap",
  },
  closeButton: {
    position: "absolute",
    top: spacing.spaceMedium,
    left: spacing.spaceMedium,
  },
  imagePosition: {
    position: "absolute",
    bottom: spacing.spaceMedium,
    right: spacing.spaceMedium,
    padding: spacing.spaceSmall,
    borderRadius: roundness,
  },
});
