import MoodColorSimple from "./MoodColorSimple";
import { moodsWithColors } from "./values";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "MoodColor/MoodColorSimple",
  component: MoodColorSimple,
  argTypes: {
    mood: {
      options: Object.keys(moodsWithColors),
      control: {
        type: "select",
      },
    },
    variant: {
      options: ["simple", "wide-horizontal"],
      control: {
        type: "select",
      },
    },
  },
} satisfies Meta<typeof MoodColorSimple>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    mood: "Happines, Joy",
    variant: "simple",
  },
};
