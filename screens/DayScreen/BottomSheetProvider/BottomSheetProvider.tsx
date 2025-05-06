import { roundness, spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import TextSection from "./TextSection";
import RecordingSection from "./RecordingSection";
import MediaSection from "./MediaSection/MediaSection";
import FeelingsSection from "../EntriesList/Entry/FeelingsSection/FeelingsSection";
import { Button, Text } from "react-native-paper";
import { Stack } from "expo-router";
import { useDay } from "@/common/providers/DayProvider";
import { Tabs, TabScreen, useTabNavigation } from "react-native-paper-tabs";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";

type BottomSheetContextType = {
  snapToIndex: (index: number) => void;
  switchToTab: (index: number) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType>({
  snapToIndex: () => {},
  switchToTab: () => {},
});

const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const theme = useCustomTheme();
  const { day, entries } = useDay();
  const { isEmpty } = useEntryEditor();

  const hasTitle = !!day.title;
  const hasEntries = entries.length > 0;

  const initialSnapPoint = hasTitle && !hasEntries ? 0 : -1;
  const [activeSnapPoint, setActiveSnapPoint] = useState(initialSnapPoint);

  const snapPoints = useMemo(() => ["50%", "100%"], []);

  const isBottomSheetHidden = activeSnapPoint === -1;

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapToIndex = useCallback((index: number) => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.present();
      // bottomSheetRef.current.snapToIndex(index);
    }
  }, []);

  const switchToTab = useTabNavigation();

  return (
    <BottomSheetContext.Provider value={{ snapToIndex, switchToTab }}>
      <Stack.Screen
        options={{
          navigationBarColor: isBottomSheetHidden
            ? theme.colors.surface
            : theme.colors.background,
        }}
      />
      {children}
      <BottomSheetModalProvider>
        <Button
          icon={isEmpty ? "plus" : "arrow-up"}
          onPress={() => snapToIndex(0)}
          style={styles.showPanelButton}
          mode={isEmpty ? "contained" : "text"}
        >
          {isEmpty ? "Add Entry" : "Open editor"}
        </Button>
        <BottomSheetModal
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: theme.colors.background }}
          handleStyle={{
            backgroundColor: theme.colors.background,
            borderRadius: roundness,
          }}
          handleIndicatorStyle={{ backgroundColor: theme.colors.onBackground }}
          enableDynamicSizing={false}
          onChange={setActiveSnapPoint}
          index={initialSnapPoint}
          android_keyboardInputMode="adjustResize"
          style={styles.bottomSheet}
        >
          <Tabs
            showTextLabel={false}
            style={{ backgroundColor: theme.colors.background }}
          >
            <TabScreen label="Text" icon="pen">
              <View style={styles.sectionWrapper}>
                <TextSection />
              </View>
            </TabScreen>
            <TabScreen label="Recording" icon="microphone">
              <View style={styles.sectionWrapper}>
                <RecordingSection />
              </View>
            </TabScreen>
            <TabScreen label="Media" icon="image-multiple">
              <View style={styles.sectionWrapper}>
                <MediaSection />
              </View>
            </TabScreen>
            <TabScreen label="Feelings" icon="emoticon-neutral-outline">
              <View style={styles.sectionWrapper}>
                <FeelingsSection />
              </View>
            </TabScreen>
          </Tabs>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => useContext(BottomSheetContext);

export default BottomSheetProvider;

const styles = StyleSheet.create({
  showPanelButton: {
    margin: spacing.spaceSmall,
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
    paddingHorizontal: spacing.spaceSmall,
  },
});
