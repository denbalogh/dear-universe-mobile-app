import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import { spacing } from "@/common/constants/theme";
import Entry from "./Entry/Entry";
import { useDay } from "@/common/providers/DayProvider";
import Sortable, {
  SortableGridDragEndParams,
  SortableGridRenderItem,
} from "react-native-sortables";
import EntryEditor from "./Entry/NewEntryEditor";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import EntryModel from "@/common/models/Entry";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";

const EntriesList = () => {
  const { entries } = useDay();
  const { entryId, setNewEntryId } = useEntryEditor();

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  const handleAddNewEntry = () => {
    setNewEntryId();
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const keyExtractor = useCallback((item: EntryModel) => item.id, []);

  const renderItem = useCallback<SortableGridRenderItem<EntryModel>>(
    ({ item }) => <Entry key={item.id} entry={item} />,
    [],
  );

  const handleDragEnd = useCallback(
    (params: SortableGridDragEndParams<EntryModel>) => console.log(params),
    [],
  );

  return (
    <>
      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.universeText}>
          The universe is listening. Share your day.
        </Text>
        <Sortable.Grid<EntryModel>
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onDragEnd={handleDragEnd}
          columns={1}
          rowGap={spacing.spaceSmall}
          customHandle={true}
          scrollableRef={scrollViewRef}
          data={entries}
        />
        <EntryEditor />
      </Animated.ScrollView>
      {!entryId && (
        <FAB
          style={styles.addButton}
          variant="tertiary"
          icon="plus"
          onPress={handleAddNewEntry}
        />
      )}
    </>
  );
};

export default EntriesList;

const styles = StyleSheet.create({
  scrollViewContent: {
    maxWidth: "100%",
    padding: spacing.spaceSmall,
    paddingBottom: 120,
  },
  universeText: {
    textAlign: "center",
    marginBottom: spacing.spaceSmall,
  },
  addButton: {
    position: "absolute",
    bottom: spacing.spaceLarge,
    right: spacing.spaceMedium,
  },
});
