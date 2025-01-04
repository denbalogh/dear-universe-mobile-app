import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { formatFullDate, parseDateId } from "@/utils/date";
import Controls, {
  UPDATE_INTERVAL,
} from "@/components/RecordingControls/RecordingControls";
import { Audio } from "expo-av";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { normalizeMeteringForScale } from "@/components/RecordingControls/utils";
import { format } from "date-fns";
import { Entry } from "@/models/Entry";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";
import { BSON } from "realm";
import { EntrySearchTermParams } from "@/types/entryTextScreen";
import { getInfoAsync, makeDirectoryAsync, moveAsync } from "expo-file-system";
import { RECORDINGS_DIR } from "@/constants/files";

const EditEntryRecordingScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { showSnackbar } = useSnackbar();

  const { dateId, entryId } = useLocalSearchParams<EntrySearchTermParams>();

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const [recording, setRecording] = useState<Audio.Recording>();
  const [recordingStatus, setRecordingStatus] =
    useState<Audio.RecordingStatus>();

  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const isRecordingAllowed = useMemo(
    () => permissionResponse?.status === "granted",
    [permissionResponse],
  );

  const handleRequestPermissions = async () => {
    const { canAskAgain, granted } = await requestPermission();
    if (!granted && !canAskAgain) {
      showSnackbar(
        "The recording permission has been denied. To grant it, go to system settings.",
      );
    }
  };

  const startRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording, status } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
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
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const fileURI = recording.getURI();

      if (fileURI) {
        const fileName = fileURI.split("/").pop();
        const newFileURI = `${RECORDINGS_DIR}${fileName}`;

        const { exists } = await getInfoAsync(RECORDINGS_DIR);

        if (!exists) {
          await makeDirectoryAsync(RECORDINGS_DIR);
        }

        await moveAsync({
          from: fileURI,
          to: newFileURI,
        });

        handleUpdateEntry(newFileURI);
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

  const unloadRecording = useCallback(
    async (back = false) => {
      if (recording) {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        setRecording(undefined);
      }

      if (back) {
        router.back();
      }
    },
    [recording, router],
  );

  const { showDiscardDialog } = useDiscardDialog();

  const handleShowDiscardDialog = useCallback(
    (back = true) => {
      showDiscardDialog({
        message: "Do you wish to discard the recording?",
        callback: () => unloadRecording(back),
      });
    },
    [showDiscardDialog, unloadRecording],
  );

  const handleBackPress = (back = true) => {
    if (hasRecordingStarted) {
      if (isRecording) {
        pauseRecording();
      }
      handleShowDiscardDialog(back);
    } else {
      router.back();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (hasRecordingStarted) {
          if (isRecording) {
            pauseRecording();
          }
          handleShowDiscardDialog();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [
      hasRecordingStarted,
      isRecording,
      pauseRecording,
      handleShowDiscardDialog,
    ]),
  );

  const handleUpdateEntry = (recordingURI: string) => {
    if (entryObject === null) {
      return;
    }

    realm.write(() => {
      entryObject.recordingURI = recordingURI;
    });

    router.back();
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={() => handleBackPress(true)} />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.surface,
        }}
      />
      <View style={styles.contentWrapper}>
        <Text variant="titleMedium">{formatFullDate(parseDateId(dateId))}</Text>
        <Text variant="headlineLarge" style={styles.headline}>
          Adding recording
        </Text>
        <Controls
          time={time}
          hasRecordingStarted={hasRecordingStarted}
          isRecording={isRecording}
          hasPermissions={isRecordingAllowed}
          onRequestPermissionsPress={handleRequestPermissions}
          onRecordPress={startRecording}
          onPausePress={pauseRecording}
          onStopPress={stopRecording}
          onDiscardPress={() => handleBackPress(false)}
          onContinuePress={continueRecording}
          metering={normalizedMetering}
        />
      </View>
    </View>
  );
};

export default EditEntryRecordingScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    padding: spacing.spaceMedium,
  },
  headline: {
    marginBottom: spacing.spaceLarge,
  },
});
