import ImageGallery from "./ImageGallery";

import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { getRandomImages } from "../CustomImage/storyHelpers";
import { StyleSheet, View } from "react-native";
import { useRef } from "react";
import { IconButton } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { action } from "@storybook/addon-actions";
import { ScrollViewDecorator } from "../storybookDecorators";

const meta = {
  title: "ImageGallery",
  component: ImageGallery,
  decorators: [ScrollViewDecorator],
} satisfies Meta<typeof ImageGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    images: getRandomImages(10),
  },
  render: function Render(args) {
    const [{ images }, updateArgs] = useArgs();
    const imagesCount = useRef(images.length);

    const onIncreaseImageCount = () => {
      const newImagesCount = imagesCount.current + 1;
      imagesCount.current = newImagesCount;
      updateArgs({
        images: getRandomImages(newImagesCount),
      });
    };

    const onDecreaseImageCount = () => {
      const newImagesCount = imagesCount.current - 1;
      imagesCount.current = newImagesCount;
      updateArgs({
        images: getRandomImages(newImagesCount),
      });
    };

    return (
      <View>
        <View style={styles.buttonsWrapper}>
          <IconButton icon="minus" onPress={onDecreaseImageCount} />
          <IconButton icon="plus" onPress={onIncreaseImageCount} />
        </View>
        <ImageGallery {...args} images={images} />
      </View>
    );
  },
};

export const WithCheckboxSelected: Story = {
  args: {
    images: getRandomImages(10),
    checkbox: { checked: true, onPress: action("Checkbox pressed") },
  },
};

export const WithCheckboxUnselected: Story = {
  args: {
    images: getRandomImages(10),
    checkbox: { checked: false, onPress: action("Checkbox pressed") },
  },
};

const styles = StyleSheet.create({
  buttonsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.spaceMedium,
  },
});
