import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import IconButtonMenu from "../IconButtonMenu";
import { PaperProvider } from "react-native-paper";

describe("IconButtonMenu", () => {
  test("renders correctly", async () => {
    const onButton1Press = jest.fn();
    const onButton2Press = jest.fn();
    const onIconButtonPress = jest.fn();

    render(
      <PaperProvider>
        <IconButtonMenu
          menuItems={[
            {
              leadingIcon: "numeric-1",
              title: "button 1",
              onPress: onButton1Press,
            },
            {
              leadingIcon: "numeric-2",
              title: "button 2",
              onPress: onButton2Press,
            },
          ]}
          iconButtonProps={{
            icon: "dots-vertical",
            onPress: onIconButtonPress,
            accessibilityLabel: "Open menu",
          }}
        />
      </PaperProvider>,
    );

    expect(screen.getByLabelText("Open menu")).toBeOnTheScreen();
    expect(screen.queryByText("button 1")).not.toBeOnTheScreen();
    expect(screen.queryByText("button 2")).not.toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Open menu"));

    expect(screen.getByText("button 1")).toBeOnTheScreen();
    expect(screen.getByText("button 2")).toBeOnTheScreen();

    await user.press(screen.getByText("button 1"));

    await waitFor(() => {
      expect(screen.queryByText("button 1")).not.toBeOnTheScreen();
    });

    await waitFor(() => {
      expect(screen.queryByText("button 1")).not.toBeOnTheScreen();
    });

    expect(onButton1Press).toHaveBeenCalledTimes(1);
    expect(onButton2Press).toHaveBeenCalledTimes(0);
    expect(onIconButtonPress).toHaveBeenCalledTimes(1);
  });

  test("renders correctly with no menu items", async () => {
    const onIconButtonPress = jest.fn();

    render(
      <PaperProvider>
        <IconButtonMenu
          menuItems={[]}
          iconButtonProps={{
            icon: "dots-vertical",
            onPress: onIconButtonPress,
            accessibilityLabel: "Open menu",
          }}
        />
      </PaperProvider>,
    );

    expect(screen.getByLabelText("Open menu")).toBeOnTheScreen();
    expect(screen.queryByText("No options")).not.toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Open menu"));

    expect(screen.getByText("No options")).toBeOnTheScreen();

    expect(onIconButtonPress).toHaveBeenCalledTimes(1);
  });
});
