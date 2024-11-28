import { FlexViewDecorator } from "../storybookDecorators";
import MoodColorSimple from "./MoodColorSimple";
import { moods } from "./values";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "MoodColor/MoodColorSimple",
  component: MoodColorSimple,
  decorators: [FlexViewDecorator],
  argTypes: {
    mood: {
      options: Object.keys(moods),
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
    mood: "Happiness, Joy",
  },
};
