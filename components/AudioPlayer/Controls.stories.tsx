import Controls from "./Controls";

import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { FlexViewDecorator } from "../storybookDecorators";

const meta = {
  title: "AudioPlayer/Controls",
  component: Controls,
  decorators: [FlexViewDecorator],
} satisfies Meta<typeof Controls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    isLoading: false,
    isPlaying: false,
    currentTime: "00:00",
    maxTime: "05:00",
    onPlayPress: action("onPlayPress"),
    onPausePress: action("onPausePress"),
    on5SecForwardPress: action("on5SecForwardPress"),
    on5SecRewindPress: action("on5SecRewindPress"),
    failedToLoad: false,
    onReloadPress: action("onReloadPress"),
  },
};

export const isLoading: Story = {
  args: {
    isLoading: true,
    isPlaying: false,
    currentTime: "00:00",
    maxTime: "05:00",
    onPlayPress: action("onPlayPress"),
    onPausePress: action("onPausePress"),
    on5SecForwardPress: action("on5SecForwardPress"),
    on5SecRewindPress: action("on5SecRewindPress"),
    failedToLoad: false,
    onReloadPress: action("onReloadPress"),
  },
};

export const isPlaying: Story = {
  args: {
    isLoading: false,
    isPlaying: true,
    currentTime: "00:00",
    maxTime: "05:00",
    onPlayPress: action("onPlayPress"),
    onPausePress: action("onPausePress"),
    on5SecForwardPress: action("on5SecForwardPress"),
    on5SecRewindPress: action("on5SecRewindPress"),
    failedToLoad: false,
    onReloadPress: action("onReloadPress"),
  },
};

export const noTimes: Story = {
  args: {
    isLoading: false,
    isPlaying: false,
    onPlayPress: action("onPlayPress"),
    onPausePress: action("onPausePress"),
    on5SecForwardPress: action("on5SecForwardPress"),
    on5SecRewindPress: action("on5SecRewindPress"),
    failedToLoad: false,
    onReloadPress: action("onReloadPress"),
  },
};

export const failedToLoad: Story = {
  args: {
    isLoading: false,
    isPlaying: false,
    onPlayPress: action("onPlayPress"),
    onPausePress: action("onPausePress"),
    on5SecForwardPress: action("on5SecForwardPress"),
    on5SecRewindPress: action("on5SecRewindPress"),
    failedToLoad: true,
    onReloadPress: action("onReloadPress"),
  },
};
