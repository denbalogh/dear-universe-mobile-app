import SettingsDrawerContent from "@/components/SettingsDrawerContent/SettingsDrawerContent";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BackHandler } from "react-native";
import { Drawer } from "react-native-drawer-layout";

type SettingsDrawerContextType = {
  showSettingsDrawer: () => void;
  closeSettingsDrawer: () => void;
};

const SettingsDrawerContext = createContext<SettingsDrawerContextType>({
  showSettingsDrawer: () => {},
  closeSettingsDrawer: () => {},
});

const SettingsDrawerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        closeDrawer();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [isOpen]);

  const renderDrawerContent = useCallback(() => {
    return <SettingsDrawerContent closeDrawer={closeDrawer} />;
  }, []);

  return (
    <SettingsDrawerContext.Provider
      value={{
        showSettingsDrawer: openDrawer,
        closeSettingsDrawer: closeDrawer,
      }}
    >
      <Drawer
        open={isOpen}
        onOpen={openDrawer}
        onClose={closeDrawer}
        renderDrawerContent={renderDrawerContent}
      >
        {children}
      </Drawer>
    </SettingsDrawerContext.Provider>
  );
};

const useSettingsDrawer = () => useContext(SettingsDrawerContext);

export { useSettingsDrawer, SettingsDrawerContextProvider };
