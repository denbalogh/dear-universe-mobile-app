import { render, screen, userEvent } from "@testing-library/react-native";
import Controls from "../RecordingControls";

describe("AudioRecorder/Controls", () => {
  console.error = jest.fn();

  test("basic", async () => {
    const onRecordPressMock = jest.fn();
    const onStopPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const onContinuePressMock = jest.fn();
    const onDiscardPressMock = jest.fn();
    const onRequestPermissionsPressMock = jest.fn();

    render(
      <Controls
        time="00:00"
        isRecording={false}
        hasRecordingStarted={false}
        onRecordPress={onRecordPressMock}
        onStopPress={onStopPressMock}
        onPausePress={onPausePressMock}
        onContinuePress={onContinuePressMock}
        onDiscardPress={onDiscardPressMock}
        hasPermissions={true}
        onRequestPermissionsPress={onRequestPermissionsPressMock}
      />,
    );

    expect(screen.queryByText("Pause | 00:00")).not.toBeOnTheScreen();
    expect(screen.queryByTestId("metering-animated")).not.toBeOnTheScreen();

    expect(screen.getByLabelText("Start recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Stop recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Discard recording")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Start recording"));
    await user.press(screen.getByLabelText("Stop recording"));
    await user.press(screen.getByLabelText("Discard recording"));

    expect(onRecordPressMock).toHaveBeenCalledTimes(1);
    expect(onStopPressMock).toHaveBeenCalledTimes(0);
    expect(onDiscardPressMock).toHaveBeenCalledTimes(0);
  });

  test("recording", async () => {
    const onRecordPressMock = jest.fn();
    const onStopPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const onContinuePressMock = jest.fn();
    const onDiscardPressMock = jest.fn();
    const onRequestPermissionsPressMock = jest.fn();

    render(
      <Controls
        time="00:00"
        isRecording={true}
        hasRecordingStarted={true}
        onRecordPress={onRecordPressMock}
        onStopPress={onStopPressMock}
        onPausePress={onPausePressMock}
        onContinuePress={onContinuePressMock}
        onDiscardPress={onDiscardPressMock}
        hasPermissions={true}
        onRequestPermissionsPress={onRequestPermissionsPressMock}
      />,
    );

    expect(screen.getByText("Pause | 00:00")).toBeOnTheScreen();
    expect(screen.getByTestId("metering-animated")).toBeOnTheScreen();

    expect(screen.getByLabelText("Pause recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Stop recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Discard recording")).toBeOnTheScreen();

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
    const onRequestPermissionsPressMock = jest.fn();

    render(
      <Controls
        time="00:00"
        isRecording={false}
        hasRecordingStarted={true}
        onRecordPress={onRecordPressMock}
        onStopPress={onStopPressMock}
        onPausePress={onPausePressMock}
        onContinuePress={onContinuePressMock}
        onDiscardPress={onDiscardPressMock}
        hasPermissions={true}
        onRequestPermissionsPress={onRequestPermissionsPressMock}
      />,
    );

    expect(screen.queryByText("Pause | 00:00")).not.toBeOnTheScreen();
    expect(screen.getByTestId("metering-animated")).toBeOnTheScreen();

    expect(screen.getByLabelText("Continue recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Stop recording")).toBeOnTheScreen();
    expect(screen.getByLabelText("Discard recording")).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Continue recording"));
    await user.press(screen.getByLabelText("Stop recording"));
    await user.press(screen.getByLabelText("Discard recording"));

    expect(onContinuePressMock).toHaveBeenCalledTimes(1);
    expect(onStopPressMock).toHaveBeenCalledTimes(1);
    expect(onDiscardPressMock).toHaveBeenCalledTimes(1);
  });

  test("no permissions", async () => {
    const onRecordPressMock = jest.fn();
    const onStopPressMock = jest.fn();
    const onPausePressMock = jest.fn();
    const onContinuePressMock = jest.fn();
    const onDiscardPressMock = jest.fn();
    const onRequestPermissionsPressMock = jest.fn();

    render(
      <Controls
        time="00:00"
        isRecording={false}
        hasRecordingStarted={false}
        onRecordPress={onRecordPressMock}
        onStopPress={onStopPressMock}
        onPausePress={onPausePressMock}
        onContinuePress={onContinuePressMock}
        onDiscardPress={onDiscardPressMock}
        hasPermissions={false}
        onRequestPermissionsPress={onRequestPermissionsPressMock}
      />,
    );

    expect(screen.queryByTestId("metering-animated")).not.toBeOnTheScreen();

    expect(
      screen.getByLabelText("Request recording permission"),
    ).toBeOnTheScreen();

    const user = userEvent.setup();

    await user.press(screen.getByLabelText("Request recording permission"));

    expect(onRequestPermissionsPressMock).toHaveBeenCalledTimes(1);
  });
});
