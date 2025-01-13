import { useSnackbar } from "@/contexts/SnackbarContext";
import { Entry } from "@/models/Entry";
import { useRealm } from "@realm/react";
import { useEffect } from "react";

const useDeleteEmptyEntry = (entryObject: Entry) => {
  const realm = useRealm();
  const { showSnackbar } = useSnackbar();

  const {
    title,
    description,
    recordingUri,
    imagesUri = [],
    videosWithThumbnail = [],
  } = entryObject;

  // Delete entry if it has no content
  useEffect(() => {
    if (
      !title &&
      !description &&
      !recordingUri &&
      imagesUri.length === 0 &&
      videosWithThumbnail.length === 0
    ) {
      realm.write(() => {
        realm.delete(entryObject);
      });

      showSnackbar("Entry was deleted because it was empty.");
    }
  }, [
    title,
    description,
    recordingUri,
    imagesUri,
    videosWithThumbnail,
    entryObject,
    realm,
    showSnackbar,
  ]);
};

export default useDeleteEmptyEntry;
