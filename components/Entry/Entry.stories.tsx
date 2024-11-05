import Entry from "./Entry";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import { getRandomImages } from "../CustomImage/storyHelpers";
import { ScrollViewDecorator } from "../storybookDecorators";

const meta = {
  title: "Entry",
  component: Entry,
  decorators: [ScrollViewDecorator],
} satisfies Meta<typeof Entry>;

export default meta;

type Story = StoryObj<typeof meta>;

const moveMenuItems = [
  {
    leadingIcon: "arrow-collapse-up",
    title: "Move to the top",
    onPress: action("Move to the top"),
  },
  {
    leadingIcon: "arrow-up",
    title: "Move up",
    onPress: action("Move up"),
  },
  {
    leadingIcon: "arrow-down",
    title: "Move down",
    onPress: action("Move down"),
  },
  {
    leadingIcon: "arrow-collapse-down",
    title: "Move to the bottom",
    onPress: action("Move to the bottom"),
  },
];

const optionsMenuItems = [
  {
    leadingIcon: "format-title",
    title: "Add title",
    onPress: action("Add title"),
  },
  {
    leadingIcon: "delete",
    title: "Delete entry",
    onPress: action("Delete entry"),
  },
];

export const Basic: Story = {
  args: {
    title: {
      onPress: action("Title pressed"),
      text: "Suspendisse blandit neque id ex volutpat condimentum.",
    },
    text: {
      onPress: action("Text pressed"),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut justo eros. Nulla quis neque tortor. Vivamus et elementum purus, id bibendum dolor. Aenean sit amet lacus justo. Praesent eu sapien in tellus imperdiet vestibulum nec ut eros. Vivamus at sem facilisis nisl cursus dignissim at id mi. Sed fermentum, elit id bibendum eleifend, neque nisl sollicitudin augue, vitae euismod eros augue sed mauris. Ut fermentum nibh maximus turpis suscipit tincidunt. Proin mattis interdum massa non facilisis. Duis non bibendum metus. Phasellus convallis bibendum nunc ac porttitor. Ut luctus nisi vitae dui scelerisque accumsan.",
    },
    moods: ["Happiness, Joy", "Excitement, Energy", "Calmness, Relaxation"],
    onMoodsPress: action("Change moods"),
    moveMenuItems,
    optionsMenuItems,
  },
};

export const WithRecording: Story = {
  args: {
    title: {
      onPress: action("Title pressed"),
      text: "Suspendisse blandit neque id ex volutpat condimentum.",
    },
    text: {
      onPress: action("Text pressed"),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut justo eros. Nulla quis neque tortor. Vivamus et elementum purus, id bibendum dolor. Aenean sit amet lacus justo. Praesent eu sapien in tellus imperdiet vestibulum nec ut eros. Vivamus at sem facilisis nisl cursus dignissim at id mi. Sed fermentum, elit id bibendum eleifend, neque nisl sollicitudin augue, vitae euismod eros augue sed mauris. Ut fermentum nibh maximus turpis suscipit tincidunt. Proin mattis interdum massa non facilisis. Duis non bibendum metus. Phasellus convallis bibendum nunc ac porttitor. Ut luctus nisi vitae dui scelerisque accumsan.",
    },
    moods: ["Happiness, Joy", "Excitement, Energy", "Calmness, Relaxation"],
    onMoodsPress: action("Change moods"),
    moveMenuItems,
    optionsMenuItems,
    recording: true,
  },
};

export const WithImages: Story = {
  args: {
    title: {
      onPress: action("Title pressed"),
      text: "Suspendisse blandit neque id ex volutpat condimentum.",
    },
    text: {
      onPress: action("Text pressed"),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut justo eros. Nulla quis neque tortor. Vivamus et elementum purus, id bibendum dolor. Aenean sit amet lacus justo. Praesent eu sapien in tellus imperdiet vestibulum nec ut eros. Vivamus at sem facilisis nisl cursus dignissim at id mi. Sed fermentum, elit id bibendum eleifend, neque nisl sollicitudin augue, vitae euismod eros augue sed mauris. Ut fermentum nibh maximus turpis suscipit tincidunt. Proin mattis interdum massa non facilisis. Duis non bibendum metus. Phasellus convallis bibendum nunc ac porttitor. Ut luctus nisi vitae dui scelerisque accumsan.",
    },
    moods: ["Happiness, Joy", "Excitement, Energy", "Calmness, Relaxation"],
    onMoodsPress: action("Change moods"),
    moveMenuItems,
    optionsMenuItems,
    images: getRandomImages(10),
  },
};
export const WithImagesOnly: Story = {
  args: {
    moods: ["Happiness, Joy", "Excitement, Energy", "Calmness, Relaxation"],
    onMoodsPress: action("Change moods"),
    moveMenuItems,
    optionsMenuItems,
    images: getRandomImages(10),
  },
};

