import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect } from "react";
import { ViewProps } from "react-native";

type Props = {
  sourceUri: string;
  shouldPlay?: boolean;
} & ViewProps;

const VideoPlayer = ({ sourceUri, shouldPlay, ...viewProps }: Props) => {
  const player = useVideoPlayer(sourceUri);

  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  }, [shouldPlay, player]);

  return (
    <VideoView
      player={player}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      {...viewProps}
    />
  );
};

export default VideoPlayer;
