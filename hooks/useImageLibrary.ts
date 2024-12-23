import { useSnackbar } from "@/contexts/SnackbarContext";
import {
  ImagePickerAsset,
  launchImageLibraryAsync,
  MediaTypeOptions,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import { useMemo } from "react";

const useImageLibrary = (onSuccess: (images: ImagePickerAsset[]) => void) => {
  const { showSnackbar } = useSnackbar();

  const [libraryPermissions, requestLibraryPermission] =
    useMediaLibraryPermissions();

  const isLibraryAllowed = useMemo(
    () => libraryPermissions?.status === "granted",
    [libraryPermissions],
  );

  const handleOpenLibrary = async () => {
    const selectedImages = await launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: MediaTypeOptions.Images,
      orderedSelection: true,
    });

    if (!selectedImages.canceled) {
      onSuccess(selectedImages.assets);
    }
  };

  const handleRequestLibraryPermissions = async () => {
    const { canAskAgain, granted } = await requestLibraryPermission();

    if (granted) {
      await handleOpenLibrary();
    } else if (!canAskAgain) {
      showSnackbar(
        "The media library permission has been denied. To grant it, go to system settings.",
      );
    }
  };
  return async () => {
    if (!isLibraryAllowed) {
      await handleRequestLibraryPermissions();
    } else {
      await handleOpenLibrary();
    }
  };
};

export default useImageLibrary;
