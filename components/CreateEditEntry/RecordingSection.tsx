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
  const { granted, requestPermissions } = useRecordingPermissions();
  const { showConfirmDialog } = useConfirmDialog();

  const [recording, setRecording] = useState<Recording>();
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>();

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
        onRecordingDone(fileUri);
      }
    }
  };

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
          hasPermissions={granted}
          onRequestPermissionsPress={requestPermissions}
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
