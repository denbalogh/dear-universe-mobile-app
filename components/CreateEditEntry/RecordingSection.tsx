import React, { useCallback, useEffect, useState } from "react";
import RecordingControls, {
  UPDATE_INTERVAL,
} from "../RecordingControls/RecordingControls";
import useRecordingPermissions from "@/hooks/useRecordingPermissions";
import {
  Recording,
  RecordingOptionsPresets,
  RecordingStatus,
  setAudioModeAsync,
} from "expo-av/build/Audio";
import { format } from "date-fns";
import { normalizeMeteringForScale } from "../RecordingControls/utils";
import { StyleSheet, View, ViewProps } from "react-native";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { Button } from "react-native-paper";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import useAppState from "@/hooks/useAppState";
import { getCrashlytics } from "@react-native-firebase/crashlytics";

type Props = {
  onRecordingDone: (recordingUri: string) => void;
  recordingUri: string;
} & ViewProps;

const RecordingSection = ({
  onRecordingDone,
  recordingUri,
  ...viewProps
}: Props) => {
  const theme = useCustomTheme();
  const {
    granted: recordingPermissionsGranted,
    requestPermissions: requestRecordingPermissions,
  } = useRecordingPermissions();
  const { showConfirmDialog } = useConfirmDialog();

  const [recording, setRecording] = useState<Recording>();
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>();

  const startRecording = async () => {
    getCrashlytics().log("Setting audio mode");
    await setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    getCrashlytics().log("Creating recording");
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
      getCrashlytics().log("Pausing recording");
      await recording.pauseAsync();
    }
  }, [recording]);

  const continueRecording = async () => {
    if (recording) {
      getCrashlytics().log("Continuing recording");
      await recording.startAsync();
    }
  };

  const stopRecording = async () => {
    if (recording) {
      getCrashlytics().log("Stopping recording");
      await recording.stopAndUnloadAsync();
      await setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const fileUri = recording.getURI();

      if (fileUri) {
        onRecordingDone(fileUri);
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

  const handleRemoveRecording = () => {
    showConfirmDialog("Do you want to delete the recording?", () => {
      onRecordingDone("");
    });
  };

  const unloadRecording = useCallback(async () => {
    if (recording) {
      getCrashlytics().log("Unloading recording");
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

  return (
    <View {...viewProps}>
      {recordingUri ? (
        <>
          <AudioPlayer sourceUri={recordingUri} />
          <Button
            style={styles.deleteButton}
            icon="delete"
            mode="elevated"
            onPress={handleRemoveRecording}
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
  deleteButton: {
    marginTop: spacing.spaceMedium,
  },
});
