import React from "react";
import { Media } from "../EditableMediaGallery";
import { StyleSheet } from "react-native";
import VideoPlayer from "./VideoPlayer";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import FadeInView, {
  FadeInViewAppearFrom,
} from "@/components/FadeInView/FadeInView";

type Props = {
  item: Media;
  appearFrom: FadeInViewAppearFrom;
};

const PreviewItem = ({ item: { imageUri, videoUri }, appearFrom }: Props) => {
  return (
    <FadeInView style={styles.item} appearFrom={appearFrom}>
      {videoUri ? (
        <VideoPlayer sourceUri={videoUri} style={styles.item} />
      ) : (
        <ImageZoom
          style={styles.item}
          uri={imageUri}
          isDoubleTapEnabled={true}
        />
      )}
    </FadeInView>
  );
};

export default PreviewItem;

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
});
