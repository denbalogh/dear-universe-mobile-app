import React from "react";
import { StyleSheet, View } from "react-native";
import {
  default as GalleryPreviewOriginal,
  GalleryOverlayProps,
} from "react-native-gallery-preview";
import { Appbar } from "react-native-paper";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { StatusBar } from "expo-status-bar";

type Props = {
  imagesUri: string[];
  initialIndex: number;
  isVisible: boolean;
  onClose: () => void;
};

const GalleryPreview = ({
  imagesUri,
  initialIndex,
  isVisible,
  onClose,
}: Props) => {
  const theme = useCustomTheme();
  const imagesForGallery = imagesUri.map((uri) => ({
    uri,
  }));

  return (
    <GalleryPreviewOriginal
      isVisible={isVisible}
      onRequestClose={onClose}
      images={imagesForGallery}
      initialIndex={initialIndex}
      backgroundColor="black"
      OverlayComponent={({
        currentImageIndex,
        imagesLength,
        onClose,
        isFocused,
      }: GalleryOverlayProps) =>
        isFocused && (
          <View style={styles.appBar}>
            <StatusBar backgroundColor={theme.colors.surface} />
            <Appbar.Header
              style={{ backgroundColor: theme.colors.surface }}
              statusBarHeight={0}
              mode="center-aligned"
            >
              <Appbar.BackAction onPress={onClose} />
              <Appbar.Content
                title={`${currentImageIndex + 1} of ${imagesLength}`}
              />
            </Appbar.Header>
          </View>
        )
      }
    />
  );
};

export default GalleryPreview;

const styles = StyleSheet.create({
  appBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
});
