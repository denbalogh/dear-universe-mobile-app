import MoodSelector from "./MoodSelector";
import { action } from "@storybook/addon-actions";

import type { Meta, StoryObj } from "@storybook/react";
import { FlexViewDecorator } from "../storybookDecorators";

const meta = {
  title: "MoodSelector",
  component: MoodSelector,
  decorators: [FlexViewDecorator],
} satisfies Meta<typeof MoodSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    initialSelected: ["Happiness, Joy"],
    onSubmit: action("onSubmit"),
    onBackPress: action("onBackPress"),
  },
};
