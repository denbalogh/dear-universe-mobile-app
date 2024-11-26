import DatePicker from "./DatePicker";

import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { action } from "@storybook/addon-actions";
import { ViewDecorator } from "../storybookDecorators";

const meta = {
  title: "DatePicker",
  component: DatePicker,
  decorators: [ViewDecorator],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    date: new Date(),
    visible: false,
    onDismiss: action("onDismiss"),
    onConfirm: action("onConfirm"),
  },
  render: function Render(args) {
    const [{ visible }, updateArgs] = useArgs();

    const hideDialog = () => {
      updateArgs({ visible: false });
    };

    const showDialog = () => {
      updateArgs({ visible: true });
    };

    return (
      <View>
        <Button onPress={showDialog}>Show date picker</Button>
        <DatePicker {...args} visible={visible} onDismiss={hideDialog} />
      </View>
    );
  },
};
