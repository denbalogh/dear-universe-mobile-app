import { View } from "react-native";
import MoodColorComposite from "./MoodColorComposite";
import { Mood } from "./types";
import { moods } from "./values";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "MoodColor/MoodColorComposite",
  component: MoodColorComposite,
  decorators: [
    (Story) => (
      <View style={{ height: 200 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MoodColorComposite>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllMoodsEvenly: Story = {
  args: {
    moods: Object.keys(moods).map((mood) => ({ mood: mood as Mood, count: 1 })),
  },
};

export const Example1: Story = {
  args: {
    moods: [
      { mood: "Happiness, Joy", count: 3 },
      { mood: "Excitement, Energy", count: 2 },
      { mood: "Serenity, Balance", count: 1 },
      { mood: "Sadness, Indifference", count: 2 },
    ],
  },
};

export const Example2: Story = {
  args: {
    moods: [
      { mood: "Happiness, Joy", count: 1 },
      { mood: "Excitement, Energy", count: 2 },
      { mood: "Serenity, Balance", count: 1 },
      { mood: "Calmness, Relaxation", count: 1 },
      { mood: "Anger, Frustration", count: 1 },
      { mood: "Sadness, Indifference", count: 3 },
    ],
  },
};

export const SingleMood: Story = {
  args: {
    moods: [{ mood: "Happiness, Joy", count: 5 }],
  },
};

export const TwoMoods: Story = {
  args: {
    moods: [
      { mood: "Happiness, Joy", count: 5 },
      { mood: "Excitement, Energy", count: 2 },
    ],
  },
};
