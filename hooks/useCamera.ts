import { useSnackbar } from "@/contexts/SnackbarContext";
import {
  ImagePickerAsset,
  ImagePickerOptions,
  launchCameraAsync,
  useCameraPermissions,
} from "expo-image-picker";
import { useMemo } from "react";

export const defaultOptions = {
  allowsMultipleSelection: true,
  orderedSelection: true,
};

const useCamera = (
  mediaTypes: ImagePickerOptions["mediaTypes"],
  onSuccess: (images: ImagePickerAsset[]) => void,
  onCancel?: () => void,
) => {
  const { showSnackbar } = useSnackbar();

  const [cameraPermissions, requestCameraPermission] = useCameraPermissions();

  const isCameraAllowed = useMemo(
    () => cameraPermissions?.status === "granted",
    [cameraPermissions],
  );

  const handleOpenCamera = async () => {
    const selectedImages = await launchCameraAsync({
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
