import {
  ImagePickerAsset,
  launchImageLibraryAsync,
  MediaType,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import { useCallback } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";

const useMediaLibrary = (
  mediaTypes: MediaType[],
  onSuccess: (images: ImagePickerAsset[]) => void,
  onCancel?: () => void,
) => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const [libraryPermissions, requestLibraryPermission] =
    useMediaLibraryPermissions();

  const isLibraryAllowed = libraryPermissions?.status === "granted";

  const handleOpenLibrary = useCallback(async () => {
    const selectedImages = await launchImageLibraryAsync({
      mediaTypes,
      allowsMultipleSelection: true,
      orderedSelection: true,
      quality: 1,
    });

    if (selectedImages.canceled) {
      if (onCancel) {
        onCancel();
      }
    } else {
      onSuccess(selectedImages.assets);
    }
  }, [mediaTypes, onCancel, onSuccess]);

  const handleRequestLibraryPermissions = useCallback(async () => {
    const { canAskAgain, granted } = await requestLibraryPermission();

    if (granted) {
      await handleOpenLibrary();
    } else if (!canAskAgain) {
      showPermissionDeniedSnackbar("media library");
    }
  }, [
    handleOpenLibrary,
    requestLibraryPermission,
    showPermissionDeniedSnackbar,
  ]);

  return useCallback(async () => {
    if (!isLibraryAllowed) {
      await handleRequestLibraryPermissions();
    } else {
      await handleOpenLibrary();
    }
  }, [handleOpenLibrary, handleRequestLibraryPermissions, isLibraryAllowed]);
};

export default useMediaLibrary;
