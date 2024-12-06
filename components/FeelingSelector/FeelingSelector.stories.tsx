import FeelingSelector from "./FeelingSelector";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "FeelingSelector",
  component: FeelingSelector,
} satisfies Meta<typeof FeelingSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    bottomComponent: null,
  },
};
