import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

type Props = {
  title: string;
  onPress: () => void;
  locked: boolean;
};

const Title = ({ title, onPress, locked }: Props) => {
  if (locked) {
    return (
      <View style={styles.wrapper}>
        <Text variant="titleLarge">{title}</Text>
      </View>
    );
  }

  return (
    <TouchableRipple
      onPress={onPress}
      style={styles.wrapper}
      accessibilityLabel="Edit title"
    >
      <Text variant="titleLarge">{title}</Text>
    </TouchableRipple>
  );
};

export default Title;

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
});
