import React from "react";
import { Mood } from "../MoodColor/types";
import { Button, TouchableRipple } from "react-native-paper";
import MoodColorComposite from "../MoodColor/MoodColorComposite";
import { StyleSheet } from "react-native";
import { spacing } from "@/constants/theme";

type Props = {
  moods: Mood[];
  onPress: () => void;
};

const PickMoodsButton = ({ moods, onPress }: Props) => {
  const hasMoods = moods.length > 0;

  if (hasMoods) {
    return (
      <TouchableRipple
        onPress={onPress}
        style={styles.moodsWrapper}
        accessibilityLabel="Change moods"
      >
        <MoodColorComposite
          accessibilityLabel="Picked moods"
          moods={moods}
          variant="horizontal"
        />
      </TouchableRipple>
    );
  }

  return (
    <Button onPress={onPress} mode="contained" style={styles.button}>
      Pick moods
    </Button>
  );
};

export default PickMoodsButton;

const styles = StyleSheet.create({
  moodsWrapper: {
    padding: spacing.spaceSmall,
    justifyContent: "center",
  },
  button: {
    margin: spacing.spaceSmall,
  },
});
