import React from "react";
import Entry from "../Entry/Entry";
import { ScrollView, StyleSheet, View } from "react-native";
import { List } from "realm";
import { Entry as EntryModel } from "@/models/Entry";
import { spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import NoEntries from "../NoEntries/NoEntries";
import AfterEntriesMessage from "../AfterEntriesMessage/AfterEntriesMessage";
import { FOCUS_DESCRIPTION, FOCUS_TITLE } from "@/constants/screens";

const BOTTOM_BUTTONS_HEIGHT = 130;

type Props = {
  entries: List<EntryModel> | undefined;
  bottomPadding?: boolean;
};

const EntriesList = ({ entries, bottomPadding }: Props) => {
  const router = useRouter();

  if (entries === undefined) {
    return null;
  }

  const hasEntries = entries.length > 0;

  return (
    <View style={styles.wrapper}>
      {hasEntries ? (
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
          <AfterEntriesMessage />
        </ScrollView>
      ) : (
        <NoEntries style={styles.bottomMargin} />
      )}
    </View>
  );
};

export default EntriesList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentWrapper: {
    paddingHorizontal: spacing.spaceSmall,
    paddingTop: spacing.spaceSmall,
  },
  bottomPadding: {
    paddingBottom: BOTTOM_BUTTONS_HEIGHT,
  },
  bottomMargin: {
    marginBottom: BOTTOM_BUTTONS_HEIGHT,
  },
  entry: {
    marginBottom: spacing.spaceMedium,
  },
});
