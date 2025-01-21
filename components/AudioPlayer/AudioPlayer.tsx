import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import {
  Audio,
  AVPlaybackStatus,
  AVPlaybackStatusError,
  AVPlaybackStatusSuccess,
} from "expo-av";
import { Sound } from "expo-av/build/Audio";
import Controls from "./Controls";
import { format } from "date-fns";

type Props = {
  sourceUri: string;
  onLongPress?: () => void;
  locked?: boolean;
} & ViewProps;

const AudioPlayer = ({
  sourceUri,
  onLongPress,
  locked = false,
  ...props
}: Props) => {
  const theme = useTheme();

  const [isLoadingSound, setIsLoadingSound] = useState(true);
  const sound = useRef<Sound>();

  const [soundStatusSuccess, setSoundStatusSuccess] =
    useState<AVPlaybackStatusSuccess>();
  const [soundStatusError, setSoundStatusError] =
    useState<AVPlaybackStatusError>();

  const handleSetStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setSoundStatusSuccess(status);
      setSoundStatusError(undefined);
    } else {
      setSoundStatusError(status);
      setSoundStatusSuccess(undefined);
    }
  };

  const loadSound = useCallback(async () => {
    setIsLoadingSound(true);

    if (sound.current) {
      await sound.current.unloadAsync();
    }

    const defaultStatus = {};

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: sourceUri },
      defaultStatus,
      handleSetStatus,
    );

    const status = await newSound.getStatusAsync();

    sound.current = newSound;
    handleSetStatus(status);
    setIsLoadingSound(false);
  }, [sourceUri]);

  useEffect(() => {
    loadSound();
  }, [loadSound]);

  useEffect(() => {
    return () => {
      const unloadSound = async () => {
        if (sound.current) {
          await sound.current.unloadAsync();
        }
      };
      unloadSound();
    };
  }, [sound]);

  const {
    durationMillis = 1,
    positionMillis = 0,
    isPlaying = false,
    didJustFinish = false,
  } = soundStatusSuccess || {};

  const playSound = async () => {
    if (!sound.current) {
      return;
    }

    if (didJustFinish) {
      await sound.current.replayAsync();
    } else {
      await sound.current.playAsync();
    }
  };

  const setSoundPosition = async (positionMillis: number) => {
    if (sound.current) {
      await sound.current.setPositionAsync(positionMillis);
    }
  };

  const pauseSound = async () => {
    if (sound.current) {
      await sound.current.pauseAsync();
    }
  };

  const handleOn5SecForwardPress = () => {
    if (sound.current) {
      sound.current.setPositionAsync(
        Math.min(positionMillis + 5000, durationMillis),
      );
    }
  };

  const handleOn5SecRewindPress = () => {
    if (sound.current) {
      sound.current.setPositionAsync(Math.max(positionMillis - 5000, 0));
    }
  };

  const currentTime = format(new Date(positionMillis), "mm:ss");
  const maxTime = format(new Date(durationMillis), "mm:ss");

  const handleOnRecordingLongPress = () => {
    if (!locked && onLongPress) {
      onLongPress();
    }
  };

  if (!sourceUri) {
    return null;
  }

  return (
    <View {...props}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durationMillis}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.secondary}
        thumbTintColor={theme.colors.primary}
        disabled={isLoadingSound}
        value={positionMillis}
        onSlidingComplete={(value) => setSoundPosition(value)}
      />
      <Controls
        isLoading={isLoadingSound}
        isPlaying={isPlaying}
        onPlayPress={playSound}
        onPausePress={pauseSound}
        on5SecForwardPress={handleOn5SecForwardPress}
        on5SecRewindPress={handleOn5SecRewindPress}
        failedToLoad={soundStatusError !== undefined}
        onReloadPress={loadSound}
        currentTime={currentTime}
        maxTime={maxTime}
        onLongPress={handleOnRecordingLongPress}
      />
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  slider: {
    ...Platform.select({
      android: {
        marginHorizontal: -spacing.spaceSmall,
      },
    }),
  },
});