export const WithImagesAndRecording: Story = {
  args: {
    title: {
      onPress: action("Title pressed"),
      text: "Suspendisse blandit neque id ex volutpat condimentum.",
    },
    text: {
      onPress: action("Text pressed"),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut justo eros. Nulla quis neque tortor. Vivamus et elementum purus, id bibendum dolor. Aenean sit amet lacus justo. Praesent eu sapien in tellus imperdiet vestibulum nec ut eros. Vivamus at sem facilisis nisl cursus dignissim at id mi. Sed fermentum, elit id bibendum eleifend, neque nisl sollicitudin augue, vitae euismod eros augue sed mauris. Ut fermentum nibh maximus turpis suscipit tincidunt. Proin mattis interdum massa non facilisis. Duis non bibendum metus. Phasellus convallis bibendum nunc ac porttitor. Ut luctus nisi vitae dui scelerisque accumsan.",
    },
    moods: ["Happiness, Joy", "Excitement, Energy", "Calmness, Relaxation"],
    onMoodsPress: action("Change moods"),
    moveMenuItems,
    optionsMenuItems,
    images: getRandomImages(5),
    recording: true,
  },
};

export const WithRecordingOnly: Story = {
  args: {
    moods: ["Happiness, Joy", "Excitement, Energy", "Calmness, Relaxation"],
    onMoodsPress: action("Change moods"),
    moveMenuItems,
    optionsMenuItems,
    recording: true,
  },
};

export const NoTitle: Story = {
  args: {
    text: {
      onPress: action("Text pressed"),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut justo eros. Nulla quis neque tortor. Vivamus et elementum purus, id bibendum dolor. Aenean sit amet lacus justo. Praesent eu sapien in tellus imperdiet vestibulum nec ut eros. Vivamus at sem facilisis nisl cursus dignissim at id mi. Sed fermentum, elit id bibendum eleifend, neque nisl sollicitudin augue, vitae euismod eros augue sed mauris. Ut fermentum nibh maximus turpis suscipit tincidunt. Proin mattis interdum massa non facilisis. Duis non bibendum metus. Phasellus convallis bibendum nunc ac porttitor. Ut luctus nisi vitae dui scelerisque accumsan.",
    },
    moods: ["Happiness, Joy", "Excitement, Energy", "Calmness, Relaxation"],
    onMoodsPress: action("Change moods"),
    moveMenuItems,
    optionsMenuItems,
    recording: false,
  },
};

export const NoMoods: Story = {
  args: {
    title: {
      onPress: action("Title pressed"),
      text: "Suspendisse blandit neque id ex volutpat condimentum.",
    },
    text: {
      onPress: action("Text pressed"),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut justo eros. Nulla quis neque tortor. Vivamus et elementum purus, id bibendum dolor. Aenean sit amet lacus justo. Praesent eu sapien in tellus imperdiet vestibulum nec ut eros. Vivamus at sem facilisis nisl cursus dignissim at id mi. Sed fermentum, elit id bibendum eleifend, neque nisl sollicitudin augue, vitae euismod eros augue sed mauris. Ut fermentum nibh maximus turpis suscipit tincidunt. Proin mattis interdum massa non facilisis. Duis non bibendum metus. Phasellus convallis bibendum nunc ac porttitor. Ut luctus nisi vitae dui scelerisque accumsan.",
    },
    moods: [],
    onMoodsPress: action("Change moods"),
    moveMenuItems,
    optionsMenuItems,
    recording: false,
  },
};

export const NoMoveMenu: Story = {
  args: {
    title: {
      onPress: action("Title pressed"),
      text: "Suspendisse blandit neque id ex volutpat condimentum.",
    },
    text: {
      onPress: action("Text pressed"),
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut justo eros. Nulla quis neque tortor. Vivamus et elementum purus, id bibendum dolor. Aenean sit amet lacus justo. Praesent eu sapien in tellus imperdiet vestibulum nec ut eros. Vivamus at sem facilisis nisl cursus dignissim at id mi. Sed fermentum, elit id bibendum eleifend, neque nisl sollicitudin augue, vitae euismod eros augue sed mauris. Ut fermentum nibh maximus turpis suscipit tincidunt. Proin mattis interdum massa non facilisis. Duis non bibendum metus. Phasellus convallis bibendum nunc ac porttitor. Ut luctus nisi vitae dui scelerisque accumsan.",
    },
    moods: ["Happiness, Joy", "Excitement, Energy", "Calmness, Relaxation"],
    onMoodsPress: action("Change moods"),
    moveMenuItems: [],
    optionsMenuItems,
    recording: false,
  },
};
