import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Slider from "@react-native-community/slider";
import { Button, IconButton, useTheme } from "react-native-paper";
import { roundness, sizing } from "@/common/constants/theme";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { Sound } from "expo-av/build/Audio";
import { format } from "date-fns/format";
import useAppState from "@/common/hooks/useAppState";

type Props = {
  sourceUri: string;
  onDiscard?: () => void;
};

const AudioPlayer = ({ sourceUri, onDiscard }: Props) => {
  const theme = useTheme();
  const appState = useAppState();

  const sound = useRef<Sound>();
  const [soundStatus, setSoundStatus] = useState<AVPlaybackStatus>();

  const handleUnloadSound = async () => {
    if (sound.current) {
      await sound.current.unloadAsync();
    }
  };

  const loadSound = useCallback(async () => {
    await handleUnloadSound();

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: sourceUri },
      {}, // default status
      setSoundStatus,
    );

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
      await sound.current.replayAsync();
    } else {
      await sound.current.playAsync();
    }
  };

  const pauseSound = async () => {
    if (sound.current) {
      await sound.current.pauseAsync();
    }
  };

  const setSoundPosition = async (positionMillis: number) => {
    if (sound.current) {
      await sound.current.setPositionAsync(positionMillis);
    }
  };

  const currentTime = format(new Date(positionMillis), "mm:ss");

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
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.primaryContainer,
        },
      ]}
    >
      {!isLoaded ? (
        <IconButton
          icon="reload"
          size={sizing.sizeMedium}
          onPress={loadSound}
          accessibilityLabel="Reload"
          iconColor={theme.colors.onPrimaryContainer}
        />
      ) : isPlaying ? (
        <Button
          icon="pause"
          onPress={pauseSound}
          textColor={theme.colors.onPrimaryContainer}
        >
          {currentTime}
        </Button>
      ) : (
        <Button
          icon="play"
          onPress={playSound}
          textColor={theme.colors.onPrimaryContainer}
        >
          {currentTime}
        </Button>
      )}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durationMillis}
        minimumTrackTintColor={theme.colors.onPrimaryContainer}
        maximumTrackTintColor={theme.colors.secondary}
        thumbTintColor={theme.colors.onPrimaryContainer}
        disabled={!isLoaded}
        value={positionMillis}
        onSlidingComplete={(value) => setSoundPosition(value)}
      />
      {onDiscard && (
        <IconButton
          icon="delete"
          size={sizing.sizeSmall}
          onPress={onDiscard}
          iconColor={theme.colors.error}
          accessibilityLabel="Discard"
        />
      )}
    </View>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: roundness,
  },
  slider: {
    flex: 1,
  },
});
