import CustomImage from "./CustomImage";

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { getRandomImage } from "./storyHelpers";
import { roundness } from "@/constants/theme";
import { ViewDecorator } from "../storybookDecorators";

const meta = {
  title: "CustomImage",
  component: CustomImage,
  decorators: [ViewDecorator],
} satisfies Meta<typeof CustomImage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    imageProps: { source: getRandomImage() },
    touchableProps: { onPress: action("onPress") },
    style: { width: 100, height: 100 },
  },
};

export const Disabled: Story = {
  args: {
    imageProps: { source: getRandomImage() },
    touchableProps: { onPress: action("onPress"), disabled: true },
    style: { width: 100, height: 100 },
  },
};

export const Rounded: Story = {
  args: {
    imageProps: {
      source: getRandomImage(),
      style: { borderRadius: roundness },
    },
    touchableProps: { onPress: action("onPress") },
    style: { width: 100, height: 100 },
    loadingStyle: {
      borderRadius: roundness,
    },
  },
};

export const WithCheckbox: Story = {
  args: {
    imageProps: { source: getRandomImage() },
    touchableProps: { onPress: action("onPress") },
    style: { width: 100, height: 100 },
    checkbox: {
      checked: false,
      onPress: action("onCheckboxPress"),
    },
  },
};

export const WithCheckboxChecked: Story = {
  args: {
    imageProps: { source: getRandomImage() },
    touchableProps: { onPress: action("onPress") },
    style: { width: 100, height: 100 },
    checkbox: {
      checked: true,
      onPress: action("onCheckboxPress"),
    },
  },
};
