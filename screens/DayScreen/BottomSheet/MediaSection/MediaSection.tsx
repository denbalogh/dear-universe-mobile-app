import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Button } from "react-native-paper";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import useMediaLibrary from "@/common/hooks/useMediaLibrary";
import { Media } from "@/common/types/Media";
import EditableMediaGallery from "./EditableMediaGallery";

const MediaSection = () => {
  const { media, setMedia } = useEntryDraft();

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
