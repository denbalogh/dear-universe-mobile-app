import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { default as OriginalBottomSheet } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import TextSection from "./TextSection";
import RecordingSection from "./RecordingSection";
import MediaSection from "./MediaSection";
import FeelingsSection from "./FeelingsSection";
import { SegmentedButtons } from "react-native-paper";

enum Tabs {
  Text = "text",
  Recording = "recording",
  Media = "media",
  Feelings = "feelings",
}

type Props = {
  defaultSnapPoint: number;
};

const BottomSheet = ({ defaultSnapPoint }: Props) => {
  const theme = useCustomTheme();

  const bottomSheetRef = useRef<OriginalBottomSheet>(null);
  const [activeSnapPoint, setActiveSnapPoint] = useState(defaultSnapPoint);

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

  const snapPoints = useMemo(() => {
    switch (activeTab) {
      case Tabs.Text:
      case Tabs.Media:
      case Tabs.Feelings:
        return [90, "50%", "100%"];
      case Tabs.Recording:
        return [90, 220];
    }
  }, [activeTab]);

  const onTabChange = useCallback((tab: string) => {
    setActiveTab(tab as Tabs);
    setActiveSnapPoint(1);
  }, []);

  const tabButtonStyle = {
    borderWidth: 0,
  };

  return (
    <OriginalBottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleStyle={{
        backgroundColor: theme.colors.background,
        borderRadius: roundness,
      }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.onBackground }}
      enableDynamicSizing={false}
      onChange={onChange} // We save active snap index to state to trigger render,
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
    </OriginalBottomSheet>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
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
