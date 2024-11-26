import { render, screen, userEvent } from "@testing-library/react-native";
import ListItem from "../ListItem";
import { PaperProvider } from "react-native-paper";
import { themeLight } from "@/constants/theme";
import { format } from "date-fns";
import { formatDateId, parseDateId } from "@/utils/date";

describe("ListItem", () => {
  test("renders filled correctly", () => {
    render(
      <ListItem
        title="Hello, world!"
        dateId="16_10_2024"
        moods={["Anger, Frustration"]}
        onPress={() => {}}
      />,
    );

    expect(screen.getByLabelText("16th October 2024")).toBeOnTheScreen();
    expect(screen.getByLabelText("Wednesday")).toBeOnTheScreen();

    expect(screen.getByText("16")).toBeOnTheScreen();
    expect(screen.getByText("Wed")).toBeOnTheScreen();

    expect(screen.getByText("Hello, world!")).toBeOnTheScreen();
    expect(screen.getByLabelText("Moods during the day")).toBeOnTheScreen();
  });

  test("on press works", async () => {
    const onPress = jest.fn();

    render(
      <ListItem
        dateId="16_9_2024"
        moods={["Anger, Frustration"]}
        onPress={onPress}
        title="Title"
      />,
    );

    const user = userEvent.setup();
    await user.press(screen.getByTestId("ListItemPressable"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("add entries buttons render correctly and pressing works", async () => {
    const onAddTextEntryPressMock = jest.fn();
    const onAddRecordingEntryPressMock = jest.fn();
    const onAddImageEntryPressMock = jest.fn();
    const onPressMock = jest.fn();

    render(
      <ListItem
        title="Title"
        dateId="16_9_2024"
        moods={[]}
        onPress={onPressMock}
        empty={{
          onAddImageEntryPress: onAddImageEntryPressMock,
          onAddRecordingEntryPress: onAddRecordingEntryPressMock,
          onAddTextEntryPress: onAddTextEntryPressMock,
        }}
      />,
    );

    expect(screen.getByLabelText("Add text entry")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add recording entry")).toBeOnTheScreen();
    expect(screen.getByLabelText("Add image entry")).toBeOnTheScreen();

    const user = userEvent.setup();
    await user.press(screen.getByLabelText("Add text entry"));
    await user.press(screen.getByLabelText("Add recording entry"));
    await user.press(screen.getByLabelText("Add image entry"));

    expect(onPressMock).toHaveBeenCalledTimes(0);
    expect(onAddTextEntryPressMock).toHaveBeenCalledTimes(1);
    expect(onAddRecordingEntryPressMock).toHaveBeenCalledTimes(1);
    expect(onAddImageEntryPressMock).toHaveBeenCalledTimes(1);

    await user.press(screen.getByTestId("ListItemPressable"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test("today date has different color", () => {
    render(
      <PaperProvider theme={themeLight}>
        <ListItem
          dateId={formatDateId(new Date())}
          title="Title"
          moods={[]}
          onPress={() => {}}
        />
      </PaperProvider>,
    );

    let dateFormatted = `Today ${format(new Date(), "do LLLL yyyy")}`;

    expect(screen.getByLabelText(dateFormatted)).toBeOnTheScreen();
    expect(screen.getByLabelText(dateFormatted)).toHaveStyle({
      color: themeLight.colors.tertiary,
      fontWeight: "bold",
    });

    render(
      <PaperProvider theme={themeLight}>
        <ListItem
          dateId="16_9_2024"
          moods={[]}
          onPress={() => {}}
          title="Title"
        />
      </PaperProvider>,
    );

    dateFormatted = format(parseDateId("16_9_2024"), "do LLLL yyyy");

    expect(screen.getByLabelText(dateFormatted)).toBeOnTheScreen();
    expect(screen.getByLabelText(dateFormatted)).not.toHaveStyle({
      color: themeLight.colors.tertiary,
    });
  });
});
