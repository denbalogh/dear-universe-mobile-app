import { useSnackbar } from "@/contexts/SnackbarContext";
import {
  ImagePickerAsset,
  launchCameraAsync,
  MediaTypeOptions,
  useCameraPermissions,
} from "expo-image-picker";
import { useMemo } from "react";

const useCamera = (onSuccess: (images: ImagePickerAsset[]) => void) => {
  const { showSnackbar } = useSnackbar();

  const [cameraPermissions, requestCameraPermission] = useCameraPermissions();

  const isCameraAllowed = useMemo(
    () => cameraPermissions?.status === "granted",
    [cameraPermissions],
  );

  const handleOpenCamera = async () => {
    const selectedImages = await launchCameraAsync({
      allowsMultipleSelection: true,
      mediaTypes: MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!selectedImages.canceled) {
      onSuccess(selectedImages.assets);
    }
  };

  const handleRequestCameraPermissions = async () => {
    const { canAskAgain, granted } = await requestCameraPermission();

    if (granted) {
      await handleOpenCamera();
    } else if (!canAskAgain) {
      showSnackbar(
        "The camera permission has been denied. To grant it, go to system settings.",
      );
    }
  };

  return async () => {
    if (!isCameraAllowed) {
      await handleRequestCameraPermissions();
    } else {
      await handleOpenCamera();
    }
  };
};

export default useCamera;
