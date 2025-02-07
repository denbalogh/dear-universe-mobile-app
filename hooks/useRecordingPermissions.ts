import { usePermissions } from "expo-av/build/Audio";
import { useCallback, useMemo } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";

type ReturnType = {
  granted: boolean;
  requestPermissions: () => Promise<void>;
};

const useRecordingPermissions = (): ReturnType => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const [recordingPermissions, requestRecordingPermission] = usePermissions();

  const handleRequestRecordingPermissions = useCallback(async () => {
    log(getCrashlytics(), "Requesting recording permission");
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
