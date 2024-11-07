import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import TitleDescriptionEditor from "../TitleDescriptionEditor";
import { PaperProvider } from "react-native-paper";
import { themeLight } from "@/constants/theme";

jest.useFakeTimers();

describe("TitleDescriptionEditor", () => {
  test("renders correctly", async () => {
    const onSubmitMock = jest.fn();
    const onBackPressMock = jest.fn();

    render(
      <PaperProvider theme={themeLight}>
        <TitleDescriptionEditor
          initialTitle="Title"
          initialDescription="Description"
          onSubmit={onSubmitMock}
          onBackPress={onBackPressMock}
        />
      </PaperProvider>,
    );

    expect(screen.getByDisplayValue("Title")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("Description")).toBeOnTheScreen();

    expect(screen.queryByText("Discard")).not.toBeOnTheScreen();
    expect(screen.getByText("Close")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Go back"));
    expect(onBackPressMock).toHaveBeenCalledTimes(1);

    await user.press(screen.getByText("Close"));
    expect(onBackPressMock).toHaveBeenCalledTimes(2);

    await user.press(screen.getByText("Save"));
    expect(onSubmitMock).toHaveBeenCalledTimes(0); // It is disabled when not edited

    await user.type(screen.getByDisplayValue("Title"), " test");
    await user.type(screen.getByDisplayValue("Description"), " test");

    expect(screen.queryByText("Close")).not.toBeOnTheScreen();
    expect(screen.getByText("Discard")).toBeOnTheScreen();

    await user.press(screen.getByText("Discard"));
    expect(onBackPressMock).toHaveBeenCalledTimes(2); // Opens modal

    let modal = await screen.findByText(
      "Do you really wish to discard the changes?",
    );
    expect(modal).toBeOnTheScreen();

    await user.press(screen.getByText("Confirm"));
    expect(onBackPressMock).toHaveBeenCalledTimes(3); // Confirms modal

    await user.press(screen.getByText("Close"));

    await waitFor(() => {
      expect(
        screen.queryByText("Do you really wish to discard the changes?"),
      ).not.toBeOnTheScreen();
    });

    await user.press(screen.getByText("Save"));
    expect(onSubmitMock).toHaveBeenCalledWith({
      title: "Title test",
      description: "Description test",
    });

    await user.press(screen.getByLabelText("Go back"));
    expect(onBackPressMock).toHaveBeenCalledTimes(3);

    modal = await screen.findByText(
      "Do you really wish to discard the changes?",
    );
    expect(modal).toBeOnTheScreen();
  });
});
