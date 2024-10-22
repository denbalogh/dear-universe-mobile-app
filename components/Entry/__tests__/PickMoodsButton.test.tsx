import { render, screen, userEvent } from "@testing-library/react-native";
import PickMoodsButton from "../PickMoodsButton";

describe("PickMoodsButton", () => {
  test("renders correctly with moods", async () => {
    const onPress = jest.fn();
    render(<PickMoodsButton moods={["Happiness, Joy"]} onPress={onPress} />);

    expect(screen.getByLabelText("Change moods")).toBeOnTheScreen();
    expect(screen.getByLabelText("Picked moods")).toBeOnTheScreen();
    expect(screen.getByLabelText("Change moods")).toContainElement(
      screen.getByLabelText("Picked moods"),
    );

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Change moods"));

    expect(onPress).toHaveBeenCalled();
  });

  test("renders correctly without moods", async () => {
    const onPress = jest.fn();
    render(<PickMoodsButton moods={[]} onPress={onPress} />);

    expect(screen.getByText("Pick moods")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByText("Pick moods"));

    expect(onPress).toHaveBeenCalled();
  });
});
