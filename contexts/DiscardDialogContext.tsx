import DiscardDialog from "@/components/DiscardDialog/DiscardDialog";
import React, { createContext, ReactNode, useContext, useState } from "react";

type DiscardDialogContextType = {
  showDiscardDialog: (args: { message: string; callback: () => void }) => void;
};

const DiscardDialogContext = createContext<DiscardDialogContextType>({
  showDiscardDialog: () => {},
});

const DiscardDialogContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [discardDialogMessage, setDiscardDialogMessage] = useState<string>("");
  const [discardDialogCallback, setDiscardDialogCallback] = useState<
    () => void
  >(() => {});

  const dismissDiscardDialog = () => {
    setDiscardDialogMessage("");
  };

  const showDiscardDialog = ({
    message,
    callback,
  }: {
    message: string;
    callback: () => void;
  }) => {
    setDiscardDialogMessage(message);
    setDiscardDialogCallback(() => callback); // useState expects value or a function that returns a value, so we wrap the callback in a function to return the callback as a value
  };

  return (
    <DiscardDialogContext.Provider value={{ showDiscardDialog }}>
      {children}
      <DiscardDialog
        text={discardDialogMessage}
        isVisible={discardDialogMessage !== ""}
        hideDialog={dismissDiscardDialog}
        onConfirm={discardDialogCallback}
      />
    </DiscardDialogContext.Provider>
  );
};

const useDiscardDialog = () => useContext(DiscardDialogContext);

export { useDiscardDialog, DiscardDialogContextProvider };
