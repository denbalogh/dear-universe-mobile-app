import { usePermissions } from "expo-av/build/Audio";
import { useCallback } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";

const useRecordingPermissions = () => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const [recordingPermissions, requestRecordingPermission] = usePermissions();

  const handleRequestRecordingPermissions = useCallback(async () => {
    const { canAskAgain, granted } = await requestRecordingPermission();

    if (!granted && !canAskAgain) {
      showPermissionDeniedSnackbar("microphone");
    }
  }, [requestRecordingPermission, showPermissionDeniedSnackbar]);

  return {
    granted: recordingPermissions?.status === "granted",
    requestPermissions: handleRequestRecordingPermissions,
  };
};

export default useRecordingPermissions;
