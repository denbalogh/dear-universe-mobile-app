import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import useRecordingPermissions from "@/hooks/useRecordingPermissions";
import logCrashlytics from "@/utils/logCrashlytics";
import {
  Recording,
  RecordingOptionsPresets,
  RecordingStatus,
  setAudioModeAsync,
} from "expo-av/build/Audio";
import React, { useCallback, useEffect, useState } from "react";
import RecordingControls, {
  UPDATE_INTERVAL,
} from "../../RecordingControls/RecordingControls";
import useAppState from "@/hooks/useAppState";
import { format } from "date-fns";
import { normalizeMeteringForScale } from "../../RecordingControls/utils";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import AudioPlayer from "@/components/AudioPlayer/AudioPlayer";
import { Button, IconButton } from "react-native-paper";
import { useCustomTheme } from "@/hooks/useCustomTheme";

const RecordingSection = () => {
  const theme = useCustomTheme();

  const {
    granted: recordingPermissionsGranted,
    requestPermissions: requestRecordingPermissions,
  } = useRecordingPermissions();
  const { showConfirmDialog } = useConfirmDialog();

  const [recording, setRecording] = useState<Recording>();
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>();

  const { setRecordingUri, recordingUri } = useEntryDraft();

  const startRecording = async () => {
    logCrashlytics("Setting audio mode");
    await setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    logCrashlytics("Creating recording");
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
      logCrashlytics("Pausing recording");
      await recording.pauseAsync();
    }
  }, [recording]);

  const continueRecording = async () => {
    if (recording) {
      logCrashlytics("Continuing recording");
      await recording.startAsync();
    }
  };

  const stopRecording = async () => {
    if (recording) {
      logCrashlytics("Stopping recording");
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
      logCrashlytics("Unloading recording");
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
    showConfirmDialog("Do you want to discard the recording?", unloadRecording);
  };

  const handleDiscardRecordingUri = () => {
    showConfirmDialog("Do you want to discard the recording?", () =>
      setRecordingUri(""),
    );
  };

  return (
    <View style={styles.wrapper}>
      {recordingUri ? (
        <>
          <AudioPlayer sourceUri={recordingUri} />
          <Button
            style={styles.deleteButton}
            icon="delete"
            mode="elevated"
            onPress={handleDiscardRecordingUri}
            textColor={theme.colors.error}
          >
            Discard recording
          </Button>
        </>
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
    paddingVertical: spacing.spaceMedium,
    paddingHorizontal: spacing.spaceSmall,
  },
  deleteButton: {
    marginTop: spacing.spaceMedium,
  },
});
