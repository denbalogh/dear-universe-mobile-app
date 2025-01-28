import React, { useMemo } from "react";
import {
  ActivityIndicator,
  IconButton,
  MenuItemProps,
  useTheme,
} from "react-native-paper";
import { StyleSheet, View, ViewProps } from "react-native";
import { sizing } from "@/constants/theme";
import { getBorderRadius } from "./utils";
import CustomMenu from "../CustomMenu/CustomMenu";

export type ImageGridAddItemProps = {
  imagesCount: number;
  gridSize: number;
  addButtons: MenuItemProps[];
  loading?: boolean;
  disabled?: boolean;
} & ViewProps;

const ImageGridAddItem = ({
  imagesCount,
  gridSize,
  style,
  addButtons,
  loading = false,
  disabled = false,
  ...props
}: ImageGridAddItemProps) => {
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
        <CustomMenu menuItems={addButtons}>
          {({ openMenu }) => (
            <IconButton
              icon="plus"
              size={sizing.sizeLarge}
              disabled={disabled}
              onPress={openMenu}
            />
          )}
        </CustomMenu>
      )}
    </View>
  );
};

export default ImageGridAddItem;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
