import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TouchableRipple, useTheme } from "react-native-paper";
import { useSortedMoods } from "../MoodColor/values";
import { Mood } from "../MoodColor/types";
import MoodColorSimple from "../MoodColor/MoodColorSimple";
import { roundness, spacing } from "@/constants/theme";

type Props = {
  initialSelected: Mood[];
  onSubmit: (moods: Mood[]) => void;
  onDiscard: () => void;
};

const MoodSelector = ({ initialSelected, onSubmit, onDiscard }: Props) => {
  const theme = useTheme();
  const sortedMoods = useSortedMoods();

  const [selectedMoods, setSelectedMoods] = useState(initialSelected);

  const handleSelecMood = (mood: Mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(
        selectedMoods.filter((selectedMood) => selectedMood !== mood),
      );
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text variant="headlineLarge">Mood selector</Text>
      <Text style={styles.subtitle}>
        What emotional states were you experiencing?
      </Text>
      {sortedMoods.map((mood) => {
        const isSelected = selectedMoods.includes(mood);

        return (
          <TouchableRipple
            key={mood}
            onPress={() => handleSelecMood(mood)}
            style={[
              styles.moodWrapper,
              {
                backgroundColor: isSelected
                  ? theme.colors.secondaryContainer
                  : theme.colors.background,
              },
            ]}
            accessibilityLabel={`${isSelected ? "Unselect" : "Select"} ${mood}`}
          >
            <View style={[styles.moodContent]}>
              <MoodColorSimple mood={mood} style={styles.moodColor} />
              <Text
                variant="bodyLarge"
                style={{
                  color: isSelected
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onBackground,
                }}
              >
                {mood}
              </Text>
            </View>
          </TouchableRipple>
        );
      })}
      <View style={styles.buttonsWrapper}>
        <Button onPress={onDiscard} textColor={theme.colors.error}>
          Discard
        </Button>
        <Button mode="contained" onPress={() => onSubmit(selectedMoods)}>
          Save
        </Button>
      </View>
    </View>
  );
};

export default MoodSelector;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  subtitle: {
    marginVertical: spacing.spaceMedium,
  },
  moodWrapper: {
    marginVertical: spacing.spaceExtraSmall,
    borderRadius: roundness,
  },
  moodContent: {
    padding: spacing.spaceMedium,
    flexDirection: "row",
    alignItems: "center",
  },
  moodColor: {
    marginRight: spacing.spaceMedium,
  },
  buttonsWrapper: {
    marginVertical: spacing.spaceMedium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
