import { render, screen, userEvent } from "@testing-library/react-native";
import MoodSelector from "../MoodSelector";
import { moods } from "@/components/MoodColor/values";

describe("MoodSelector", () => {
  const onSubmitMock = jest.fn();
  const onBackPressMock = jest.fn();

  test("renders correctly", async () => {
    render(
      <MoodSelector
        initialSelected={["Happiness, Joy"]}
        onSubmit={onSubmitMock}
        onBackPress={onBackPressMock}
      />,
    );

    for (const mood of Object.keys(moods)) {
      if (mood === "Happiness, Joy") {
        expect(screen.getByLabelText(`Unselect ${mood}`)).toBeOnTheScreen();
      } else {
        expect(screen.getByLabelText(`Select ${mood}`)).toBeOnTheScreen();
      }
    }

    expect(screen.queryByText("Discard")).not.toBeOnTheScreen();
    expect(screen.getByText("Close")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByText("Close"));
    expect(onBackPressMock).toHaveBeenCalledTimes(1);

    await user.press(screen.getByText("Save"));
    expect(onSubmitMock).toHaveBeenCalledTimes(0); // It is disabled when not edited

    await user.press(screen.getByLabelText("Unselect Happiness, Joy"));
    await user.press(screen.getByLabelText("Select Excitement, Energy"));
    await user.press(screen.getByLabelText("Select Calmness, Relaxation"));

    expect(screen.queryByText("Close")).not.toBeOnTheScreen();
    expect(screen.getByText("Discard")).toBeOnTheScreen();

    expect(
      screen.queryByLabelText("Unselect Happiness, Joy"),
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByLabelText("Select Excitement, Energy"),
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByLabelText("Select Calmness, Relaxation"),
    ).not.toBeOnTheScreen();
    expect(screen.getByLabelText("Select Happiness, Joy")).toBeOnTheScreen();
    expect(
      screen.getByLabelText("Unselect Excitement, Energy"),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText("Unselect Calmness, Relaxation"));

    await user.press(screen.getByText("Discard"));
    expect(onBackPressMock).toHaveBeenCalledTimes(2);

    await user.press(screen.getByText("Save"));
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith([
      "Excitement, Energy",
      "Calmness, Relaxation",
    ]);

    await user.press(screen.getByLabelText("Go back"));
    expect(onBackPressMock).toHaveBeenCalledTimes(3);
  });
});
