import { roundness, spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import BottomSheet from "@gorhom/bottom-sheet";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import TextSection from "./TextSection";
import RecordingSection from "./RecordingSection";
import MediaSection from "./MediaSection/MediaSection";
import FeelingsSection from "./FeelingsSection/FeelingsSection";
import { Button, SegmentedButtons } from "react-native-paper";
import { Stack } from "expo-router";
import { useDay } from "@/common/providers/DayProvider";
import ConfirmButton from "../ConfirmButton";

enum Tabs {
  Text = "text",
  Recording = "recording",
  Media = "media",
  Feelings = "feelings",
}

type BottomSheetContextType = {
  activeSnapPoint: number;
  setActiveSnapPoint: (index: number) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType>({
  activeSnapPoint: -1,
  setActiveSnapPoint: () => {},
});

const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const theme = useCustomTheme();
  const day = useDay();

  const [activeSnapPoint, setActiveSnapPoint] = useState(day.title ? 0 : -1);

  const onChange = useCallback((index: number) => {
    setActiveSnapPoint(index);
  }, []);

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Text);

  const ActiveSection = useMemo(() => {
    switch (activeTab) {
      case Tabs.Text:
        return TextSection;
      case Tabs.Recording:
        return RecordingSection;
      case Tabs.Media:
        return MediaSection;
      case Tabs.Feelings:
        return FeelingsSection;
    }
  }, [activeTab]);

  const snapPoints = useMemo(() => ["50%", "100%"], []);

  const onTabChange = useCallback((tab: string) => {
    setActiveTab(tab as Tabs);
    setActiveSnapPoint(0);
  }, []);

  const tabButtonStyle = {
    borderWidth: 0,
  };

  const isBottomSheetHidden = activeSnapPoint === -1;

  return (
    <BottomSheetContext.Provider
      value={{ activeSnapPoint, setActiveSnapPoint }}
    >
      <Stack.Screen
        options={{
          navigationBarColor: isBottomSheetHidden
            ? theme.colors.surface
            : theme.colors.background,
        }}
      />
      {children}
      <Button
        icon="arrow-up"
        onPress={() => setActiveSnapPoint(0)}
        style={styles.showPanelButton}
      >
        Show editor
      </Button>
      <BottomSheet
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        handleStyle={{
          backgroundColor: theme.colors.background,
          borderRadius: roundness,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.onBackground }}
        enableDynamicSizing={false}
        // onChange={onChange} // We save active snap index to state to trigger render,
        index={activeSnapPoint} // because buttons inside bottom sheet weren't responding to presses
        android_keyboardInputMode="adjustResize"
        style={styles.bottomSheet}
      >
        <View style={styles.bottomSheetContentWrapper}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={onTabChange}
            buttons={[
              {
                value: Tabs.Text,
                icon: "pen",
                style: tabButtonStyle,
              },
              {
                value: Tabs.Recording,
                icon: "microphone",
                style: tabButtonStyle,
              },
              {
                value: Tabs.Media,
                icon: "image-multiple",
                style: tabButtonStyle,
              },
              {
                value: Tabs.Feelings,
                icon: "emoticon-neutral-outline",
                style: tabButtonStyle,
              },
            ]}
          />
          <View style={styles.sectionWrapper}>
            <ActiveSection />
          </View>
        </View>
      </BottomSheet>
      <ConfirmButton />
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => useContext(BottomSheetContext);

export default BottomSheetProvider;

const styles = StyleSheet.create({
  showPanelButton: {
    marginVertical: spacing.spaceSmall,
  },
  bottomSheet: {
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: roundness,
  },
  bottomSheetContentWrapper: {
    flex: 1,
    padding: spacing.spaceSmall,
  },
  sectionWrapper: {
    paddingVertical: spacing.spaceMedium,
  },
});
