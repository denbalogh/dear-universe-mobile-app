import { ViewDecorator } from "../../storybookDecorators";
import MoodSelector from "./MoodSelector";
import { action } from "@storybook/addon-actions";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "MoodSelector",
  component: MoodSelector,
  decorators: [ViewDecorator],
} satisfies Meta<typeof MoodSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    initialSelected: ["Happiness, Joy"],
    onSubmit: action("onSubmit"),
    onDiscard: action("onDiscard"),
    onBackPress: action("onBackPress"),
  },
};
