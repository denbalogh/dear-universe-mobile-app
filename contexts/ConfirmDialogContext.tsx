import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import React, { createContext, ReactNode, useContext, useState } from "react";

type ConfirmDialogContextType = {
  showConfirmDialog: (message: string, callback: () => void) => void;
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType>({
  showConfirmDialog: () => {},
});

type ProviderProps = {
  children: ReactNode;
};

const ConfirmDialogContextProvider = ({ children }: ProviderProps) => {
  const [message, setMessage] = useState<string>("");
  const [callback, setCallback] = useState<() => void>(() => {});

  const dismissConfirmDialog = () => {
    setMessage("");
  };

  const showConfirmDialog = (message: string, callback: () => void) => {
    setMessage(message);
    setCallback(() => callback); // useState expects value or a function that returns a value, so we wrap the callback in a function to return the callback as a value
  };

  return (
    <ConfirmDialogContext.Provider value={{ showConfirmDialog }}>
      {children}
      <ConfirmDialog
        text={message}
        isVisible={message !== ""}
        hideDialog={dismissConfirmDialog}
        onConfirm={callback}
      />
    </ConfirmDialogContext.Provider>
  );
};

const useConfirmDialog = () => useContext(ConfirmDialogContext);

export { useConfirmDialog, ConfirmDialogContextProvider };
