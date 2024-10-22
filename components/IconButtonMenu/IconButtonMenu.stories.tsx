import IconButtonMenu from "./IconButtonMenu";
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "IconButtonMenu",
  component: IconButtonMenu,
} satisfies Meta<typeof IconButtonMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

const menuItems = [
  {
    leadingIcon: "numeric-1",
    title: "button 1",
    onPress: action("button 1 pressed"),
  },
  {
    leadingIcon: "numeric-2",
    title: "button 2",
    onPress: action("button 2 pressed"),
  },
];

export const Basic: Story = {
  args: {
    menuItems,
    iconButtonProps: {
      icon: "dots-vertical",
      onPress: action("Icon button pressed"),
    },
  },
};

export const NoMenuItems: Story = {
  args: {
    menuItems: [],
    iconButtonProps: {
      icon: "dots-vertical",
      onPress: action("Icon button pressed"),
    },
  },
};
