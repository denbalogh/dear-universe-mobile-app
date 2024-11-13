import { spacing } from "@/constants/theme";
import { format } from "date-fns";
import { Audio } from "expo-av";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Snackbar } from "react-native-paper";
import Controls from "./Controls";
import DiscardDialog from "../DiscardDialog/DiscardDialog";
import { normalizeMeteringForScale } from "./utils";

type Props = {
  onRecordingFinished: (uri: string) => void;
  onBackPress: () => void;
};

const AudioRecorder = ({ onRecordingFinished, onBackPress }: Props) => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const isRecordingAllowed = useMemo(
    () => permissionResponse?.status === "granted",
    [permissionResponse],
  );

  const [isDiscardDialogVisible, setIsDiscardDialogVisible] = useState(false);
  const showDiscardDialog = () => setIsDiscardDialogVisible(true);
  const hideDiscardDialog = () => setIsDiscardDialogVisible(false);

  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);
  const onDismissSnackBar = () => setIsSnackBarVisible(false);
  const showSnackBar = () => setIsSnackBarVisible(true);

  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const [recordingStatus, setRecordingStatus] =
    useState<Audio.RecordingStatus>();

  const handleRequestPermissions = async () => {
    setIsLoading(true);
    const { canAskAgain, granted } = await requestPermission();
    if (!granted && !canAskAgain) {
      showSnackBar();
    }
    setIsLoading(false);
  };

  const startRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording, status } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
      setRecordingStatus,
      50,
    );

    setRecording(recording);
    setRecordingStatus(status);
  };

  const pauseRecording = async () => {
    if (recording) {
      await recording.pauseAsync();
    }
  };

  const continueRecording = async () => {
    if (recording) {
      await recording.startAsync();
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();

      if (uri) {
        onRecordingFinished(uri);
      }

      setRecording(undefined);
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

  const handleDiscard = () => {
    if (hasRecordingStarted) {
      if (isRecording) {
        pauseRecording();
      }
      showDiscardDialog();
    } else {
      onBackPress();
    }
  };

  const unloadRecordingAndBackPress = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      setRecording(undefined);
    }
    onBackPress();
  };

  return (
    <View style={styles.wrapper}>
      <IconButton icon="arrow-left" onPress={handleDiscard} />
      <Controls
        time={time}
        hasRecordingStarted={hasRecordingStarted}
        isRecording={isRecording}
        hasPermissions={isRecordingAllowed}
        isLoading={isLoading}
        onRequestPermissionsPress={handleRequestPermissions}
        onRecordPress={startRecording}
        onPausePress={pauseRecording}
        onStopPress={stopRecording}
        onDiscardPress={handleDiscard}
        onContinuePress={continueRecording}
        metering={normalizedMetering}
      />
      <DiscardDialog
        isVisible={isDiscardDialogVisible}
        hideDialog={hideDiscardDialog}
        text="Do you really wish to discard the recording?"
        onConfirm={unloadRecordingAndBackPress}
      />
      <Snackbar
        visible={isSnackBarVisible}
        onDismiss={onDismissSnackBar}
        icon="close"
        onIconPress={onDismissSnackBar}
      >
        The recording permission has been denied. To enable it, go to system
        settings.
      </Snackbar>
    </View>
  );
};

export default AudioRecorder;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  controlsWrapper: {
    width: "100%",
    alignItems: "center",
  },
  controls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: spacing.spaceMedium,
  },
  helperText: {
    marginVertical: spacing.spaceSmall,
  },
});
