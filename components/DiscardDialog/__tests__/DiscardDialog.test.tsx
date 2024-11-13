import { render, screen, userEvent } from "@testing-library/react-native";
import DiscardDialog from "../DiscardDialog";
import { PaperProvider } from "react-native-paper";
import { themeLight } from "@/constants/theme";

describe("DiscardDialog", () => {
  console.error = jest.fn();

  test("is visible", async () => {
    const hideDialogMock = jest.fn();
    const onConfirmMock = jest.fn();

    render(
      <PaperProvider theme={themeLight}>
        <DiscardDialog
          text="Are you sure you want to discard this recording?"
          isVisible={true}
          hideDialog={hideDialogMock}
          onConfirm={onConfirmMock}
        />
      </PaperProvider>,
    );

    expect(
      screen.getByText("Are you sure you want to discard this recording?"),
    ).toBeOnTheScreen();

    expect(screen.getByText("Close")).toBeOnTheScreen();
    expect(screen.getByText("Confirm")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByText("Close"));
    await user.press(screen.getByText("Confirm"));

    expect(hideDialogMock).toHaveBeenCalledTimes(2); // Close and Confirm
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test("is not visible", () => {
    const hideDialogMock = jest.fn();
    const onConfirmMock = jest.fn();

    render(
      <PaperProvider theme={themeLight}>
        <DiscardDialog
          text="Are you sure you want to discard this recording?"
          isVisible={false}
          hideDialog={hideDialogMock}
          onConfirm={onConfirmMock}
        />
      </PaperProvider>,
    );

    expect(
      screen.queryByText("Are you sure you want to discard this recording?"),
    ).not.toBeOnTheScreen();
  });
});
