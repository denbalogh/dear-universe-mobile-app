import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import DiscardDialog from "../DiscardDialog";
import { Button, PaperProvider } from "react-native-paper";
import { themeLight } from "@/constants/theme";
import { useState } from "react";

jest.useFakeTimers();

const TestComponent = ({
  hideDialog,
  onConfirm,
}: {
  hideDialog: () => void;
  onConfirm: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleHideDialog = () => {
    setIsVisible(false);
    hideDialog();
  };

  const handleOnConfirm = () => {
    setIsVisible(false);
    onConfirm();
  };

  return (
    <PaperProvider theme={themeLight}>
      <Button testID="buttonToOpen" onPress={() => setIsVisible(true)}>
        Show dialog
      </Button>
      <DiscardDialog
        text="Are you sure you want to discard this recording?"
        isVisible={isVisible}
        hideDialog={handleHideDialog}
        onConfirm={handleOnConfirm}
      />
    </PaperProvider>
  );
};

describe("DiscardDialog", () => {
  console.error = jest.fn();

  test("renders correctly", async () => {
    const hideDialogMock = jest.fn();
    const onConfirmMock = jest.fn();

    render(
      <TestComponent hideDialog={hideDialogMock} onConfirm={onConfirmMock} />,
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to discard this recording?"),
      ).not.toBeOnTheScreen();
    });

    const user = userEvent.setup();

    await user.press(screen.getByTestId("buttonToOpen"));

    let text = await screen.findByText(
      "Are you sure you want to discard this recording?",
    );

    expect(text).toBeOnTheScreen();

    expect(screen.getByText("Close")).toBeOnTheScreen();
    expect(screen.getByText("Confirm")).toBeOnTheScreen();

    await user.press(screen.getByText("Close"));

    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to discard this recording?"),
      ).not.toBeOnTheScreen();
    });

    await user.press(screen.getByTestId("buttonToOpen"));

    text = await screen.findByText(
      "Are you sure you want to discard this recording?",
    );

    expect(text).toBeOnTheScreen();

    await user.press(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(
        screen.queryByText("Are you sure you want to discard this recording?"),
      ).not.toBeOnTheScreen();
    });

    expect(hideDialogMock).toHaveBeenCalledTimes(2); // Close and Confirm
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
