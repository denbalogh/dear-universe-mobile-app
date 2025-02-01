import React from "react";
import { Media } from "../EditableMediaGallery";
import { StyleSheet } from "react-native";
import VideoPlayer from "./VideoPlayer";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { View } from "react-native";
import FadeInView, {
  FadeInViewAppearFrom,
} from "@/components/FadeInView/FadeInView";

type Props = {
  item: Media;
  appearFrom: FadeInViewAppearFrom;
};

const PreviewItem = ({ item: { imageUri, videoUri }, appearFrom }: Props) => {
  return (
    <View style={styles.wrapper}>
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
    </View>
  );
};

export default PreviewItem;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "black",
    flex: 1,
  },
  item: {
    flex: 1,
  },
});
