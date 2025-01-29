import { useSnackbar } from "@/contexts/SnackbarContext";
import {
  ImagePickerAsset,
  ImagePickerOptions,
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import { useCallback, useMemo } from "react";
import { defaultOptions } from "./useCamera";

const useMediaLibrary = (
  mediaTypes: ImagePickerOptions["mediaTypes"],
  onSuccess: (images: ImagePickerAsset[]) => void,
  onCancel?: () => void,
) => {
  const { showSnackbar } = useSnackbar();

  const [libraryPermissions, requestLibraryPermission] =
    useMediaLibraryPermissions();

  const isLibraryAllowed = useMemo(
    () => libraryPermissions?.status === "granted",
    [libraryPermissions],
  );

  const handleOpenLibrary = useCallback(async () => {
    const selectedImages = await launchImageLibraryAsync({
      ...defaultOptions,
      mediaTypes,
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
      showSnackbar(
        "The media library permission has been denied. To grant it, go to system settings.",
      );
    }
  }, [handleOpenLibrary, requestLibraryPermission, showSnackbar]);

  return useCallback(async () => {
    if (!isLibraryAllowed) {
      await handleRequestLibraryPermissions();
    } else {
      await handleOpenLibrary();
    }
  }, [handleOpenLibrary, handleRequestLibraryPermissions, isLibraryAllowed]);
};

export default useMediaLibrary;
