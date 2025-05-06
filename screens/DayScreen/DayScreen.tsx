import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { formatFullDate, parseDayId } from "@/common/utils/date";
import FlingGesture from "@/common/components/FlingGesture";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import EntryEditorProvider from "@/common/providers/EntryEditorProvider";
import { DaySearchTermParams } from "@/screens/DayScreen/types";
import EntriesList from "./EntriesList/EntriesList";
import TitleInput from "./TitleInput";
import DayProvider from "@/common/providers/DayProvider";

const DayScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { dayId } = useLocalSearchParams<DaySearchTermParams>();

  const fullDate = useMemo(() => formatFullDate(parseDayId(dayId)), [dayId]);

  return (
    <FlingGesture onFlingRight={router.back}>
      <View
        style={[
          styles.flex,
          { backgroundColor: theme.colors.surface, paddingBottom: bottom },
        ]}
      >
        <Stack.Screen
          options={{
            header: () => (
              <Appbar.Header>
                <Appbar.BackAction onPress={router.back} />
                <Appbar.Content title={fullDate} />
              </Appbar.Header>
            ),
          }}
        />
        <DayProvider dayId={dayId}>
          <EntryEditorProvider>
            <TitleInput />
            <EntriesList />
          </EntryEditorProvider>
        </DayProvider>
      </View>
    </FlingGesture>
  );
};

export default DayScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
