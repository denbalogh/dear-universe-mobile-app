import React, { useState } from "react";
import ImageGrid from "./ImageGrid";
import { ViewProps } from "react-native";
import VideoPlayerModal from "./VideoPlayerModal";

export type VideoWithThumbnail = {
  videoUri: string;
  thumbnailUri: string;
};

type Props = {
  videosWithThumbnail: VideoWithThumbnail[];
  gridSize?: number;
} & ViewProps;

const VideoGallery = ({
  videosWithThumbnail,
  gridSize = 5,
  ...props
}: Props) => {
  const [isVideaPlayerVisible, setIsVideoPlayerVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const onVideoPress = (index: number) => {
    setInitialIndex(index);
    setIsVideoPlayerVisible(true);
  };

  const handleGalleryPreviewClose = () => {
    setIsVideoPlayerVisible(false);
  };

  const thumbnailsUri = videosWithThumbnail.map((video) => video.thumbnailUri);
  const videosUri = videosWithThumbnail.map((video) => video.videoUri);

  return (
    <>
      <ImageGrid
        {...props}
        gridSize={gridSize}
        imagesUri={thumbnailsUri}
        onImagePress={onVideoPress}
        showPlayIcon={true}
      />
      <VideoPlayerModal
        videosUri={videosUri}
        initialIndex={initialIndex}
        isVisible={isVideaPlayerVisible}
        onClose={handleGalleryPreviewClose}
      />
    </>
  );
};

export default VideoGallery;
