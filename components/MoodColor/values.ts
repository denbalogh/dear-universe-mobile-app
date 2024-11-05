import { ColorValue } from "react-native";
import { Mood } from "./types";
import { useMemo } from "react";

export const moods = {
  "Happiness, Joy": { color: "#F4D03F", order: 1 },
  "Excitement, Energy": { color: "#E59866", order: 2 },
  "Calmness, Relaxation": { color: "#48C9B0", order: 3 },
  "Anger, Frustration": { color: "#CB4335", order: 4 },
  "Sadness, Indifference": { color: "#A6ACAF", order: 5 },
};

export const useSortedMoods = (values = moods): Mood[] =>
  useMemo(
    () =>
      Object.entries(values)
        .sort((a, b) => a[1]["order"] - b[1]["order"])
        .map((mood) => mood[0] as Mood),
    [],
  );

export const getMoodColor = (mood: Mood): ColorValue => moods[mood]["color"];
export const getMoodOrder = (mood: Mood) => moods[mood]["order"];
