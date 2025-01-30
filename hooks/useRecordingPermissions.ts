import { usePermissions } from "expo-av/build/Audio";
import { useCallback, useMemo } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";

type ReturnType = {
  granted: boolean;
  requestPermissions: (successCallback: () => void) => Promise<void>;
};

const useRecordingPermissions = (): ReturnType => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const [recordingPermissions, requestRecordingPermission] = usePermissions();

  const handleRequestRecordingPermissions = useCallback(
    async (successCallback: () => void) => {
      const { canAskAgain, granted } = await requestRecordingPermission();

      if (!granted && !canAskAgain) {
        showPermissionDeniedSnackbar("microphone");
      }

      if (granted) {
        successCallback();
      }
    },
    [requestRecordingPermission, showPermissionDeniedSnackbar],
  );

  return useMemo(
    () => ({
      granted: recordingPermissions?.status === "granted",
      requestPermissions: handleRequestRecordingPermissions,
    }),
    [recordingPermissions, handleRequestRecordingPermissions],
  );
};

export default useRecordingPermissions;
