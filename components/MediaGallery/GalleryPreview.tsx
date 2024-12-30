import React from "react";
import { StyleSheet, View } from "react-native";
import {
  default as GalleryPreviewOriginal,
  GalleryOverlayProps,
} from "react-native-gallery-preview";
import { IconButton, Text } from "react-native-paper";
import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";

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
  );
};

export default GalleryPreview;

const styles = StyleSheet.create({
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
