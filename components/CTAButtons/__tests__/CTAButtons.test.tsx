import { render, screen, userEvent } from "@testing-library/react-native";
import CTAButtons from "../CTAButtons";

describe("CTAButtons", () => {
  test("renders correctly", async () => {
    const addTextMock = jest.fn();
    const addRecordingMock = jest.fn();
    const addMediaMock = jest.fn();

    render(
      <CTAButtons
        addTextButton={{
          onPress: addTextMock,
          accessibilityLabel: "Add text",
        }}
        addRecordingButton={{
          onPress: addRecordingMock,
          accessibilityLabel: "Add recording",
        }}
        addMediaButton={{
          onPress: addMediaMock,
          accessibilityLabel: "Add media",
        }}
        accessibilityLabel="CTA buttons"
      />,
    );

    expect(screen.getByLabelText("CTA buttons")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add text")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add media")).toBeOnTheScreen();

    const user = userEvent.setup();
    await user.press(screen.getByLabelText("Add text"));
    await user.press(screen.getByLabelText("Add recording "));
    await user.press(screen.getByLabelText("Add media"));

    expect(addTextMock).toHaveBeenCalledTimes(1);
    expect(addRecordingMock).toHaveBeenCalledTimes(1);
    expect(addMediaMock).toHaveBeenCalledTimes(1);
  });
});
