import { render, screen } from "@testing-library/react-native";
import ImageGalleryItem from "../ImageGalleryItem";
import { getRandomImage } from "@/components/CustomImage/storyHelpers";
import {
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  zeroBorderRadius,
} from "../getBorderRadius";

describe("ImageGalleryItem", () => {
  console.error = jest.fn();

  test("should render image borderRadius correctly", () => {
    render(
      <ImageGalleryItem
        imageProps={{ source: getRandomImage(), testID: "Image" }}
        index={0}
        imagesCount={1}
      />,
    );

    expect(screen.getByTestId("Image")).toBeOnTheScreen();
    expect(screen.getByTestId("Image")).toHaveStyle({
      ...borderTopLeftRadius,
      ...borderBottomRightRadius,
      ...borderTopRightRadius,
      ...borderBottomLeftRadius,
    });
  });

  test("should render loading borderRadius correctly", () => {
    render(
      <ImageGalleryItem
        imageProps={{ source: getRandomImage() }}
        index={0}
        imagesCount={2}
        isLoadingTest={true}
      />,
    );

    expect(screen.getByLabelText("Loading image")).toBeOnTheScreen();
    expect(screen.getByLabelText("Loading image")).toHaveStyle({
      ...zeroBorderRadius,
      ...borderTopLeftRadius,
      ...borderBottomLeftRadius,
    });
  });
});
