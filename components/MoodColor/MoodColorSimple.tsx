import React from "react";
import { Mood } from "./types";
import { StyleSheet, View, ViewProps } from "react-native";
import { getMoodColor } from "./values";

type Variant = "simple" | "wide-horizontal";

type Props = {
  mood: Mood;
  variant?: Variant;
} & ViewProps;

const MoodColorSimple = ({ mood, variant = "simple", ...props }: Props) => {
  return (
    <View
      style={[styles[variant], { backgroundColor: getMoodColor(mood) }]}
      {...props}
    />
  );
};

export default MoodColorSimple;

const styles = StyleSheet.create({
  simple: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  "wide-horizontal": {
    width: 48,
    height: 24,
    borderRadius: 5,
  },
});
