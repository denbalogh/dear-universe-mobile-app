import { render, screen, userEvent } from "@testing-library/react-native";
import ListItem from "../ListItem";
import { PaperProvider } from "react-native-paper";
import { themeLight } from "@/constants/theme";
import { format, fromUnixTime, getUnixTime } from "date-fns";

describe("ListItem", () => {
  test("renders filled correctly", () => {
    render(
      <ListItem
        excerpt="Hello, world!"
        timestamp={1729090205}
        stats={{ texts: 1, recordings: 2, images: 3 }}
        moods={["Anger, Frustration"]}
        onPress={() => {}}
        onAddTextEntryPress={() => {}}
        onAddRecordingEntryPress={() => {}}
        onAddImageEntryPress={() => {}}
      />,
    );

    expect(screen.getByLabelText("16th October 2024")).toBeOnTheScreen();
    expect(screen.getByLabelText("Wednesday")).toBeOnTheScreen();

    expect(screen.getByText("16")).toBeOnTheScreen();
    expect(screen.getByText("Wed")).toBeOnTheScreen();

    expect(screen.getByText("Hello, world!")).toBeOnTheScreen();
    expect(screen.getByLabelText("Moods during the day")).toBeOnTheScreen();

    expect(screen.getByLabelText("Number of text entries")).toBeOnTheScreen();
    expect(screen.getByLabelText("Number of text entries")).toContainElement(
      screen.getByText("1"),
    );

    expect(
      screen.getByLabelText("Number of recording entries"),
    ).toBeOnTheScreen();
    expect(
      screen.getByLabelText("Number of recording entries"),
    ).toContainElement(screen.getByText("2"));

    expect(screen.getByLabelText("Number of image entries")).toBeOnTheScreen();
    expect(screen.getByLabelText("Number of image entries")).toContainElement(
      screen.getByText("3"),
    );
  });

  test("renders missing excerpt, moods and text/recording stats correctly", () => {
    render(
      <ListItem
        timestamp={1729090205}
        stats={{ texts: 0, recordings: 0, images: 5 }}
        moods={[]}
        onPress={() => {}}
        onAddTextEntryPress={() => {}}
        onAddRecordingEntryPress={() => {}}
        onAddImageEntryPress={() => {}}
      />,
    );

    expect(screen.getByText("No description provided")).toBeOnTheScreen();
    expect(
      screen.queryByLabelText("Moods during the day"),
    ).not.toBeOnTheScreen();

    expect(
      screen.queryByLabelText("Number of text entries"),
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByLabelText("Number of recording entries"),
    ).not.toBeOnTheScreen();

    expect(screen.getByLabelText("Number of image entries")).toBeOnTheScreen();
    expect(screen.getByLabelText("Number of image entries")).toContainElement(
      screen.getByText("5"),
    );
  });

  test("on press works", async () => {
    const onPress = jest.fn();

    render(
      <ListItem
        timestamp={1729268449}
        stats={{ texts: 1, recordings: 2, images: 3 }}
        moods={["Anger, Frustration"]}
        onPress={onPress}
        onAddTextEntryPress={() => {}}
        onAddRecordingEntryPress={() => {}}
        onAddImageEntryPress={() => {}}
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
        timestamp={1729268449}
        stats={{ texts: 0, recordings: 0, images: 0 }}
        moods={[]}
        onPress={onPressMock}
        onAddTextEntryPress={onAddTextEntryPressMock}
        onAddRecordingEntryPress={onAddRecordingEntryPressMock}
        onAddImageEntryPress={onAddImageEntryPressMock}
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
          timestamp={getUnixTime(new Date())}
          stats={{ texts: 0, recordings: 0, images: 0 }}
          moods={[]}
          onPress={() => {}}
          onAddTextEntryPress={() => {}}
          onAddRecordingEntryPress={() => {}}
          onAddImageEntryPress={() => {}}
        />
      </PaperProvider>,
    );

    let dateFormatted = `Today ${format(new Date(), "do LLLL yyyy")}`;

    expect(screen.getByLabelText(dateFormatted)).toBeOnTheScreen();
    expect(screen.getByLabelText(dateFormatted)).toHaveStyle({
      color: themeLight.colors.tertiary,
    });

    render(
      <PaperProvider theme={themeLight}>
        <ListItem
          timestamp={1729090205}
          stats={{ texts: 0, recordings: 0, images: 0 }}
          moods={[]}
          onPress={() => {}}
          onAddTextEntryPress={() => {}}
          onAddRecordingEntryPress={() => {}}
          onAddImageEntryPress={() => {}}
        />
      </PaperProvider>,
    );

    dateFormatted = format(fromUnixTime(1729090205), "do LLLL yyyy");

    expect(screen.getByLabelText(dateFormatted)).toBeOnTheScreen();
    expect(screen.getByLabelText(dateFormatted)).not.toHaveStyle({
      color: themeLight.colors.tertiary,
    });
  });

  test("loading state renders correctly", async () => {
    const onPress = jest.fn();

    render(
      <ListItem
        isLoading={true}
        timestamp={1729090205}
        stats={{ texts: 0, recordings: 0, images: 0 }}
        moods={["Anger, Frustration"]}
        onPress={onPress}
        onAddTextEntryPress={() => {}}
        onAddRecordingEntryPress={() => {}}
        onAddImageEntryPress={() => {}}
      />,
    );

    expect(screen.getByLabelText("16th October 2024")).toBeOnTheScreen();
    expect(screen.getByLabelText("Wednesday")).toBeOnTheScreen();

    expect(screen.getByText("16")).toBeOnTheScreen();
    expect(screen.getByText("Wed")).toBeOnTheScreen();

    expect(screen.queryByTestId("ListItemPressable")).not.toBeOnTheScreen();
    expect(screen.getByTestId("LoadingWrapper")).toBeOnTheScreen();

    const user = userEvent.setup();
    await user.press(screen.getByTestId("LoadingWrapper"));

    expect(onPress).toHaveBeenCalledTimes(0);

    expect(screen.getByTestId("LoadingExcerpt")).toBeOnTheScreen();
    expect(screen.getByTestId("LoadingStats")).toBeOnTheScreen();
    expect(screen.getByTestId("LoadingMoodComposite")).toBeOnTheScreen();
  });
});
