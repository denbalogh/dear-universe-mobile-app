import Controls from "./Controls";

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ViewDecorator } from "../storybookDecorators";

const meta = {
  title: "AudioRecorder/Controls",
  component: Controls,
  decorators: [ViewDecorator],
} satisfies Meta<typeof Controls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    time: "00:00",
    isLoading: false,
    isRecording: false,
    hasRecordingStarted: false,
    onContinuePress: action("onContinuePress"),
    onDiscardPress: action("onDiscardPress"),
    onPausePress: action("onPausePress"),
    onRecordPress: action("onRecordPress"),
    onStopPress: action("onStopPress"),
  },
};

export const Loading: Story = {
  args: {
    time: "00:00",
    isLoading: true,
    isRecording: false,
    hasRecordingStarted: false,
    onContinuePress: action("onContinuePress"),
    onDiscardPress: action("onDiscardPress"),
    onPausePress: action("onPausePress"),
    onRecordPress: action("onRecordPress"),
    onStopPress: action("onStopPress"),
  },
};

export const Recording: Story = {
  args: {
    time: "00:10",
    isLoading: false,
    isRecording: true,
    hasRecordingStarted: true,
    onContinuePress: action("onContinuePress"),
    onDiscardPress: action("onDiscardPress"),
    onPausePress: action("onPausePress"),
    onRecordPress: action("onRecordPress"),
    onStopPress: action("onStopPress"),
  },
};

export const Paused: Story = {
  args: {
    time: "00:10",
    isLoading: false,
    isRecording: false,
    hasRecordingStarted: true,
    onContinuePress: action("onContinuePress"),
    onDiscardPress: action("onDiscardPress"),
    onPausePress: action("onPausePress"),
    onRecordPress: action("onRecordPress"),
    onStopPress: action("onStopPress"),
  },
};
