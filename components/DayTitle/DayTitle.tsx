import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";

type Props = {
  title: string;
  onTitleChange: (title: string) => void;
  isTitleEdited: boolean;
  onSubmit: () => void;
  locked: boolean;
};

const DayTitle = ({
  title,
  onTitleChange,
  isTitleEdited,
  onSubmit,
  locked,
}: Props) => {
  const theme = useCustomTheme();

  const editedUnderlineColor = isTitleEdited
    ? theme.colors.tertiary
    : undefined;

  if (locked && !title) {
    return <View style={styles.noTitleLocked} />;
  }

  if (locked) {
    return (
      <View style={styles.wrapperLocked}>
        <Text variant="labelLarge">Title for the day:</Text>
        <Text variant="headlineSmall" style={styles.lockedTitle}>
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TextInput
        label="Title for the day"
        value={title}
        onChangeText={onTitleChange}
        multiline={true}
        enterKeyHint="done"
        submitBehavior="blurAndSubmit"
        contentStyle={{ marginTop: 5 }}
        mode="outlined"
        onSubmitEditing={onSubmit}
        outlineColor={editedUnderlineColor}
        activeOutlineColor={editedUnderlineColor}
        style={{ backgroundColor: theme.colors.surface }}
      />
      {isTitleEdited && (
        <HelperText type="info" visible={true}>
          To save the title, press done on the keyboard.
        </HelperText>
      )}
    </View>
  );
};

export default DayTitle;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.spaceSmall,
  },
  wrapperLocked: {
    marginBottom: spacing.spaceMedium,
  },
  lockedTitle: {
    marginTop: spacing.spaceExtraSmall,
  },
  noTitleLocked: {
    height: spacing.spaceSmall,
  },
});
