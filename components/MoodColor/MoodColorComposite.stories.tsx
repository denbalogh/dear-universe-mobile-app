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
    moods: Object.keys(moods).map((mood) => mood as Mood),
  },
};

export const Example1: Story = {
  args: {
    moods: [
      "Happiness, Joy",
      "Excitement, Energy",
      "Serenity, Balance",
      "Sadness, Indifference",
    ],
  },
};

export const Example2: Story = {
  args: {
    moods: [
      "Happiness, Joy",
      "Excitement, Energy",
      "Serenity, Balance",
      "Calmness, Relaxation",
      "Anger, Frustration",
      "Sadness, Indifference",
    ],
  },
};

export const SingleMood: Story = {
  args: {
    moods: ["Happiness, Joy"],
  },
};

export const TwoMoods: Story = {
  args: {
    moods: ["Happiness, Joy", "Excitement, Energy"],
  },
};
