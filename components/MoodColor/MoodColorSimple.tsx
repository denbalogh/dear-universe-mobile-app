import React from "react";
import { Mood } from "./types";
import { StyleSheet, View, ViewProps } from "react-native";
import { getMoodColor } from "./values";
import { roundness, sizing } from "@/constants/theme";

type Props = {
  mood: Mood;
} & ViewProps;

const MoodColorSimple = ({ mood, ...props }: Props) => {
  return (
    <View
      style={[styles.wrapper, { backgroundColor: getMoodColor(mood) }]}
      {...props}
    />
  );
};

export default MoodColorSimple;

const styles = StyleSheet.create({
  wrapper: {
    width: sizing.sizeMedium,
    height: sizing.sizeMedium,
    borderRadius: roundness,
  },
});
