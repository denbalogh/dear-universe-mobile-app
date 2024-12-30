import React, { useMemo } from "react";
import { MenuItemProps, useTheme } from "react-native-paper";
import { StyleSheet, View, ViewProps } from "react-native";
import { sizing } from "@/constants/theme";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import { getBorderRadius } from "./utils";

type Props = {
  imagesCount: number;
  gridSize: number;
  addButtons: MenuItemProps[];
} & ViewProps;

const AddImageGridItem = ({
  imagesCount,
  gridSize,
  style,
  addButtons,
  ...props
}: Props) => {
  const theme = useTheme();

  const borderRadii = useMemo(
    () => getBorderRadius(imagesCount - 1, imagesCount, gridSize),
    [imagesCount, gridSize],
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
        menuItems={addButtons}
      />
    </View>
  );
};

export default AddImageGridItem;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
