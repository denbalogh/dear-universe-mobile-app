import React from "react";
import Entry from "../Entry/Entry";
import { ScrollView, StyleSheet } from "react-native";
import { List } from "realm";
import { Entry as EntryModel } from "@/models/Entry";
import { spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import {
  FOCUS_DESCRIPTION,
  FOCUS_TITLE,
} from "../TitleDescriptionEditor/constants";

type Props = {
  entries: List<EntryModel> | undefined;
  bottomPadding?: boolean;
};

const EntriesList = ({ entries, bottomPadding }: Props) => {
  const router = useRouter();

  if (entries === undefined) {
    return null;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollContentWrapper,
        bottomPadding && styles.bottomPadding,
      ]}
    >
      {entries.map((entry) => {
        const { _id, title, description } = entry;

        const titleProp = {
          text: title || "",
          onPress: () =>
            router.navigate({
              pathname: `./entry/${_id.toString()}/text`,
              params: FOCUS_TITLE,
            }),
        };

        const descriptionProp = {
          text: description || "",
          onPress: () =>
            router.navigate({
              pathname: `./entry/${_id.toString()}/text`,
              params: FOCUS_DESCRIPTION,
            }),
        };

        return (
          <Entry
            key={_id.toString()}
            style={styles.entry}
            title={title ? titleProp : undefined}
            text={description ? descriptionProp : undefined}
          />
        );
      })}
    </ScrollView>
  );
};

export default EntriesList;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContentWrapper: {
    paddingHorizontal: spacing.spaceSmall,
  },
  bottomPadding: {
    paddingBottom: 120,
  },
  entry: {
    marginBottom: spacing.spaceSmall,
  },
});
