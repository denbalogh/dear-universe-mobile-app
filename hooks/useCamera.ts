import { useSnackbar } from "@/contexts/SnackbarContext";
import {
  ImagePickerAsset,
  launchCameraAsync,
  MediaTypeOptions,
  useCameraPermissions,
} from "expo-image-picker";
import { useMemo } from "react";

export type MediaType = "IMAGES" | "VIDEOS";

export const defaultOptions = {
  allowsMultipleSelection: true,
  orderedSelection: true,
};

const useCamera = ({
  onSuccess,
  type,
}: {
  onSuccess: (images: ImagePickerAsset[]) => void;
  type: MediaType;
}) => {
  const { showSnackbar } = useSnackbar();

  const [cameraPermissions, requestCameraPermission] = useCameraPermissions();

  const isCameraAllowed = useMemo(
    () => cameraPermissions?.status === "granted",
    [cameraPermissions],
  );

  const mediaType = useMemo(() => {
    return type === "IMAGES"
      ? MediaTypeOptions.Images
      : MediaTypeOptions.Videos;
  }, [type]);

  const handleOpenCamera = async () => {
    const selectedImages = await launchCameraAsync({
      ...defaultOptions,
      mediaTypes: mediaType,
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
