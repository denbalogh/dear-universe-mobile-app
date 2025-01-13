import { useSnackbar } from "@/contexts/SnackbarContext";
import { usePermissions } from "expo-av/build/Audio";

type ReturnType = {
  granted: boolean;
  requestPermissions: () => Promise<void>;
};

const useRecordingPermissions = (): ReturnType => {
  const { showSnackbar } = useSnackbar();

  const [recordingPermissions, requestRecordingPermission] = usePermissions();

  const handleRequestRecordingPermissions = async () => {
    const { canAskAgain, granted } = await requestRecordingPermission();

    if (!granted && !canAskAgain) {
      showSnackbar(
        "The recording permission has been denied. To grant it, go to system settings.",
      );
    }
  };

  return {
    granted: recordingPermissions?.status === "granted",
    requestPermissions: handleRequestRecordingPermissions,
  };
};

export default useRecordingPermissions;
