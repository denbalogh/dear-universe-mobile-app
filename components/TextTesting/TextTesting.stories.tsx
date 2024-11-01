import type { Meta, StoryObj } from "@storybook/react";
import TextTesting from "./TextTesting";

const meta = {
  title: "TextTesting",
  component: TextTesting,
} satisfies Meta<typeof TextTesting>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
