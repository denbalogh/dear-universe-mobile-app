import React from "react";
import FeelingsButton, { FeelingsButtonProps } from "./FeelingsButton";
import { IconButton, MenuItemProps } from "react-native-paper";
import { View } from "react-native";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { StyleSheet } from "react-native";
import { spacing } from "@/constants/theme";

type Props = {
  feelingsButtonProps: FeelingsButtonProps;
  onDeleteEntryPress: () => void;
  moveMenuItems: MenuItemProps[];
  editMenuItems: MenuItemProps[];
  locked?: boolean;
};

const BottomBar = ({
  feelingsButtonProps,
  onDeleteEntryPress,
  moveMenuItems,
  editMenuItems,
  locked = false,
}: Props) => {
  const theme = useCustomTheme();

  const hasMoveMenuItems = moveMenuItems.length > 0;
  const hasEditMenuItems = editMenuItems.length > 0;

  if (locked && feelingsButtonProps.feelingsGroupName === "") {
    return null;
  }

  return (
    <View style={styles.actionBarWrapper}>
      <FeelingsButton {...feelingsButtonProps} locked={locked} />
      {!locked && (
        <View style={styles.actionBarMenusWrapper}>
          <IconButton
            icon="delete"
            onPress={onDeleteEntryPress}
            iconColor={theme.colors.error}
          />
          {hasMoveMenuItems && (
            <IconButtonMenu
              menuItems={moveMenuItems}
              iconButtonProps={{ icon: "arrow-up-down" }}
            />
          )}
          {hasEditMenuItems && (
            <IconButtonMenu
              menuItems={editMenuItems}
              iconButtonProps={{ icon: "plus-minus" }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  actionBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.spaceExtraSmall,
  },
  actionBarMenusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.spaceSmall,
  },
});
