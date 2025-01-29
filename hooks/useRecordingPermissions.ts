import { useSnackbar } from "@/contexts/SnackbarContext";
import { usePermissions } from "expo-av/build/Audio";
import { useCallback, useMemo } from "react";

type ReturnType = {
  granted: boolean;
  requestPermissions: () => Promise<void>;
};

const useRecordingPermissions = (): ReturnType => {
  const { showSnackbar } = useSnackbar();

  const [recordingPermissions, requestRecordingPermission] = usePermissions();

  const handleRequestRecordingPermissions = useCallback(async () => {
    const { canAskAgain, granted } = await requestRecordingPermission();

    if (!granted && !canAskAgain) {
      showSnackbar(
        "The recording permission has been denied. To grant it, go to system settings.",
      );
    }
  }, [requestRecordingPermission, showSnackbar]);

  return useMemo(
    () => ({
      granted: recordingPermissions?.status === "granted",
      requestPermissions: handleRequestRecordingPermissions,
    }),
    [recordingPermissions, handleRequestRecordingPermissions],
  );
};

export default useRecordingPermissions;
