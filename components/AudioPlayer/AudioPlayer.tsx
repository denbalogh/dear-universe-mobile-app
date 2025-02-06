import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import Slider from "@react-native-community/slider";
import { useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import Controls from "./Controls";
import { format } from "date-fns";
import useAppState from "@/hooks/useAppState";
import { getCrashlytics } from "@react-native-firebase/crashlytics";

type Props = {
  sourceUri: string;
  locked?: boolean;
} & ViewProps;

const AudioPlayer = ({ sourceUri, locked = false, ...viewProps }: Props) => {
  const theme = useTheme();
  const appState = useAppState();

  const sound = useRef<Sound>();
  const [soundStatus, setSoundStatus] = useState<AVPlaybackStatus>();

  const handleUnloadSound = async () => {
    if (sound.current) {
      getCrashlytics().log("Unloading sound");
      await sound.current.unloadAsync();
    }
  };

  const loadSound = useCallback(async () => {
    await handleUnloadSound();

    getCrashlytics().log("Loading sound");
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: sourceUri },
      {}, // default status
      setSoundStatus,
    );

    getCrashlytics().log("Getting sound status");
    const status = await newSound.getStatusAsync();

    sound.current = newSound;
    setSoundStatus(status);
  }, [sourceUri]);

  const {
    durationMillis = 1,
    positionMillis = 0,
    isPlaying = false,
    didJustFinish = false,
    isLoaded = false,
  } = (soundStatus as AVPlaybackStatusSuccess) || {};

  const playSound = async () => {
    if (!sound.current) {
      return;
    }

    if (didJustFinish) {
      getCrashlytics().log("Replaying sound");
      await sound.current.replayAsync();
    } else {
      getCrashlytics().log("Playing sound");
      await sound.current.playAsync();
    }
  };

  const pauseSound = async () => {
    if (sound.current) {
      getCrashlytics().log("Pausing sound");
      await sound.current.pauseAsync();
    }
  };

  const setSoundPosition = async (positionMillis: number) => {
    if (sound.current) {
      getCrashlytics().log("Setting sound position");
      await sound.current.setPositionAsync(positionMillis);
    }
  };

  const handleOn5SecForwardPress = () => {
    if (sound.current) {
      getCrashlytics().log("Forwarding sound by 5 seconds");
      sound.current.setPositionAsync(
        Math.min(positionMillis + 5000, durationMillis),
      );
    }
  };

  const handleOn5SecRewindPress = () => {
    if (sound.current) {
      getCrashlytics().log("Rewinding sound by 5 seconds");
      sound.current.setPositionAsync(Math.max(positionMillis - 5000, 0));
    }
  };

  const currentTime = format(new Date(positionMillis), "mm:ss");
  const maxTime = format(new Date(durationMillis), "mm:ss");

  useEffect(() => {
    loadSound();
    return () => {
      handleUnloadSound();
    };
  }, [loadSound]);

  useEffect(() => {
    if (appState !== "active") {
      pauseSound();
    }
  }, [appState]);

  return (
    <View {...viewProps}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durationMillis}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.secondary}
        thumbTintColor={theme.colors.primary}
        disabled={!isLoaded}
        value={positionMillis}
        onSlidingComplete={(value) => setSoundPosition(value)}
      />
      <Controls
        isLoaded={isLoaded}
        isPlaying={isPlaying}
        onPlayPress={playSound}
        onPausePress={pauseSound}
        on5SecForwardPress={handleOn5SecForwardPress}
        on5SecRewindPress={handleOn5SecRewindPress}
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
    ...Platform.select({
      android: {
        marginHorizontal: -spacing.spaceSmall,
      },
    }),
  },
});
