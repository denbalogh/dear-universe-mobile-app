import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useSortedMoods } from "../MoodColor/values";
import { Mood } from "../MoodColor/types";
import MoodColorSimple from "../MoodColor/MoodColorSimple";
import { roundness, spacing } from "@/constants/theme";
import BottomButtons from "../BottomButtons/BottomButtons";
import * as _ from "lodash";

export type MoodSelectorProps = {
  initialSelected: Mood[];
  onSubmit: (moods: Mood[]) => void;
  onBackPress: () => void;
};

const MoodSelector = ({
  initialSelected,
  onSubmit,
  onBackPress,
}: MoodSelectorProps) => {
  const theme = useTheme();
  const sortedMoods = useSortedMoods();

  const [selectedMoods, setSelectedMoods] = useState(initialSelected);
  const isEdited = _.isEqual(initialSelected, selectedMoods) === false;

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
      <IconButton
        icon="arrow-left"
        onPress={onBackPress}
        accessibilityLabel="Go back"
      />
      <View style={styles.contentWrapper}>
        <Text variant="titleMedium" style={styles.title}>
          What emotional states were you experiencing?
        </Text>
        <View style={styles.moodsWrapper}>
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
        </View>
        <BottomButtons
          buttons={[
            {
              onPress: onBackPress,
              textColor: isEdited ? theme.colors.error : undefined,
              children: isEdited ? "Discard" : "Close",
            },
            {
              onPress: () => onSubmit(selectedMoods),
              mode: "contained",
              children: "Save",
              disabled: !isEdited,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default MoodSelector;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    marginTop: spacing.spaceMedium,
  },
  moodsWrapper: {
    flexDirection: "column",
  },
  moodWrapper: {
    marginVertical: spacing.spaceSmall,
    borderRadius: roundness,
  },
  moodContent: {
    padding: spacing.spaceSmall,
    flexDirection: "row",
    alignItems: "center",
  },
  moodColor: {
    marginRight: spacing.spaceMedium,
  },
});
