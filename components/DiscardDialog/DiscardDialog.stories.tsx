import DiscardDialog from "./DiscardDialog";

import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { action } from "@storybook/addon-actions";
import { FlexViewDecorator } from "../storybookDecorators";

const meta = {
  title: "DiscardDialog",
  component: DiscardDialog,
  decorators: [FlexViewDecorator],
} satisfies Meta<typeof DiscardDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: "Are you sure you want to discard the changes?",
    isVisible: false,
    hideDialog: action("hideDialog"),
    onConfirm: action("onConfirm"),
  },
  render: function Render(args) {
    const [{ isVisible }, updateArgs] = useArgs();

    const hideDialog = () => {
      updateArgs({ isVisible: false });
    };

    const showDialog = () => {
      updateArgs({ isVisible: true });
    };

    return (
      <View>
        <Button onPress={showDialog}>Show Dialog</Button>
        <DiscardDialog
          {...args}
          isVisible={isVisible}
          hideDialog={hideDialog}
        />
      </View>
    );
  },
};
