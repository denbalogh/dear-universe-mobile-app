import AudioRecorder from "./AudioRecorder";
import { action } from "@storybook/addon-actions";

import type { Meta, StoryObj } from "@storybook/react";
import { FlexViewDecorator } from "../storybookDecorators";

const meta = {
  title: "AudioRecorder",
  component: AudioRecorder,
  decorators: [FlexViewDecorator],
} satisfies Meta<typeof AudioRecorder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    onRecordingFinished: action("onRecordingFinished"),
    onBackPress: action("onBackPress"),
  },
};
