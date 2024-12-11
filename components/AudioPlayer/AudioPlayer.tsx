import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
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
  sourceURI: string;
} & ViewProps;

const AudioPlayer = ({ sourceURI, ...props }: Props) => {
  const theme = useTheme();

  const [isLoadingSound, setIsLoadingSound] = useState(true);
  const [sound, setSound] = useState<Sound>();
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

    const { sound } = await Audio.Sound.createAsync(
      { uri: sourceURI },
      {},
      handleSetStatus,
    );

    const status = await sound.getStatusAsync();

    setSound(sound);
    handleSetStatus(status);
    setIsLoadingSound(false);
  }, []);

  useEffect(() => {
    loadSound();
  }, [loadSound]);

  useEffect(() => {
    return () => {
      const unloadSound = async () => sound?.unloadAsync();

      if (sound) {
        unloadSound();
      }
    };
  }, [sound]);

  const {
    durationMillis = 1,
    positionMillis = 0,
    isPlaying = false,
    didJustFinish = false,
  } = soundStatusSuccess || {};

  const playSound = async () => {
    if (sound) {
      if (didJustFinish) {
        await sound.replayAsync();
      } else {
        await sound.playAsync();
      }
    }
  };

  const setSoundPosition = async (positionMillis: number) => {
    if (sound) {
      await sound.setPositionAsync(positionMillis);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  const handleOn10SecForwardPress = () => {
    if (sound) {
      sound.setPositionAsync(Math.min(positionMillis + 10000, durationMillis));
    }
  };

  const handleOn10SecRewindPress = () => {
    if (sound) {
      sound.setPositionAsync(Math.max(positionMillis - 10000, 0));
    }
  };

  const currentTime = format(new Date(positionMillis), "mm:ss");
  const maxTime = format(new Date(durationMillis), "mm:ss");

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
        on10SecForwardPress={handleOn10SecForwardPress}
        on10SecRewindPress={handleOn10SecRewindPress}
        failedToLoad={soundStatusError !== undefined}
        onReloadPress={loadSound}
        currentTime={currentTime}
        maxTime={maxTime}
      />
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  slider: {
    paddingVertical: spacing.spaceMedium,
  },
});
