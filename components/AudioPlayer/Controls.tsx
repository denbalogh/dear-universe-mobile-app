import { roundness, sizing, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

const TimePlaceholder = (props: ViewProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.timePlaceholder,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
      {...props}
    />
  );
};

type Props = {
  isLoading: boolean;
  isPlaying: boolean;
  onPlayPress: () => void;
  onPausePress: () => void;
  on10SecRewindPress: () => void;
  on10SecForwardPress: () => void;
  currentTime?: string;
  maxTime?: string;
};

const Controls = ({
  isLoading,
  isPlaying,
  onPausePress,
  onPlayPress,
  on10SecForwardPress,
  on10SecRewindPress,
  currentTime = "--:--",
  maxTime = "--:--",
}: Props) => {
  return (
    <View style={styles.wrapper}>
      {isLoading ? (
        <TimePlaceholder testID="currentTimeLoading" />
      ) : (
        <Text
          variant="bodySmall"
          style={styles.time}
          accessibilityLabel="Current time"
        >
          {currentTime}
        </Text>
      )}
      <View style={styles.controlsWrapper}>
        <IconButton
          icon="rewind-10"
          size={sizing.sizeMedium}
          onPress={on10SecRewindPress}
          disabled={isLoading}
          accessibilityLabel="Rewind 10 seconds"
        />
        {isPlaying ? (
          <IconButton
            icon="pause"
            size={sizing.sizeLarge}
            onPress={onPausePress}
            style={styles.playPauseIconButton}
            disabled={isLoading}
            accessibilityLabel="Pause"
          />
        ) : (
          <IconButton
            icon="play"
            size={sizing.sizeLarge}
            onPress={onPlayPress}
            style={styles.playPauseIconButton}
            disabled={isLoading}
            accessibilityLabel="Play"
          />
        )}
        <IconButton
          icon="fast-forward-10"
          size={sizing.sizeMedium}
          onPress={on10SecForwardPress}
          disabled={isLoading}
          accessibilityLabel="Forward 10 seconds"
        />
      </View>
      {isLoading ? (
        <TimePlaceholder testID="maxTimeLoading" />
      ) : (
        <Text
          variant="bodySmall"
          style={styles.time}
          accessibilityLabel="Maximum time"
        >
          {maxTime}
        </Text>
      )}
    </View>
  );
};

export default Controls;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  controlsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseIconButton: {
    marginHorizontal: spacing.spaceSmall,
  },
  timePlaceholder: {
    width: 30,
    height: 10,
    backgroundColor: "red",
    borderRadius: roundness,
  },
  time: {
    marginBottom: -5,
  },
});
