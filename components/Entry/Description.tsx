import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

type Props = {
  description?: string;
  onPress: () => void;
  locked: boolean;
};

const Description = ({ description, onPress, locked }: Props) => {
  if (!description) {
    return null;
  }

  if (locked) {
    return (
      <View style={styles.wrapper}>
        <Text variant="bodyMedium">{description}</Text>
      </View>
    );
  }

  return (
    <TouchableRipple
      onPress={onPress}
      style={styles.wrapper}
      accessibilityLabel="Edit description"
    >
      <Text variant="bodyMedium">{description}</Text>
    </TouchableRipple>
  );
};

export default Description;

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
});
