import type { Meta, StoryObj } from "@storybook/react";
import TextTesting from "./TextTesting";
import { ScrollViewDecorator } from "../storybookDecorators";

const meta = {
  title: "TextTesting",
  component: TextTesting,
  decorators: [ScrollViewDecorator],
} satisfies Meta<typeof TextTesting>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
