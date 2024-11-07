import { render, screen, userEvent } from "@testing-library/react-native";
import BottomButtons from "../BottomButtons";

describe("BottomButtons", () => {
  test("should return null when empty buttons", () => {
    render(<BottomButtons testID="buttons" buttons={[]} />);

    expect(screen.queryByTestId("buttons")).not.toBeOnTheScreen();
  });

  test("should render buttons", async () => {
    const buttons = [
      { children: "Save", onPress: jest.fn(), disabled: true },
      { children: "Cancel", onPress: jest.fn() },
    ];

    render(<BottomButtons testID="buttons" buttons={buttons} />);

    expect(screen.getByText("Save")).toBeOnTheScreen();
    expect(screen.getByText("Cancel")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByText("Save"));
    await user.press(screen.getByText("Cancel"));

    expect(buttons[0].onPress).toHaveBeenCalledTimes(0);
    expect(buttons[1].onPress).toHaveBeenCalledTimes(1);
  });
});
