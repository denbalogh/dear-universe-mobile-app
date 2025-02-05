import { spacing } from "@/constants/theme";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import { Portal, Snackbar, SnackbarProps } from "react-native-paper";

type ActionType = SnackbarProps["action"];

type SnackbarContextType = {
  showSnackbar: (message: string, action?: ActionType) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});

const SnackbarContextProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarAction, setSnackbarAction] = useState<ActionType>();

  const showSnackbar = useCallback((message: string, action?: ActionType) => {
    setSnackbarMessage(message);
    setSnackbarAction(action);
  }, []);

  const dismissSnackbar = useCallback(() => {
    setSnackbarMessage("");
    setSnackbarAction(undefined);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbarMessage && ( // Need to rerender the Portal to show the snackbar above modals
        <Portal>
          <Snackbar
            visible={true}
            onDismiss={dismissSnackbar}
            icon="close"
            onIconPress={dismissSnackbar}
            iconAccessibilityLabel="Close snackbar"
            wrapperStyle={styles.wrapper}
            action={snackbarAction}
            duration={Snackbar.DURATION_SHORT}
          >
            {snackbarMessage}
          </Snackbar>
        </Portal>
      )}
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => useContext(SnackbarContext);

export { useSnackbar, SnackbarContextProvider };

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.spaceMedium,
  },
});
