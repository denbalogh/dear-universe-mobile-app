import React, { useEffect } from "react";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { NewEntrySearchTermParams } from "@/types/newEntryTextScreen";
import { formatFullDate, parseDateId } from "@/utils/date";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";
import CreateEditEntry from "@/components/CreateEditEntry/CreateEditEntry";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { EntryData } from "@/components/Entry/Entry";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";

const NewEntryScreen = () => {
  const theme = useCustomTheme();
  const realm = useRealm();
  const router = useRouter();
  const { showConfirmDialog } = useConfirmDialog();

  const { dateId } = useLocalSearchParams<NewEntrySearchTermParams>();
  const dayObject = useObject(Day, dateId);

  useEffect(() => {
    if (dayObject === null) {
      realm.write(() => {
        realm.create(Day, {
          _id: dateId,
        });
      });
    }
  }, [dateId, dayObject, realm]);

  const formattedDate = formatFullDate(parseDateId(dateId));

  const handleOnEntrySave = (entryData: EntryData) => {
    showConfirmDialog("Do you wish to save this entry?", () => {
      console.log(entryData);
    });
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={() => {}} />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.surface,
        }}
      />
      <CreateEditEntry
        mode="create"
        formattedDate={formattedDate}
        title=""
        description=""
        recordingUri=""
        imagesUri={[]}
        videosWithThumbnail={[]}
        feelingsActiveGroup=""
        feelingsActiveEmotions={[]}
        onSave={handleOnEntrySave}
      />
    </View>
  );
};

export default NewEntryScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
