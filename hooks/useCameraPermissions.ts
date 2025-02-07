import {
  useMicrophonePermissions,
  useCameraPermissions as usePermissions,
} from "expo-camera";
import { useCallback, useMemo } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";

type ReturnType = {
  cameraGranted: boolean;
  requestCameraPermission: (successCallback: () => void) => Promise<void>;
  microphoneGranted: boolean;
  requestMicrophonePermission: (successCallback: () => void) => Promise<void>;
};

const useCameraPermissions = (): ReturnType => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const [cameraPermissions, requestCameraPermission] = usePermissions();
  const [microphonePermissions, requestMicrophonePermissions] =
    useMicrophonePermissions();

  const handleRequestCameraPermission = useCallback(
    async (successCallback: () => void) => {
      log(getCrashlytics(), "Requesting camera permission");
      const { granted, canAskAgain } = await requestCameraPermission();

      if (!granted && !canAskAgain) {
        showPermissionDeniedSnackbar("camera");
      }

      if (granted) {
        successCallback();
      }
    },
    [requestCameraPermission, showPermissionDeniedSnackbar],
  );

  const handleRequestMicrophonePermission = useCallback(
    async (successCallback: () => void) => {
      log(getCrashlytics(), "Requesting microphone permission for camera");
      const { granted, canAskAgain } = await requestMicrophonePermissions();

      if (!granted && !canAskAgain) {
        showPermissionDeniedSnackbar("microphone");
      }

      if (granted) {
        successCallback();
      }
    },
    [showPermissionDeniedSnackbar, requestMicrophonePermissions],
  );

  return useMemo(
    () => ({
      cameraGranted: cameraPermissions?.status === "granted",
      requestCameraPermission: handleRequestCameraPermission,
      microphoneGranted: microphonePermissions?.status === "granted",
      requestMicrophonePermission: handleRequestMicrophonePermission,
    }),
    [
      cameraPermissions,
      microphonePermissions,
      handleRequestCameraPermission,
      handleRequestMicrophonePermission,
    ],
  );
};

export default useCameraPermissions;
