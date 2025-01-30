import { useCameraPermissions as usePermissions } from "expo-camera";
import { useCallback, useMemo } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";

type ReturnType = {
  granted: boolean;
  requestPermissions: (successCallback: () => void) => Promise<void>;
};

const useCameraPermissions = (): ReturnType => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const [cameraPermissions, requestCameraPermission] = usePermissions();

  const handleRequestCameraPermissions = useCallback(
    async (successCallback: () => void) => {
      const { canAskAgain, granted } = await requestCameraPermission();

      if (!granted && !canAskAgain) {
        showPermissionDeniedSnackbar("camera");
      }

      if (granted) {
        successCallback();
      }
    },
    [requestCameraPermission, showPermissionDeniedSnackbar],
  );

  return useMemo(
    () => ({
      granted: cameraPermissions?.status === "granted",
      requestPermissions: handleRequestCameraPermissions,
    }),
    [cameraPermissions, handleRequestCameraPermissions],
  );
};

export default useCameraPermissions;
