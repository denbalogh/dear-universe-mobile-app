import ListItem from "./ListItem";

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ViewDecorator } from "../storybookDecorators";
import { formatDateId } from "@/utils/date";

const meta = {
  title: "ListItem",
  component: ListItem,
  decorators: [ViewDecorator],
} satisfies Meta<typeof ListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const commonArgs = {
  onPress: action("onPress"),
};

export const Basic: Story = {
  args: {
    ...commonArgs,
    title:
      "The one with flying over the ocean with only my backpack and sandals on. Quite a wild ride. I was so happy and excited.",
    dateId: "20/10/2024",
    moods: ["Happiness, Joy", "Excitement, Energy"],
  },
};

export const Today: Story = {
  args: {
    ...commonArgs,
    title:
      "The one with flying over the ocean with only my backpack and sandals on.",
    dateId: formatDateId(new Date()),
    moods: ["Happiness, Joy", "Excitement, Energy"],
  },
};

export const WithoutMoods: Story = {
  args: {
    ...commonArgs,
    title:
      "The one with flying over the ocean with only my backpack and sandals on.",
    dateId: "20/10/2024",
    moods: [],
  },
};

export const Empty: Story = {
  args: {
    ...commonArgs,
    title: "",
    dateId: "20/10/2024",
    moods: [],
    empty: {
      onAddImageEntryPress: action("onAddImageEntryPress"),
      onAddRecordingEntryPress: action("onAddRecordingEntryPress"),
      onAddTextEntryPress: action("onAddTextEntryPress"),
    },
  },
};
