import TitleDescriptionEditor from "./TitleDescriptionEditor";
import { action } from "@storybook/addon-actions";

import type { Meta, StoryObj } from "@storybook/react";
import { FlexViewDecorator } from "../storybookDecorators";

const meta = {
  title: "TitleDescriptionEditor",
  component: TitleDescriptionEditor,
  decorators: [FlexViewDecorator],
} satisfies Meta<typeof TitleDescriptionEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    initialTitle: "Title",
    initialDescription: "Description",
    onSubmit: action("onSubmit"),
    onBackPress: action("onBackPress"),
  },
};

export const Fulltext: Story = {
  args: {
    initialTitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sed.",
    initialDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed purus a arcu tristique hendrerit. In sit amet nunc vel elit blandit varius non at quam. Proin luctus sagittis risus at semper. Proin quis convallis justo. Phasellus sed interdum sem, at elementum mauris. Nulla ut laoreet sem. Curabitur non urna et justo ultricies mattis. \n Duis nec arcu augue. Fusce id bibendum nisl. Vivamus feugiat tincidunt lorem et fringilla. Quisque nec ante purus. Maecenas imperdiet augue eget enim vulputate, eleifend scelerisque velit ultricies. Etiam commodo ante lacus, vitae ullamcorper nisl feugiat ut. Aliquam ut suscipit risus. Duis augue erat, scelerisque vitae. Duis nec arcu augue. Fusce id bibendum nisl. Vivamus feugiat tincidunt lorem et fringilla. Quisque nec ante purus. Maecenas imperdiet augue eget enim vulputate, eleifend scelerisque velit ultricies. Etiam commodo ante lacus, vitae ullamcorper nisl feugiat ut. Aliquam ut suscipit risus. Duis augue erat, scelerisque vitae. Duis nec arcu augue. Fusce id bibendum nisl. Vivamus feugiat tincidunt lorem et fringilla. Quisque nec ante purus. Maecenas imperdiet augue eget enim vulputate, eleifend scelerisque velit ultricies. Etiam commodo ante lacus, vitae ullamcorper nisl feugiat ut. Aliquam ut suscipit risus. Duis augue erat, scelerisque vitae.",
    onSubmit: action("onSubmit"),
    onBackPress: action("onBackPress"),
  },
};

export const FocusTitle: Story = {
  args: {
    initialTitle: "Title",
    initialDescription: "Description",
    onSubmit: action("onSubmit"),
    onBackPress: action("onBackPress"),
    focusTitle: true,
  },
};

export const FocusDescription: Story = {
  args: {
    initialTitle: "Title",
    initialDescription: "Description",
    onSubmit: action("onSubmit"),
    onBackPress: action("onBackPress"),
    focusDescription: true,
  },
};
