import React from "react";
import { StyleSheet } from "react-native";
import VideoPlayer from "./VideoPlayer";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import FadeInView, {
  FadeInViewAppearFrom,
} from "@/components/FadeInView/FadeInView";
import { Media } from "@/types/Media";

type Props = {
  item: Media;
  appearFrom: FadeInViewAppearFrom;
};

const PreviewItem = ({ item: { uri, mediaType }, appearFrom }: Props) => {
  return (
    <FadeInView style={styles.item} appearFrom={appearFrom}>
      {mediaType === "video" ? (
        <VideoPlayer sourceUri={uri} style={styles.item} />
      ) : (
        <ImageZoom style={styles.item} uri={uri} isDoubleTapEnabled={true} />
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
