import { useConfirmDialog } from "@/common/providers/ConfirmDialogProvider";
import useRecordingPermissions from "@/common/hooks/useRecordingPermissions";
import {
  Recording as AVRecording,
  RecordingOptionsPresets,
  RecordingStatus,
  setAudioModeAsync,
} from "expo-av/build/Audio";
import React, { useCallback, useEffect, useState } from "react";
import useAppState from "@/common/hooks/useAppState";
import { format } from "date-fns";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";
import { UPDATE_INTERVAL } from "@/screens/DayScreen/EntriesList/Entry/RecordingControls/RecordingControls";
import { normalizeMeteringForScale } from "@/screens/DayScreen/EntriesList/Entry/RecordingControls/utils";
import RecordingControls from "@/screens/DayScreen/EntriesList/Entry/RecordingControls/RecordingControls";

const Recording = () => {
  const {
    granted: recordingPermissionsGranted,
    requestPermissions: requestRecordingPermissions,
  } = useRecordingPermissions();
  const { showDialog } = useConfirmDialog();

  const [recording, setRecording] = useState<AVRecording>();
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>();

  const { setRecordingUri } = useEntryEditor();

  const startRecording = useCallback(async () => {
    await setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording, status } = await AVRecording.createAsync(
      RecordingOptionsPresets.HIGH_QUALITY,
      setRecordingStatus,
      UPDATE_INTERVAL,
    );

    setRecording(recording);
    setRecordingStatus(status);
  }, []);

  const pauseRecording = useCallback(async () => {
    if (recording) {
      await recording.pauseAsync();
    }
  }, [recording]);

  const continueRecording = async () => {
    if (recording) {
      await recording.startAsync();
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const fileUri = recording.getURI();

      if (fileUri) {
        setRecordingUri(fileUri);
      }
    }
  };

  const appState = useAppState();

  useEffect(() => {
    if (appState !== "active") {
      pauseRecording();
    }
  }, [appState, pauseRecording]);

  const {
    durationMillis = 1,
    isRecording = false,
    isDoneRecording = false,
    metering = -160, // Range from -160 to 0
  } = recordingStatus || {};

  const hasRecordingStarted = !!recording && !isDoneRecording;
  const time = format(new Date(durationMillis), "mm:ss");
  const normalizedMetering = normalizeMeteringForScale(metering);

  const unloadRecording = useCallback(async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      setRecording(undefined);
    }
  }, [recording]);

  // Unload recording when component unmounts
  useEffect(() => {
    return () => {
      unloadRecording();
    };
  }, [unloadRecording]);

  const handleDiscardRecording = () => {
    showDialog("Do you want to discard the recording?", unloadRecording);
  };

  return (
    <RecordingControls
      time={time}
      hasRecordingStarted={hasRecordingStarted}
      isRecording={isRecording}
      hasPermissions={recordingPermissionsGranted}
      onRequestPermissionsPress={requestRecordingPermissions}
      onRecordPress={startRecording}
      onPausePress={pauseRecording}
      onStopPress={stopRecording}
      onDiscardPress={handleDiscardRecording}
      onContinuePress={continueRecording}
      metering={normalizedMetering}
    />
  );
};

export default Recording;
