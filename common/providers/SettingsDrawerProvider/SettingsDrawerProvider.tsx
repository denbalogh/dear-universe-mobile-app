import SettingsDrawerContent from "@/common/providers/SettingsDrawerProvider/SettingsDrawerContent/SettingsDrawerContent";
import useBackHandler from "@/common/hooks/useBackHandler";
import { useSegments } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Drawer } from "react-native-drawer-layout";

type SettingsDrawerContextType = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

const SettingsDrawerContext = createContext<SettingsDrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

const SettingsDrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const segments = useSegments();
  const { termsAndPoliciesUnderstood = false } = {};

  const isOnLockScreen = useMemo(() => {
    return segments.length === 1 && segments[0] === "lock";
  }, [segments]);

  const isOnTermsScreen = useMemo(() => {
    return segments.length === 1 && segments[0] === "terms";
  }, [segments]);

  const isSwipeDisabled =
    isOnLockScreen || (isOnTermsScreen && !termsAndPoliciesUnderstood);

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  const onAndroidBackButtonPress = useCallback(() => {
    if (isOpen) {
      closeDrawer();
      return true;
    }
    return false;
  }, [isOpen, closeDrawer]);

  useBackHandler(onAndroidBackButtonPress);

  const renderDrawerContent = useCallback(() => {
    return <SettingsDrawerContent />;
  }, []);

  return (
    <SettingsDrawerContext.Provider
      value={{
        openDrawer: openDrawer,
        closeDrawer: closeDrawer,
      }}
    >
      <Drawer
        open={isOpen}
        onOpen={openDrawer}
        onClose={closeDrawer}
        renderDrawerContent={renderDrawerContent}
        swipeEnabled={!isSwipeDisabled}
      >
        {children}
      </Drawer>
    </SettingsDrawerContext.Provider>
  );
};

export const useSettingsDrawer = () => useContext(SettingsDrawerContext);

export default SettingsDrawerProvider;
