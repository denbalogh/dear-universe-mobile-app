import { render, screen, userEvent } from "@testing-library/react-native";
import CustomImage from "../../CustomImage/CustomImage";
import { getRandomImage } from "../storyHelpers";

describe("CustomImage", () => {
  console.error = jest.fn();

  test("should render loading image state correctly", () => {
    render(
      <CustomImage
        imageProps={{ source: getRandomImage(), accessibilityLabel: "Image" }}
        isLoadingTest={true}
        loadingStyle={{ borderRadius: 10 }}
      />,
    );

    expect(screen.getByLabelText("Image")).toBeOnTheScreen();
    expect(screen.getByLabelText("Loading image")).toBeOnTheScreen();
    expect(screen.getByLabelText("Loading image")).toHaveStyle({
      borderRadius: 10,
    });

    expect(screen.queryByTestId("TouchableImage")).not.toBeOnTheScreen();
  });

  test("should render loaded image state correctly", async () => {
    const onPressMock = jest.fn();

    render(
      <CustomImage
        imageProps={{ source: getRandomImage(), accessibilityLabel: "Image" }}
        isLoadingTest={false}
        touchableProps={{ onPress: onPressMock }}
      />,
    );

    expect(screen.getByLabelText("Image")).toBeOnTheScreen();
    expect(screen.queryByLabelText("Loading image")).not.toBeOnTheScreen();

    expect(screen.getByTestId("TouchableImage")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByTestId("TouchableImage"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test("on loading is onPress disabled", async () => {
    const onPressMock = jest.fn();

    render(
      <CustomImage
        imageProps={{ source: getRandomImage(), accessibilityLabel: "Image" }}
        isLoadingTest={true}
        touchableProps={{ onPress: onPressMock }}
      />,
    );

    expect(screen.getByLabelText("Image")).toBeOnTheScreen();
    expect(screen.getByLabelText("Loading image")).toBeOnTheScreen();

    expect(screen.getByTestId("TouchableImage")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByTestId("TouchableImage"));
    expect(onPressMock).toHaveBeenCalledTimes(0);
  });

  test("on loading is checkbox hidden", async () => {
    const onPressMock = jest.fn();
    const onCheckboxPressMock = jest.fn();

    render(
      <CustomImage
        imageProps={{ source: getRandomImage(), accessibilityLabel: "Image" }}
        isLoadingTest={true}
        touchableProps={{ onPress: onPressMock }}
        checkbox={{ checked: true, onPress: onCheckboxPressMock }}
      />,
    );

    expect(screen.getByLabelText("Image")).toBeOnTheScreen();
    expect(screen.getByLabelText("Loading image")).toBeOnTheScreen();

    expect(screen.getByTestId("TouchableImage")).toBeOnTheScreen();

    expect(screen.queryByTestId("ImageCheckbox")).not.toBeOnTheScreen();
  });

  test("checkbox is shown correctly", async () => {
    const onPressMock = jest.fn();
    const onCheckboxPressMock = jest.fn();

    render(
      <CustomImage
        imageProps={{ source: getRandomImage(), accessibilityLabel: "Image" }}
        isLoadingTest={false}
        touchableProps={{ onPress: onPressMock }}
        checkbox={{ checked: true, onPress: onCheckboxPressMock }}
      />,
    );

    expect(screen.getByLabelText("Image")).toBeOnTheScreen();
    expect(screen.getByTestId("TouchableImage")).toBeOnTheScreen();

    const user = userEvent.setup();

    expect(screen.getByTestId("ImageCheckbox")).toBeOnTheScreen();
    expect(screen.getByLabelText("Unselect image")).toBeOnTheScreen();

    await user.press(screen.getByTestId("ImageCheckbox"));
    expect(onCheckboxPressMock).toHaveBeenCalledTimes(1);

    render(
      <CustomImage
        imageProps={{ source: getRandomImage(), accessibilityLabel: "Image" }}
        isLoadingTest={false}
        touchableProps={{ onPress: onPressMock }}
        checkbox={{ checked: false, onPress: onCheckboxPressMock }}
      />,
    );

    expect(screen.getByTestId("ImageCheckbox")).toBeOnTheScreen();
    expect(screen.getByLabelText("Select image")).toBeOnTheScreen();
  });
});
