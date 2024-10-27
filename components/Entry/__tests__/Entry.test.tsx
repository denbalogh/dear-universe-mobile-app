import { render, screen, userEvent } from "@testing-library/react-native";
import Entry from "../Entry";
import { PaperProvider } from "react-native-paper";

describe("Entry", () => {
  console.error = jest.fn();

  test("renders correctly", async () => {
    const onMoodsPress = jest.fn();
    const onMoveToPress = jest.fn();
    const onDeletePress = jest.fn();
    const onTitlePress = jest.fn();
    const onTextPress = jest.fn();

    const moveMenuItems = [
      {
        title: "Move to",
        onPress: onMoveToPress,
      },
    ];
    const optionsMenuItems = [
      {
        title: "Delete",
        onPress: onDeletePress,
      },
    ];

    render(
      <PaperProvider>
        <Entry
          title={{
            onPress: onTitlePress,
            text: "Title",
          }}
          text={{
            onPress: onTextPress,
            text: "Text",
          }}
          moods={["Happiness, Joy"]}
          onMoodsPress={onMoodsPress}
          moveMenuItems={moveMenuItems}
          optionsMenuItems={optionsMenuItems}
        />
      </PaperProvider>,
    );

    expect(screen.getByLabelText("Edit title")).toBeOnTheScreen();
    expect(screen.getByText("Title")).toBeOnTheScreen();
    expect(screen.getByLabelText("Edit title")).toContainElement(
      screen.getByText("Title"),
    );

    expect(screen.getByLabelText("Edit text")).toBeOnTheScreen();
    expect(screen.getByText("Text")).toBeOnTheScreen();
    expect(screen.getByLabelText("Edit text")).toContainElement(
      screen.getByText("Text"),
    );

    expect(screen.getByLabelText("Change moods")).toBeOnTheScreen();

    expect(screen.getByLabelText("Move entry menu")).toBeOnTheScreen();
    expect(screen.getByLabelText("Options menu")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Edit title"));
    expect(onTitlePress).toHaveBeenCalled();

    await user.press(screen.getByLabelText("Edit text"));
    expect(onTextPress).toHaveBeenCalled();

    await user.press(screen.getByLabelText("Change moods"));
    expect(onMoodsPress).toHaveBeenCalled();

    await user.press(screen.getByLabelText("Move entry menu"));

    const moveToButton = await screen.findByText("Move to");
    expect(moveToButton).toBeOnTheScreen();

    await user.press(screen.getByText("Move to"));
    expect(onMoveToPress).toHaveBeenCalled();

    await user.press(screen.getByLabelText("Options menu"));

    const deleteButton = await screen.findByText("Delete");
    expect(deleteButton).toBeOnTheScreen();

    await user.press(screen.getByText("Delete"));
    expect(onDeletePress).toHaveBeenCalled();
  });

  test("renders correctly without title, text, moods and menus", async () => {
    const onMoodsPress = jest.fn();

    render(
      <PaperProvider>
        <Entry
          moods={[]}
          onMoodsPress={onMoodsPress}
          moveMenuItems={[]}
          optionsMenuItems={[]}
        />
      </PaperProvider>,
    );

    expect(screen.queryByLabelText("Edit title")).not.toBeOnTheScreen();
    expect(screen.queryByText("Title")).not.toBeOnTheScreen();

    expect(screen.queryByLabelText("Edit text")).not.toBeOnTheScreen();
    expect(screen.queryByText("Text")).not.toBeOnTheScreen();

    expect(screen.getByText("Pick moods")).toBeOnTheScreen();

    expect(screen.queryByLabelText("Move entry menu")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Options menu")).not.toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByText("Pick moods"));
    expect(onMoodsPress).toHaveBeenCalled();
  });
});
