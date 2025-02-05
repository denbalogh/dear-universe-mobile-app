import { useCallback, useMemo } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";
import { requestPermissionsAsync } from "expo-notifications";

type ReturnType = {
  requestPermissions: (onSuccess: () => void) => Promise<void>;
};

const useNotificationsPermissions = (): ReturnType => {
  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();

  const requestNotificationsPermissions = useCallback(
    async (onSuccess: () => void) => {
      const { canAskAgain, granted } = await requestPermissionsAsync();

      if (!granted && !canAskAgain) {
        showPermissionDeniedSnackbar("notifications");
      }

      if (granted) {
        onSuccess();
      }
    },
    [showPermissionDeniedSnackbar],
  );

  return useMemo(
    () => ({
      requestPermissions: requestNotificationsPermissions,
    }),
    [requestNotificationsPermissions],
  );
};

export default useNotificationsPermissions;
