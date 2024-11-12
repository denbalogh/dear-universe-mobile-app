import { render, screen, userEvent } from "@testing-library/react-native";
import Controls from "../Controls";

describe("AudioRecorder/Controls", () => {
  console.error = jest.fn();

  test("basic", async () => {
    const onRecordPressMock = jest.fn();
    const onStopPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const onContinuePressMock = jest.fn();
    const onDiscardPressMock = jest.fn();

    render(
      <Controls
        time="00:00"
        isLoading={false}
        isRecording={false}
        hasRecordingStarted={false}
        onRecordPress={onRecordPressMock}
        onStopPress={onStopPressMock}
        onPausePress={onPausePressMock}
        onContinuePress={onContinuePressMock}
        onDiscardPress={onDiscardPressMock}
      />,
    );

    expect(screen.getByTestId("placeholder-time")).toBeOnTheScreen();

    expect(screen.getByLabelText("Start recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Stop recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Discard recording")).toBeOnTheScreen();

    expect(screen.getByText("Press to start recording")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Start recording"));
    await user.press(screen.getByLabelText("Stop recording"));
    await user.press(screen.getByLabelText("Discard recording"));

    expect(onRecordPressMock).toHaveBeenCalledTimes(1);
    expect(onStopPressMock).toHaveBeenCalledTimes(0);
    expect(onDiscardPressMock).toHaveBeenCalledTimes(0);
  });

  test("loading", async () => {
    const onRecordPressMock = jest.fn();
    const onStopPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const onContinuePressMock = jest.fn();
    const onDiscardPressMock = jest.fn();

    render(
      <Controls
        time="00:00"
        isLoading={true}
        isRecording={false}
        hasRecordingStarted={false}
        onRecordPress={onRecordPressMock}
        onStopPress={onStopPressMock}
        onPausePress={onPausePressMock}
        onContinuePress={onContinuePressMock}
        onDiscardPress={onDiscardPressMock}
      />,
    );

    expect(screen.getByTestId("placeholder-time")).toBeOnTheScreen();

    expect(screen.getByLabelText("Start recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Stop recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Discard recording")).toBeOnTheScreen();

    expect(screen.getByTestId("placeholder-helper-text")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Start recording"));
    await user.press(screen.getByLabelText("Stop recording"));
    await user.press(screen.getByLabelText("Discard recording"));

    expect(onRecordPressMock).toHaveBeenCalledTimes(0);
    expect(onStopPressMock).toHaveBeenCalledTimes(0);
    expect(onDiscardPressMock).toHaveBeenCalledTimes(0);
  });

  test("recording", async () => {
    const onRecordPressMock = jest.fn();
    const onStopPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const onContinuePressMock = jest.fn();
    const onDiscardPressMock = jest.fn();

    render(
      <Controls
        time="00:00"
        isLoading={false}
        isRecording={true}
        hasRecordingStarted={true}
        onRecordPress={onRecordPressMock}
        onStopPress={onStopPressMock}
        onPausePress={onPausePressMock}
        onContinuePress={onContinuePressMock}
        onDiscardPress={onDiscardPressMock}
      />,
    );

    expect(screen.getByText("00:00")).toBeOnTheScreen();

    expect(screen.getByLabelText("Pause recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Stop recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Discard recording")).toBeOnTheScreen();

    expect(screen.getByText("Press to pause recording")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Pause recording"));
    await user.press(screen.getByLabelText("Stop recording"));
    await user.press(screen.getByLabelText("Discard recording"));

    expect(onPausePressMock).toHaveBeenCalledTimes(1);
    expect(onStopPressMock).toHaveBeenCalledTimes(0);
    expect(onDiscardPressMock).toHaveBeenCalledTimes(0);
  });

  test("paused", async () => {
    const onRecordPressMock = jest.fn();
    const onStopPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const onContinuePressMock = jest.fn();
    const onDiscardPressMock = jest.fn();

    render(
      <Controls
        time="00:00"
        isLoading={false}
        isRecording={false}
        hasRecordingStarted={true}
        onRecordPress={onRecordPressMock}
        onStopPress={onStopPressMock}
        onPausePress={onPausePressMock}
        onContinuePress={onContinuePressMock}
        onDiscardPress={onDiscardPressMock}
      />,
    );

    expect(screen.getByText("00:00")).toBeOnTheScreen();

    expect(screen.getByLabelText("Continue recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Stop recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Discard recording")).toBeOnTheScreen();

    expect(screen.getByText("Press to continue recording")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Continue recording"));
    await user.press(screen.getByLabelText("Stop recording"));
    await user.press(screen.getByLabelText("Discard recording"));

    expect(onContinuePressMock).toHaveBeenCalledTimes(1);
    expect(onStopPressMock).toHaveBeenCalledTimes(1);
    expect(onDiscardPressMock).toHaveBeenCalledTimes(1);
  });
});
