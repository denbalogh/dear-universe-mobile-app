import { useSnackbar } from "@/contexts/SnackbarContext";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";
import {
  authenticateAsync,
  getEnrolledLevelAsync,
  hasHardwareAsync,
  LocalAuthenticationResult,
  SecurityLevel,
} from "expo-local-authentication";
import { useCallback, useMemo } from "react";

type ReturnType = {
  authenticate: (promptMessage: string) => Promise<LocalAuthenticationResult>;
};

const useBiometrics = (): ReturnType => {
  const { showSnackbar } = useSnackbar();

  const authenticate = useCallback(
    async (promptMessage: string) => {
      log(getCrashlytics(), "Biometrics - check hardware");
      const hasHardware = await hasHardwareAsync();

      log(getCrashlytics(), "Biometrics - check enrolled level");
      const enrolledLevel = await getEnrolledLevelAsync();

      if (!hasHardware) {
        showSnackbar("Biometrics is not available on this device");
        return { success: false } as LocalAuthenticationResult;
      }

      if (enrolledLevel === SecurityLevel.NONE) {
        showSnackbar("Biometrics is not set up on this device");
        return { success: false } as LocalAuthenticationResult;
      }

      log(getCrashlytics(), "Biometrics - authenticate");
      return await authenticateAsync({
        promptMessage,
        disableDeviceFallback: true,
        requireConfirmation: false,
      });
    },
    [showSnackbar],
  );

  return useMemo(() => ({ authenticate }), [authenticate]);
};

export default useBiometrics;
