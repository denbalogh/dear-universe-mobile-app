import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { formatFullDate, parseDayId } from "@/common/utils/date";
import { useSnackbar } from "@/common/contexts/SnackbarContext";
import FlingGesture from "@/common/components/FlingGesture";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EntryDraftContextProvider } from "@/contexts/EntryDraftContext";
import ConfirmButton from "@/screens/DayScreen/ConfirmButton";
import { DaySearchTermParams } from "@/screens/DayScreen/types";
import EntriesList from "./EntriesList/EntriesList";
import BottomSheet from "./BottomSheet/BottomSheet";
import useDay from "@/common/hooks/useDay";
import database from "@/common/models/db";
import TitleInput from "./TitleInput";

const DayScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();

  const { dayId } = useLocalSearchParams<DaySearchTermParams>();
  const day = useDay(dayId);

  const handleOnSubmit = useCallback(
    async (title: string) => {
      if (!day) return;

      await database.write(async () => {
        await day.update((d) => {
          d.title = title;
        });
      });

      showSnackbar("Title for the day was updated");
    },
    [day, showSnackbar],
  );

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
        {day && (
          <>
            <TitleInput
              defaultValue={day.title || ""}
              onSubmit={handleOnSubmit}
            />
            <EntryDraftContextProvider>
              <EntriesList />
              <BottomSheet />
              <ConfirmButton />
            </EntryDraftContextProvider>
          </>
        )}
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
