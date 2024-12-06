import React, { ReactNode } from "react";
import Entry from "../Entry/Entry";
import { ScrollView, StyleSheet, View } from "react-native";
import { List } from "realm";
import { Entry as EntryModel } from "@/models/Entry";
import { spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import BeginningHints from "../BeginningHints/BeginningHints";
import AfterEntriesMessage from "../AfterEntriesMessage/AfterEntriesMessage";
import { FOCUS_DESCRIPTION, FOCUS_TITLE } from "@/constants/screens";
import { Text } from "react-native-paper";

type Props = {
  dayTitleComponent: ReactNode;
  entries: List<EntryModel> | undefined;
  bottomPadding?: boolean;
};

const EntriesList = ({ dayTitleComponent, entries, bottomPadding }: Props) => {
  const router = useRouter();

  const hasEntries = entries && entries.length > 0;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContentWrapper,
          bottomPadding && styles.bottomPadding,
        ]}
      >
        {dayTitleComponent}
        {!hasEntries && (
          <Text variant="titleLarge" style={styles.noEntriesTitle}>
            You can add multiple entries with text, recording, images and
            videos.
          </Text>
        )}
        {hasEntries &&
          entries.map((entry) => {
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
        {hasEntries && <AfterEntriesMessage />}
      </ScrollView>
      {!hasEntries && <BeginningHints style={styles.bottomPadding} />}
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
  noEntriesTitle: {
    marginVertical: spacing.spaceMedium,
    textAlign: "center",
  },
  bottomPadding: {
    paddingBottom: 130,
  },
  entry: {
    marginBottom: spacing.spaceMedium,
  },
});
