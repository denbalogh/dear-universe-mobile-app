import { View } from "react-native";
import FeelingsIndicator from "./FeelingsIndicator";

import type { Meta, StoryObj } from "@storybook/react";
import { FlexViewDecorator } from "../storybookDecorators";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { ITEM_HEIGHT } from "../InfiniteDaysList/constants";
import { spacing } from "@/constants/theme";

const meta = {
  title: "FeelingsIndicator",
  component: FeelingsIndicator,
  decorators: [
    FlexViewDecorator,
    (Story) => (
      <View style={{ height: ITEM_HEIGHT + 2 * spacing.spaceExtraSmall }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof FeelingsIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllFeelings: Story = {
  args: {
    feelings: Object.values(FEELING_GROUP_NAMES),
  },
};

export const JustOne: Story = {
  args: {
    feelings: [FEELING_GROUP_NAMES.UNPLEASANT],
  },
};

export const Two: Story = {
  args: {
    feelings: [
      FEELING_GROUP_NAMES.UNPLEASANT,
      FEELING_GROUP_NAMES.VERY_UNPLEASANT,
    ],
  },
};
