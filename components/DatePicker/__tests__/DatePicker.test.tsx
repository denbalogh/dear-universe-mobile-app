import { themeLight } from "@/constants/theme";
import { useState } from "react";
import { Button, PaperProvider } from "react-native-paper";
import DatePicker from "../DatePicker";
import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";

const TestComponent = ({
  onDismiss,
  onConfirm,
}: {
  onDismiss: () => void;
  onConfirm: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleHideDialog = () => {
    setIsVisible(false);
    onDismiss();
  };

  const handleOnConfirm = () => {
    setIsVisible(false);
    onConfirm();
  };

  return (
    <PaperProvider theme={themeLight}>
      <Button testID="buttonToOpen" onPress={() => setIsVisible(true)}>
        Show date picker
      </Button>
      <DatePicker
        visible={isVisible}
        onDismiss={handleHideDialog}
        onConfirm={handleOnConfirm}
        date={new Date()}
      />
    </PaperProvider>
  );
};

describe("DatePicker", () => {
  test("renders correctly", async () => {
    const onDismissMock = jest.fn();
    const onConfirmMock = jest.fn();

    render(
      <TestComponent onDismiss={onDismissMock} onConfirm={onConfirmMock} />,
    );

    await waitFor(() => {
      expect(screen.queryByText("Go to date")).not.toBeOnTheScreen();
    });

    const user = userEvent.setup();

    await user.press(screen.getByTestId("buttonToOpen"));

    let text = await screen.findByText("Go to date");
    expect(text).toBeOnTheScreen();

    await user.press(screen.getByText("Go to date"));

    await waitFor(() => {
      expect(screen.queryByText("Go to date")).not.toBeOnTheScreen();
    });

    await user.press(screen.getByTestId("buttonToOpen"));

    text = await screen.findByText("Go to date");
    expect(text).toBeOnTheScreen();

    expect(onDismissMock).toHaveBeenCalledTimes(1); // Close and Confirm
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
