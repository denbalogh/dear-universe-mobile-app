import AudioPlayer from "./AudioPlayer";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "AudioPlayer",
  component: AudioPlayer,
} satisfies Meta<typeof AudioPlayer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
