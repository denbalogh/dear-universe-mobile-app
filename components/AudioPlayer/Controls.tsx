import { roundness, sizing, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";

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
  failedToLoad: boolean;
  isLoading: boolean;
  isPlaying: boolean;
  onPlayPress: () => void;
  onPausePress: () => void;
  onReloadPress: () => void;
  on5SecRewindPress: () => void;
  on5SecForwardPress: () => void;
  currentTime?: string;
  maxTime?: string;
  onLongPress?: () => void;
};

const Controls = ({
  failedToLoad,
  isLoading,
  isPlaying,
  onPausePress,
  onPlayPress,
  onReloadPress,
  on5SecForwardPress,
  on5SecRewindPress,
  currentTime = "--:--",
  maxTime = "--:--",
  onLongPress,
}: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.timesWrapper}>
        {isLoading || failedToLoad ? (
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
        {isLoading || failedToLoad ? (
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
      <View style={styles.controlsWrapper}>
        <IconButton
          icon="rewind-5"
          size={sizing.sizeMedium}
          onPress={on5SecRewindPress}
          disabled={isLoading || failedToLoad}
          accessibilityLabel="Rewind 5 seconds"
          onLongPress={onLongPress}
        />
        {isLoading ? (
          <ActivityIndicator
            accessibilityLabel="Loading the recording"
            style={styles.loadingIndicator}
          />
        ) : failedToLoad ? (
          <IconButton
            icon="reload"
            size={sizing.sizeMedium}
            onPress={onReloadPress}
            style={styles.playPauseIconButton}
            accessibilityLabel="Reload"
            onLongPress={onLongPress}
          />
        ) : isPlaying ? (
          <IconButton
            icon="pause"
            size={sizing.sizeMedium}
            onPress={onPausePress}
            style={styles.playPauseIconButton}
            accessibilityLabel="Pause"
            onLongPress={onLongPress}
          />
        ) : (
          <IconButton
            icon="play"
            size={sizing.sizeMedium}
            onPress={onPlayPress}
            style={styles.playPauseIconButton}
            accessibilityLabel="Play"
            onLongPress={onLongPress}
          />
        )}
        <IconButton
          icon="fast-forward-5"
          size={sizing.sizeMedium}
          onPress={on5SecForwardPress}
          disabled={isLoading || failedToLoad}
          accessibilityLabel="Forward 5 seconds"
          onLongPress={onLongPress}
        />
      </View>
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
    width: "100%",
  },
  timesWrapper: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadingIndicator: {
    marginHorizontal: spacing.spaceMedium,
    paddingVertical: spacing.spaceMedium,
  },
  playPauseIconButton: {
    marginHorizontal: spacing.spaceSmall,
  },
  timePlaceholder: {
    width: 30,
    height: 10,
    borderRadius: roundness,
  },
  time: {
    marginBottom: -5,
  },
});
