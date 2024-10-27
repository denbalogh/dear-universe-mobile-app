import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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

const AudioPlayer = () => {
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
      require("../../assets/audio/boris_brejcha.mp3"),
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

  const currentTime = new Date(positionMillis).toISOString().substr(14, 5);
  const maxTime = new Date(durationMillis).toISOString().substr(14, 5);

  return (
    <View style={styles.wrapper}>
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
        testID="audioPlayerSlider"
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
  wrapper: {
    width: "100%",
  },
  slider: {
    width: "100%",
    paddingVertical: spacing.spaceMedium,
  },
});
