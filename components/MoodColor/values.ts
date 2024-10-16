import { ColorValue } from "react-native";
import { Mood } from "./types";

export const moods = {
  "Happiness, Joy": { color: "#F4D03F", order: 1 },
  "Excitement, Energy": { color: "#E59866", order: 2 },
  "Serenity, Balance": { color: "#58D68D", order: 3 },
  "Calmness, Relaxation": { color: "#5DADE2", order: 4 },
  "Anger, Frustration": { color: "#CB4335", order: 5 },
  "Sadness, Indifference": { color: "#A6ACAF", order: 6 },
};

export const getMoodColor = (mood: Mood): ColorValue => moods[mood]["color"];
export const getMoodOrder = (mood: Mood) => moods[mood]["order"];
