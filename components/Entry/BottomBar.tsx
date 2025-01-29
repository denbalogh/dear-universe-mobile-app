import React from "react";
import FeelingsButton, { FeelingsButtonProps } from "./FeelingsButton";
import { IconButton, MenuItemProps } from "react-native-paper";
import { View } from "react-native";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { StyleSheet } from "react-native";
import { spacing } from "@/constants/theme";
import CustomMenu from "../CustomMenu/CustomMenu";
import EmotionChip from "../EmotionChip/EmotionChip";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";

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

  const { feelingsGroupName, feelingsEmotions } = feelingsButtonProps;

  if (locked && feelingsGroupName === "") {
    return null;
  }

  if (locked) {
    const noEmotions = feelingsEmotions?.length === 0;

    return (
      <View style={styles.lockedEmotionsWrapper}>
        {noEmotions && (
          <EmotionChip
            emotion={feelingsGroupName}
            feelingsGroupName={feelingsGroupName as FEELING_GROUP_NAMES}
            style={styles.lockedEmotion}
            compact={true}
          />
        )}
        {feelingsEmotions?.map((emotion, index) => (
          <EmotionChip
            key={index}
            emotion={emotion}
            feelingsGroupName={feelingsGroupName as FEELING_GROUP_NAMES}
            style={styles.lockedEmotion}
            compact={true}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.actionBarWrapper}>
      <FeelingsButton {...feelingsButtonProps} />
      <View style={styles.actionBarMenusWrapper}>
        <IconButton
          icon="delete"
          onPress={onDeleteEntryPress}
          iconColor={theme.colors.error}
        />
        {hasMoveMenuItems && (
          <CustomMenu menuItems={moveMenuItems}>
            {({ openMenu }) => (
              <IconButton icon="arrow-up-down" onPress={openMenu} />
            )}
          </CustomMenu>
        )}
        {hasEditMenuItems && (
          <CustomMenu menuItems={editMenuItems}>
            {({ openMenu }) => (
              <IconButton icon="plus-minus" onPress={openMenu} />
            )}
          </CustomMenu>
        )}
      </View>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  actionBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: spacing.spaceExtraSmall,
  },
  actionBarMenusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.spaceSmall,
  },
  lockedEmotionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: spacing.spaceExtraSmall,
  },
  lockedEmotion: {
    marginRight: spacing.spaceExtraSmall,
    marginBottom: spacing.spaceExtraSmall,
  },
});
