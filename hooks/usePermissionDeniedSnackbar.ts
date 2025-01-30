import { useSnackbar } from "@/contexts/SnackbarContext";
import { useCallback } from "react";
import { Linking } from "react-native";

type Module = "camera" | "microphone" | "media library";

type ReturnType = {
  showPermissionDeniedSnackbar: (module: Module) => void;
};

const usePermissionDeniedSnackbar = (): ReturnType => {
  const { showSnackbar } = useSnackbar();

  const showPermissionDeniedSnackbar = useCallback(
    (module: Module) => {
      showSnackbar(`The ${module} permission was denied.`, {
        label: "App settings",
        onPress: Linking.openSettings,
      });
    },
    [showSnackbar],
  );

  return { showPermissionDeniedSnackbar };
};

export default usePermissionDeniedSnackbar;
