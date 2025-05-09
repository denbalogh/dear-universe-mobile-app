import { useConfirmDialog } from "@/common/providers/ConfirmDialogProvider";
import useRecordingPermissions from "@/common/hooks/useRecordingPermissions";
import {
  Recording,
  RecordingOptionsPresets,
  RecordingStatus,
  setAudioModeAsync,
} from "expo-av/build/Audio";
import React, { useCallback, useEffect, useState } from "react";
import RecordingControls, {
  UPDATE_INTERVAL,
} from "../EntriesList/Entry/RecordingControls/RecordingControls";
import useAppState from "@/common/hooks/useAppState";
import { format } from "date-fns";
import { normalizeMeteringForScale } from "../EntriesList/Entry/RecordingControls/utils";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/common/constants/theme";
import AudioPlayer from "@/common/components/AudioPlayer/AudioPlayer";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";

const RecordingSection = () => {
  const {
    granted: recordingPermissionsGranted,
    requestPermissions: requestRecordingPermissions,
  } = useRecordingPermissions();
  const { showDialog } = useConfirmDialog();

  const [recording, setRecording] = useState<Recording>();
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>();

  const { setRecordingUri, recordingUri } = useEntryEditor();

  const startRecording = async () => {
    await setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording, status } = await Recording.createAsync(
      RecordingOptionsPresets.HIGH_QUALITY,
      setRecordingStatus,
      UPDATE_INTERVAL,
    );

    setRecording(recording);
    setRecordingStatus(status);
  };

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

  const handleDiscardRecordingUri = () => {
    showDialog("Do you want to discard the recording?", () =>
      setRecordingUri(""),
    );
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingVertical: recordingUri
            ? spacing.spaceSmall
            : spacing.spaceMedium,
        },
      ]}
    >
      {recordingUri ? (
        <AudioPlayer
          sourceUri={recordingUri}
          onDiscard={handleDiscardRecordingUri}
        />
      ) : (
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
      )}
    </View>
  );
};

export default RecordingSection;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.spaceSmall,
  },
  deleteButton: {
    marginTop: spacing.spaceMedium,
  },
});
