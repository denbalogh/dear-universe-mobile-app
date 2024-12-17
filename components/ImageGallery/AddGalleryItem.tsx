import React, { useMemo } from "react";
import getBorderRadius from "./getBorderRadius";
import { useTheme } from "react-native-paper";
import { StyleSheet, View, ViewProps } from "react-native";
import { sizing } from "@/constants/theme";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";

type Props = {
  imagesCount: number;
  cols: number;
  onCameraPress: () => void;
  onImageLibraryPress: () => void;
} & ViewProps;

const AddGalleryItem = ({
  imagesCount,
  cols,
  style,
  onCameraPress,
  onImageLibraryPress,
  ...props
}: Props) => {
  const theme = useTheme();

  const borderRadii = useMemo(
    () => getBorderRadius(imagesCount - 1, imagesCount, cols),
    [imagesCount, cols],
  );

  return (
    <View
      style={[
        style,
        styles.wrapper,
        { ...borderRadii, backgroundColor: theme.colors.surfaceVariant },
      ]}
      {...props}
    >
      <IconButtonMenu
        iconButtonProps={{ icon: "plus", size: sizing.sizeLarge }}
        menuItems={[
          {
            title: "Take a photo",
            onPress: onCameraPress,
            leadingIcon: "camera",
          },
          {
            title: "From gallery",
            onPress: onImageLibraryPress,
            leadingIcon: "folder-multiple-image",
          },
        ]}
      />
    </View>
  );
};

export default AddGalleryItem;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
