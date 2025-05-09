import ConfirmDialog, {
  ConfirmDialogButtonType,
} from "@/common/components/ConfirmDialog";
import React, { createContext, ReactNode, useContext, useState } from "react";

type ConfirmDialogContextType = {
  showDialog: (
    message: string,
    confirmCallback: () => void,
    confirmType?: ConfirmDialogButtonType,
  ) => void;
};

const ConfirmDialogContext = createContext<ConfirmDialogContextType>({
  showDialog: () => {},
});

const ConfirmDialogProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>("");
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {});
  const [confirmType, setConfirmType] =
    useState<ConfirmDialogButtonType>("negative");

  const dismissConfirmDialog = () => {
    setMessage("");
  };

  const showDialog = (
    message: string,
    confirmCallback: () => void,
    confirmType: ConfirmDialogButtonType = "negative",
  ) => {
    setMessage(message);
    setConfirmType(confirmType);
    setConfirmCallback(() => confirmCallback); // useState expects value or a function that returns a value, so we wrap the callback in a function to return the callback as a value
  };

  return (
    <ConfirmDialogContext.Provider value={{ showDialog }}>
      {children}
      <ConfirmDialog
        text={message}
        isVisible={message !== ""}
        hideDialog={dismissConfirmDialog}
        onConfirm={confirmCallback}
        confirmType={confirmType}
      />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => useContext(ConfirmDialogContext);

export default ConfirmDialogProvider;
