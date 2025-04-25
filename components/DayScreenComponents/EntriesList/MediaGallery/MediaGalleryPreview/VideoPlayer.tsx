import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { ViewProps } from "react-native";

type Props = {
  sourceUri: string;
} & ViewProps;

const VideoPlayer = ({ sourceUri, ...viewProps }: Props) => {
  const player = useVideoPlayer(sourceUri, (player) => {
    player.play();
  });

  return (
    <VideoView
      player={player}
      allowsFullscreen={true}
      allowsPictureInPicture={false}
      {...viewProps}
    />
  );
};

export default VideoPlayer;
