import CTAButtons from "./CTAButtons";
import { action } from "@storybook/addon-actions";

import type { Meta, StoryObj } from "@storybook/react";
import { ViewDecorator } from "../storybookDecorators";

const meta = {
  title: "CTAButtons",
  component: CTAButtons,
  decorators: [ViewDecorator],
} satisfies Meta<typeof CTAButtons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    addTextEntryButton: { onPress: action("onAddTextEntry") },
    addRecordingEntryButton: { onPress: action("onAddRecordingEntry") },
    addImageEntryButton: { onPress: action("onAddImageEntry") },
  },
};
