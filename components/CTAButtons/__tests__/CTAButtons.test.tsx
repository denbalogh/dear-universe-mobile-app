import { render, screen, userEvent } from "@testing-library/react-native";
import CTAButtons from "../CTAButtons";

describe("CTAButtons", () => {
  test("renders correctly", async () => {
    const addTextEntryMock = jest.fn();
    const addRecordingEntryMock = jest.fn();
    const addImageEntryMock = jest.fn();

    render(
      <CTAButtons
        addTextEntryButton={{
          onPress: addTextEntryMock,
          accessibilityLabel: "Add text entry",
        }}
        addRecordingEntryButton={{
          onPress: addRecordingEntryMock,
          accessibilityLabel: "Add recording entry",
        }}
        addImageEntryButton={{
          onPress: addImageEntryMock,
          accessibilityLabel: "Add image entry",
        }}
        accessibilityLabel="CTA buttons"
      />,
    );

    expect(screen.getByLabelText("CTA buttons")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add text entry")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add recording entry")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add image entry")).toBeOnTheScreen();

    const user = userEvent.setup();
    await user.press(screen.getByLabelText("Add text entry"));
    await user.press(screen.getByLabelText("Add recording entry"));
    await user.press(screen.getByLabelText("Add image entry"));

    expect(addTextEntryMock).toHaveBeenCalledTimes(1);
    expect(addRecordingEntryMock).toHaveBeenCalledTimes(1);
    expect(addImageEntryMock).toHaveBeenCalledTimes(1);
  });
});
