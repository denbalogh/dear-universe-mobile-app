import { render, screen, userEvent } from "@testing-library/react-native";
import Controls from "../Controls";

describe("AudioPlayer/Controls", () => {
  test("renders correctly", async () => {
    const onPlayPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const on10SecForwardPressMock = jest.fn();
    const on10SecRewindPressMock = jest.fn();
    const onReloadPressMock = jest.fn();

    render(
      <Controls
        isLoading={false}
        isPlaying={false}
        currentTime="00:00"
        maxTime="05:00"
        onPlayPress={onPlayPressMock}
        onPausePress={onPausePressMock}
        on10SecForwardPress={on10SecForwardPressMock}
        on10SecRewindPress={on10SecRewindPressMock}
        failedToLoad={false}
        onReloadPress={onReloadPressMock}
      />,
    );

    expect(screen.getByLabelText("Current time")).toHaveTextContent("00:00");
    expect(screen.getByLabelText("Maximum time")).toHaveTextContent("05:00");

    expect(screen.getByLabelText("Play")).toBeOnTheScreen();
    expect(screen.queryByLabelText("Pause")).not.toBeOnTheScreen();

    expect(screen.getByLabelText("Rewind 10 seconds")).toBeOnTheScreen();
    expect(screen.getByLabelText("Forward 10 seconds")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Play"));
    expect(onPlayPressMock).toHaveBeenCalledTimes(1);

    await user.press(screen.getByLabelText("Rewind 10 seconds"));
    expect(on10SecRewindPressMock).toHaveBeenCalledTimes(1);

    await user.press(screen.getByLabelText("Forward 10 seconds"));
    expect(on10SecForwardPressMock).toHaveBeenCalledTimes(1);
  });

  test("renders correctly isPlaying and no times", async () => {
    const onPlayPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const on10SecForwardPressMock = jest.fn();
    const on10SecRewindPressMock = jest.fn();
    const onReloadPressMock = jest.fn();

    render(
      <Controls
        isLoading={false}
        isPlaying={true}
        onPlayPress={onPlayPressMock}
        onPausePress={onPausePressMock}
        on10SecForwardPress={on10SecForwardPressMock}
        on10SecRewindPress={on10SecRewindPressMock}
        failedToLoad={false}
        onReloadPress={onReloadPressMock}
      />,
    );

    expect(screen.getByLabelText("Current time")).toHaveTextContent("--:--");
    expect(screen.getByLabelText("Maximum time")).toHaveTextContent("--:--");

    expect(screen.queryByLabelText("Play")).not.toBeOnTheScreen();
    expect(screen.getByLabelText("Pause")).toBeOnTheScreen();

    expect(screen.getByLabelText("Rewind 10 seconds")).toBeOnTheScreen();
    expect(screen.getByLabelText("Forward 10 seconds")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Pause"));
    expect(onPausePressMock).toHaveBeenCalledTimes(1);

    await user.press(screen.getByLabelText("Rewind 10 seconds"));
    expect(on10SecRewindPressMock).toHaveBeenCalledTimes(1);

    await user.press(screen.getByLabelText("Forward 10 seconds"));
    expect(on10SecForwardPressMock).toHaveBeenCalledTimes(1);
  });

  test("renders correctly isLoading = true, isPlaying = true", async () => {
    const onPlayPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const on10SecForwardPressMock = jest.fn();
    const on10SecRewindPressMock = jest.fn();
    const onReloadPressMock = jest.fn();

    render(
      <Controls
        isLoading={true}
        isPlaying={true}
        onPlayPress={onPlayPressMock}
        onPausePress={onPausePressMock}
        on10SecForwardPress={on10SecForwardPressMock}
        on10SecRewindPress={on10SecRewindPressMock}
        failedToLoad={false}
        onReloadPress={onReloadPressMock}
      />,
    );

    expect(screen.queryByLabelText("Current time")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Maximum time")).not.toBeOnTheScreen();

    expect(screen.getByTestId("currentTimeLoading")).toBeOnTheScreen();
    expect(screen.getByTestId("maxTimeLoading")).toBeOnTheScreen();

    expect(screen.queryByLabelText("Play")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Pause")).not.toBeOnTheScreen();

    expect(screen.getByLabelText("Loading the recording")).toBeOnTheScreen();

    expect(screen.getByLabelText("Rewind 10 seconds")).toBeOnTheScreen();
    expect(screen.getByLabelText("Forward 10 seconds")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Rewind 10 seconds"));
    expect(on10SecRewindPressMock).toHaveBeenCalledTimes(0);

    await user.press(screen.getByLabelText("Forward 10 seconds"));
    expect(on10SecForwardPressMock).toHaveBeenCalledTimes(0);
  });

  test("renders correctly isLoading = true, isPlaying = false", async () => {
    const onPlayPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const on10SecForwardPressMock = jest.fn();
    const on10SecRewindPressMock = jest.fn();
    const onReloadPressMock = jest.fn();

    render(
      <Controls
        isLoading={true}
        isPlaying={false}
        onPlayPress={onPlayPressMock}
        onPausePress={onPausePressMock}
        on10SecForwardPress={on10SecForwardPressMock}
        on10SecRewindPress={on10SecRewindPressMock}
        failedToLoad={false}
        onReloadPress={onReloadPressMock}
      />,
    );

    expect(screen.queryByLabelText("Play")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Pause")).not.toBeOnTheScreen();

    expect(screen.getByLabelText("Loading the recording")).toBeOnTheScreen();
  });

  test("renders correctly failedLoading = true, isLoading = false", async () => {
    const onPlayPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const on10SecForwardPressMock = jest.fn();
    const on10SecRewindPressMock = jest.fn();
    const onReloadPressMock = jest.fn();

    render(
      <Controls
        isLoading={false}
        isPlaying={true}
        onPlayPress={onPlayPressMock}
        onPausePress={onPausePressMock}
        on10SecForwardPress={on10SecForwardPressMock}
        on10SecRewindPress={on10SecRewindPressMock}
        failedToLoad={true}
        onReloadPress={onReloadPressMock}
      />,
    );

    expect(screen.queryByLabelText("Current time")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Maximum time")).not.toBeOnTheScreen();

    expect(screen.getByTestId("currentTimeLoading")).toBeOnTheScreen();
    expect(screen.getByTestId("maxTimeLoading")).toBeOnTheScreen();

    expect(screen.queryByLabelText("Play")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Pause")).not.toBeOnTheScreen();
    expect(screen.getByLabelText("Reload")).toBeOnTheScreen();

    expect(screen.getByLabelText("Rewind 10 seconds")).toBeOnTheScreen();
    expect(screen.getByLabelText("Forward 10 seconds")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Reload"));
    expect(onReloadPressMock).toHaveBeenCalledTimes(1);

    await user.press(screen.getByLabelText("Rewind 10 seconds"));
    expect(on10SecRewindPressMock).toHaveBeenCalledTimes(0);

    await user.press(screen.getByLabelText("Forward 10 seconds"));
    expect(on10SecForwardPressMock).toHaveBeenCalledTimes(0);
  });

  test("renders correctly failedLoading = true, isLoading = true", async () => {
    const onPlayPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const on10SecForwardPressMock = jest.fn();
    const on10SecRewindPressMock = jest.fn();
    const onReloadPressMock = jest.fn();

    render(
      <Controls
        isLoading={true}
        isPlaying={false}
        onPlayPress={onPlayPressMock}
        onPausePress={onPausePressMock}
        on10SecForwardPress={on10SecForwardPressMock}
        on10SecRewindPress={on10SecRewindPressMock}
        failedToLoad={true}
        onReloadPress={onReloadPressMock}
      />,
    );

    expect(screen.queryByLabelText("Current time")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Maximum time")).not.toBeOnTheScreen();

    expect(screen.getByTestId("currentTimeLoading")).toBeOnTheScreen();
    expect(screen.getByTestId("maxTimeLoading")).toBeOnTheScreen();

    expect(screen.queryByLabelText("Play")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Pause")).not.toBeOnTheScreen();
    expect(screen.queryByLabelText("Reload")).not.toBeOnTheScreen();

    expect(screen.getByLabelText("Loading the recording")).toBeOnTheScreen();

    expect(screen.getByLabelText("Rewind 10 seconds")).toBeOnTheScreen();
    expect(screen.getByLabelText("Forward 10 seconds")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Rewind 10 seconds"));
    expect(on10SecRewindPressMock).toHaveBeenCalledTimes(0);

    await user.press(screen.getByLabelText("Forward 10 seconds"));
    expect(on10SecForwardPressMock).toHaveBeenCalledTimes(0);
  });
});
