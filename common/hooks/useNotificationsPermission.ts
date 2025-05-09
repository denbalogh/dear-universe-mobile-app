import { useCallback } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";
import { requestPermissionsAsync } from "expo-notifications";

const useNotificationsPermissions = () => {
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

  return {
    requestPermissions: requestNotificationsPermissions,
  };
};

export default useNotificationsPermissions;
