import useMediaLibrary from "@/common/hooks/useMediaLibrary";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";
import { Media } from "@/common/types/Media";

type ReturnType = () => void;

const useAddMedia = (): ReturnType => {
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

  return openMediaLibrary;
};

export default useAddMedia;
