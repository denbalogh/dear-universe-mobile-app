import { usePermissions } from "expo-av/build/Audio";
import { useCallback, useMemo } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";
import logCrashlytics from "@/utils/logCrashlytics";

type ReturnType = {
  granted: boolean;
  requestPermissions: () => Promise<void>;
};

const useRecordingPermissions = (): ReturnType => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const [recordingPermissions, requestRecordingPermission] = usePermissions();

  const handleRequestRecordingPermissions = useCallback(async () => {
    logCrashlytics("Requesting recording permission");
    const { canAskAgain, granted } = await requestRecordingPermission();

    if (!granted && !canAskAgain) {
      showPermissionDeniedSnackbar("microphone");
    }
  }, [requestRecordingPermission, showPermissionDeniedSnackbar]);

  return useMemo(
    () => ({
      granted: recordingPermissions?.status === "granted",
      requestPermissions: handleRequestRecordingPermissions,
    }),
    [recordingPermissions, handleRequestRecordingPermissions],
  );
};

export default useRecordingPermissions;
