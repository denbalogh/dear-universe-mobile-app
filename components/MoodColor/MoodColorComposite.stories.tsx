import { View } from "react-native";
import MoodColorComposite from "./MoodColorComposite";
import { Mood } from "./types";
import { moods } from "./values";

import type { Meta, StoryObj } from "@storybook/react";
import { ViewDecorator } from "../storybookDecorators";

const meta = {
  title: "MoodColor/MoodColorComposite",
  component: MoodColorComposite,
  decorators: [
    ViewDecorator,
    (Story) => (
      <View style={{ height: 200 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      options: ["vertical", "horizontal"],
      control: {
        type: "select",
      },
    },
  },
} satisfies Meta<typeof MoodColorComposite>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllMoodsVertical: Story = {
  args: {
    moods: Object.keys(moods).map((mood) => mood as Mood),
    variant: "vertical",
  },
};

export const AllMoodsHorizontal: Story = {
  args: {
    moods: Object.keys(moods).map((mood) => mood as Mood),
    variant: "horizontal",
  },
};

export const Example1Vertical: Story = {
  args: {
    moods: [
      "Happiness, Joy",
      "Excitement, Energy",
      "Calmness, Relaxation",
      "Sadness, Indifference",
    ],
    variant: "vertical",
  },
};

export const Example1Horizontal: Story = {
  args: {
    moods: [
      "Happiness, Joy",
      "Excitement, Energy",
      "Calmness, Relaxation",
      "Sadness, Indifference",
    ],
    variant: "horizontal",
  },
};

export const Example2Vertical: Story = {
  args: {
    moods: [
      "Happiness, Joy",
      "Excitement, Energy",
      "Calmness, Relaxation",
      "Anger, Frustration",
      "Sadness, Indifference",
    ],
    variant: "vertical",
  },
};

export const Example2Horizontal: Story = {
  args: {
    moods: [
      "Happiness, Joy",
      "Excitement, Energy",
      "Calmness, Relaxation",
      "Anger, Frustration",
      "Sadness, Indifference",
    ],
    variant: "horizontal",
  },
};

export const SingleMoodVertical: Story = {
  args: {
    moods: ["Happiness, Joy"],
    variant: "vertical",
  },
};

export const SingleMoodHorizontal: Story = {
  args: {
    moods: ["Happiness, Joy"],
    variant: "horizontal",
  },
};

export const TwoMoodsVertical: Story = {
  args: {
    moods: ["Happiness, Joy", "Excitement, Energy"],
    variant: "vertical",
  },
};

export const TwoMoodsHorizontal: Story = {
  args: {
    moods: ["Happiness, Joy", "Excitement, Energy"],
    variant: "horizontal",
  },
};
