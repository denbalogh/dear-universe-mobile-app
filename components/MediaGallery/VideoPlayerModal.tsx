import React from "react";
import { Modal, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Video } from "expo-av";

type Props = {
  videosUri: string[];
  initialIndex: number;
  isVisible: boolean;
  onClose: () => void;
};

const VideoPlayerModal = ({
  videosUri,
  initialIndex,
  isVisible,
  onClose,
}: Props) => {
  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}
      >
        <Video source={{ uri: videosUri[initialIndex] }} />
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default VideoPlayerModal;
