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
  isLoaded: boolean;
  isPlaying: boolean;
  onPlayPress: () => void;
  onPausePress: () => void;
  onReloadPress: () => void;
  on5SecRewindPress: () => void;
  on5SecForwardPress: () => void;
  currentTime?: string;
  maxTime?: string;
};

const Controls = ({
  isLoaded,
  isPlaying,
  onPausePress,
  onPlayPress,
  onReloadPress,
  on5SecForwardPress,
  on5SecRewindPress,
  currentTime = "--:--",
  maxTime = "--:--",
}: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.timesWrapper}>
        {!isLoaded ? (
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
        {!isLoaded ? (
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
          disabled={!isLoaded}
          accessibilityLabel="Rewind 5 seconds"
        />
        {!isLoaded ? (
          <IconButton
            icon="reload"
            size={sizing.sizeMedium}
            onPress={onReloadPress}
            style={styles.centerIconButton}
            accessibilityLabel="Reload"
          />
        ) : isPlaying ? (
          <IconButton
            icon="pause"
            size={sizing.sizeMedium}
            onPress={onPausePress}
            style={styles.centerIconButton}
            accessibilityLabel="Pause"
          />
        ) : (
          <IconButton
            icon="play"
            size={sizing.sizeMedium}
            onPress={onPlayPress}
            style={styles.centerIconButton}
            accessibilityLabel="Play"
          />
        )}
        <IconButton
          icon="fast-forward-5"
          size={sizing.sizeMedium}
          onPress={on5SecForwardPress}
          disabled={!isLoaded}
          accessibilityLabel="Forward 5 seconds"
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
  centerIconButton: {
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
