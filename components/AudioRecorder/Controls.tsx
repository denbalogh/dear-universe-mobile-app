import { roundness, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FAB, IconButton, Text, useTheme } from "react-native-paper";

type Props = {
  time: string;
  isLoading: boolean;
  isRecording: boolean;
  hasRecordingStarted: boolean;
  onRecordPress: () => void;
  onPausePress: () => void;
  onContinuePress: () => void;
  onStopPress: () => void;
  onDiscardPress: () => void;
};

const Controls = ({
  time,
  isLoading,
  isRecording,
  hasRecordingStarted,
  onContinuePress,
  onDiscardPress,
  onPausePress,
  onRecordPress,
  onStopPress,
}: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={styles.timeWrapper}>
        {isLoading || !hasRecordingStarted ? (
          <View
            style={[
              styles.placeholderTime,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            testID="placeholder-time"
          />
        ) : (
          <Text variant="displayLarge" style={styles.time}>
            {time}
          </Text>
        )}
      </View>
      <View style={styles.controlsWrapper}>
        <View style={styles.controls}>
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            disabled={!hasRecordingStarted || isRecording}
            onPress={onDiscardPress}
            accessibilityLabel="Discard recording"
          />
          {!hasRecordingStarted ? (
            <FAB
              onPress={onRecordPress}
              icon="record"
              variant="surface"
              size="large"
              loading={isLoading}
              disabled={isLoading}
              accessibilityLabel="Start recording"
            />
          ) : isRecording ? (
            <FAB
              onPress={onPausePress}
              icon="pause"
              variant="surface"
              size="large"
              accessibilityLabel="Pause recording"
              mode="flat"
            />
          ) : (
            <FAB
              onPress={onContinuePress}
              icon="record"
              variant="surface"
              size="large"
              accessibilityLabel="Continue recording"
              mode="flat"
            />
          )}
          <IconButton
            icon="stop"
            disabled={!hasRecordingStarted || isRecording}
            onPress={onStopPress}
            mode="contained"
            accessibilityLabel="Stop recording"
          />
        </View>
        {isLoading ? (
          <View
            style={[
              styles.placeholderHelperText,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            testID="placeholder-helper-text"
          />
        ) : !hasRecordingStarted ? (
          <Text style={styles.helperText}>Press to start recording</Text>
        ) : isRecording ? (
          <Text style={styles.helperText}>Press to pause recording</Text>
        ) : (
          <Text style={styles.helperText}>Press to continue recording</Text>
        )}
      </View>
    </View>
  );
};

export default Controls;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  timeWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  time: {
    textAlign: "center",
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
  placeholderTime: {
    width: 130,
    height: 45,
    alignSelf: "center",
    borderRadius: roundness,
  },
  placeholderHelperText: {
    width: 160,
    height: 15,
    backgroundColor: "red",
    marginVertical: spacing.spaceSmall,
    borderRadius: roundness,
  },
});
