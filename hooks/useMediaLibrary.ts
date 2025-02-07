import {
  ImagePickerAsset,
  ImagePickerOptions,
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import { useCallback, useMemo } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";

const useMediaLibrary = (
  mediaTypes: ImagePickerOptions["mediaTypes"],
  onSuccess: (images: ImagePickerAsset[]) => void,
  onCancel?: () => void,
) => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const [libraryPermissions, requestLibraryPermission] =
    useMediaLibraryPermissions();

  const isLibraryAllowed = useMemo(
    () => libraryPermissions?.status === "granted",
    [libraryPermissions],
  );

  const handleOpenLibrary = useCallback(async () => {
    log(getCrashlytics(), "Opening media library");
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
    log(getCrashlytics(), "Requesting media library permission");
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
