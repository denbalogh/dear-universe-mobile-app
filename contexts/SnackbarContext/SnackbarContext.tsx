import { spacing } from "@/constants/theme";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";

type SnackbarContextType = {
  showSnackbar: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});

const SnackbarContextProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const dismissSnackbar = () => {
    setSnackbarMessage("");
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar: setSnackbarMessage }}>
      {children}
      <Snackbar
        visible={snackbarMessage !== ""}
        onDismiss={dismissSnackbar}
        icon="close"
        onIconPress={dismissSnackbar}
        iconAccessibilityLabel="Close snackbar"
        wrapperStyle={styles.wrapper}
      >
        {snackbarMessage}
      </Snackbar>
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
