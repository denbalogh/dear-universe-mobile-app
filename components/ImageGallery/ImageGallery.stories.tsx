import ImageGallery from "./ImageGallery";

import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { getRandomImages } from "./storyHelpers";
import { StyleSheet, View } from "react-native";
import { useRef } from "react";
import { IconButton } from "react-native-paper";
import { spacing } from "@/constants/theme";

const meta = {
  title: "ImageGallery",
  component: ImageGallery,
} satisfies Meta<typeof ImageGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    images: getRandomImages(10).map((source) => ({ source })),
  },
  render: function Render(args) {
    const [{ images }, updateArgs] = useArgs();
    const imagesCount = useRef(images.length);

    const onIncreaseImageCount = () => {
      const newImagesCount = imagesCount.current + 1;
      imagesCount.current = newImagesCount;
      updateArgs({
        images: getRandomImages(newImagesCount).map((source) => ({ source })),
      });
    };

    const onDecreaseImageCount = () => {
      const newImagesCount = imagesCount.current - 1;
      imagesCount.current = newImagesCount;
      updateArgs({
        images: getRandomImages(newImagesCount).map((source) => ({ source })),
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

const styles = StyleSheet.create({
  buttonsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.spaceMedium,
  },
});
