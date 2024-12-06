import FeelingSelected from "./FeelingSelected";
import { action } from "@storybook/addon-actions";

import type { Meta, StoryObj } from "@storybook/react";
import { ViewDecorator } from "../storybookDecorators";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";

const meta = {
  title: "FeelingSelected",
  component: FeelingSelected,
  decorators: [ViewDecorator],
} satisfies Meta<typeof FeelingSelected>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    feeling: FEELING_GROUP_NAMES.UNPLEASANT,
    emotions: ["Irritated", "Yearning", "Jealous"],
    onPress: action("onPress"),
  },
};
