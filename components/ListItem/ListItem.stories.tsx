import ListItem from "./ListItem";

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { getUnixTime } from "date-fns";

const meta = {
  title: "ListItem",
  component: ListItem,
  argTypes: {
    stats: { control: { type: "object" } },
    moods: { control: { type: "object" } },
  },
} satisfies Meta<typeof ListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const commonArgs = {
  onPress: action("onPress"),
  onAddImageEntryPress: action("onAddImageEntryPress"),
  onAddRecordingEntryPress: action("onAddRecordingEntryPress"),
  onAddTextEntryPress: action("onAddTextEntryPress"),
};

export const Basic: Story = {
  args: {
    ...commonArgs,
    excerpt:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel odio sit amet erat convallis aliquam. Mauris molestie hendrerit varius. Sed eu nisl massa. Integer posuere nunc augue, in semper eros suscipit vel. Aliquam vitae urna aliquet, ultrices tortor sed, feugiat quam. Proin vel dolor eget diam scelerisque scelerisque sit amet ut odio. Mauris venenatis, mauris et consectetur condimentum, arcu ligula congue leo, et faucibus mi ipsum eu augue. Donec convallis sed turpis a maximus. Cras pharetra urna id ligula sodales ullamcorper.",
    timestamp: 1729186762,
    stats: {
      texts: 3,
      recordings: 1,
      images: 1,
    },
    moods: ["Happiness, Joy", "Excitement, Energy"],
  },
};

export const Today: Story = {
  args: {
    ...commonArgs,
    excerpt:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel odio sit amet erat convallis aliquam. Mauris molestie hendrerit varius. Sed eu nisl massa. Integer posuere nunc augue, in semper eros suscipit vel. Aliquam vitae urna aliquet, ultrices tortor sed, feugiat quam. Proin vel dolor eget diam scelerisque scelerisque sit amet ut odio. Mauris venenatis, mauris et consectetur condimentum, arcu ligula congue leo, et faucibus mi ipsum eu augue. Donec convallis sed turpis a maximus. Cras pharetra urna id ligula sodales ullamcorper.",
    timestamp: getUnixTime(new Date()),
    stats: {
      texts: 3,
      recordings: 1,
      images: 1,
    },
    moods: ["Happiness, Joy", "Excitement, Energy"],
  },
};

export const WithoutMoods: Story = {
  args: {
    ...commonArgs,
    excerpt:
      "orem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel odio sit amet erat convallis aliquam. Mauris molestie hendrerit varius. Sed eu nisl massa. Integer posuere nunc augue, in semper eros suscipit vel. Aliquam vitae urna aliquet, ultrices tortor sed, feugiat quam. Proin vel dolor eget diam scelerisque scelerisque sit amet ut odio. Mauris venenatis, mauris et consectetur condimentum, arcu ligula congue leo, et faucibus mi ipsum eu augue. Donec convallis sed turpis a maximus. Cras pharetra urna id ligula sodales ullamcorper.",
    timestamp: 1729186762,
    stats: {
      texts: 3,
      recordings: 1,
      images: 1,
    },
    moods: [],
  },
};

export const WithoutExcerpt: Story = {
  args: {
    ...commonArgs,
    excerpt: "",
    timestamp: 1729186762,
    stats: {
      texts: 0,
      recordings: 0,
      images: 1,
    },
    moods: ["Happiness, Joy"],
  },
};

export const WithoutStats: Story = {
  args: {
    ...commonArgs,
    excerpt: "",
    timestamp: 1729186762,
    stats: {
      texts: 0,
      recordings: 0,
      images: 0,
    },
    moods: ["Happiness, Joy"],
  },
};

export const Loading: Story = {
  args: {
    ...commonArgs,
    excerpt: "",
    timestamp: 1729186762,
    stats: {
      texts: 0,
      recordings: 0,
      images: 0,
    },
    moods: [],
    isLoading: true,
  },
};
