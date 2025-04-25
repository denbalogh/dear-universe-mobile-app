import React, { memo, useMemo } from "react";
import { ActivityIndicator, IconButton, useTheme } from "react-native-paper";
import { StyleSheet, View, ViewProps } from "react-native";
import { sizing } from "@/constants/theme";
import { getBorderRadius } from "../../EntriesList/MediaGallery/utils";

export type EditableMediaGalleryAddItemProps = {
  imagesCount: number;
  gridSize: number;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
} & ViewProps;

const EditableMediaGalleryAddItem = ({
  imagesCount,
  gridSize,
  onPress,
  style,
  loading = false,
  disabled = false,
  ...props
}: EditableMediaGalleryAddItemProps) => {
  const theme = useTheme();

  const borderRadii = useMemo(() => {
    const lastItemIndex = imagesCount - 1;
    return getBorderRadius(lastItemIndex, imagesCount, gridSize);
  }, [imagesCount, gridSize]);

  return (
    <View
      style={[
        style,
        styles.wrapper,
        { ...borderRadii, backgroundColor: theme.colors.surfaceVariant },
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <IconButton
          icon="plus"
          size={sizing.sizeLarge}
          disabled={disabled}
          onPress={onPress}
        />
      )}
    </View>
  );
};

export default memo(EditableMediaGalleryAddItem);

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
