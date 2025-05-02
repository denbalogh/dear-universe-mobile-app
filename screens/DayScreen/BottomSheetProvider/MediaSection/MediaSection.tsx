import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Button } from "react-native-paper";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";
import useMediaLibrary from "@/common/hooks/useMediaLibrary";
import EditableMediaGallery from "./EditableMediaGallery";
import { Media } from "@/common/types/Media";

const MediaSection = () => {
  const { media, setMedia } = useEntryEditor();

  const openMediaLibrary = useMediaLibrary(["images", "videos"], (assets) => {
    const newMedia = assets.map(
      (asset) =>
        ({
          uri: asset.uri,
          mediaType: asset.type,
        }) as Media,
    );
    setMedia([...media, ...newMedia]);
  });

  const haveMedia = media.length > 0;

  return (
    <BottomSheetScrollView>
      {haveMedia ? (
        <EditableMediaGallery onAddImagePress={openMediaLibrary} />
      ) : (
        <Button icon="plus" onPress={openMediaLibrary}>
          Add media
        </Button>
      )}
    </BottomSheetScrollView>
  );
};

export default MediaSection;
