import { useSnackbar } from "@/contexts/SnackbarContext";
import { Entry } from "@/models/Entry";
import logCrashlytics from "@/utils/logCrashlytics";
import { useObject, useRealm } from "@realm/react";
import { useEffect } from "react";
import { BSON } from "realm";

const useDeleteEmptyEntry = (entryId: string) => {
  const realm = useRealm();
  const { showSnackbar } = useSnackbar();

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const {
    text = "",
    recordingUri = "",
    media = [],
    feelingsEmotions = [],
  } = entryObject || {};

  // Delete entry if it has no content
  useEffect(() => {
    if (!entryObject) {
      return;
    }

    if (
      !text &&
      !recordingUri &&
      media.length === 0 &&
      feelingsEmotions.length === 0
    ) {
      logCrashlytics("Deleting empty entry");
      realm.write(() => {
        realm.delete(entryObject);
      });

      showSnackbar("Entry was deleted because it was empty");
    }
  }, [
    text,
    recordingUri,
    media,
    feelingsEmotions,
    entryObject,
    realm,
    showSnackbar,
  ]);
};

export default useDeleteEmptyEntry;
