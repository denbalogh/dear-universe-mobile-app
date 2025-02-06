import { useSnackbar } from "@/contexts/SnackbarContext";
import { Entry } from "@/models/Entry";
import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { useObject, useRealm } from "@realm/react";
import { useEffect } from "react";
import { BSON } from "realm";

const useDeleteEmptyEntry = (entryId: string) => {
  const realm = useRealm();
  const { showSnackbar } = useSnackbar();

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const {
    title = "",
    description = "",
    recordingUri = "",
    media = [],
  } = entryObject || {};

  // Delete entry if it has no content
  useEffect(() => {
    if (!entryObject) {
      return;
    }

    if (!title && !description && !recordingUri && media.length === 0) {
      getCrashlytics().log("Deleting empty entry");
      realm.write(() => {
        realm.delete(entryObject);
      });

      showSnackbar("Entry was deleted because it was empty");
    }
  }, [
    title,
    description,
    recordingUri,
    media,
    entryObject,
    realm,
    showSnackbar,
  ]);
};

export default useDeleteEmptyEntry;
