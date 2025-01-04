import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View, BackHandler, ScrollView } from "react-native";
import { Appbar, Card, Text } from "react-native-paper";
import { roundness, spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { BSON, UpdateMode } from "realm";
import { EntrySearchTermParams } from "@/types/entryTextScreen";
import EmotionChips from "@/components/FeelingsScreen/EmotionChips";
import { FEELING_GROUP_NAMES, feelings } from "@/constants/feelings";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";
import { formatFullDate, parseDateId } from "@/utils/date";
import { isEqual, sortBy } from "lodash";

const COLLAPSED_CARD_HEIGHT = 70;

const FeelingsScreen = () => {
  const theme = useCustomTheme();
  const realm = useRealm();
  const router = useRouter();

  const scrollViewRef = useRef<ScrollView>(null);
  const scrolledToActiveGroupOnMount = useRef(false);

  const handleScrollToGroup = (groupIndex: number) => {
    if (scrolledToActiveGroupOnMount.current) {
      return;
    }

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: groupIndex * (COLLAPSED_CARD_HEIGHT + spacing.spaceSmall),
        animated: false,
      });

      scrolledToActiveGroupOnMount.current = true;
    }
  };

  const { entryId, dateId } = useLocalSearchParams<EntrySearchTermParams>();

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const { feelings: initialFeelings } = entryObject || {};

  const initialActiveGroup = initialFeelings?.name || null;
  const initialActiveEmotions = initialFeelings?.emotions || [];

  const [activeGroup, setActiveGroup] = useState(initialActiveGroup);
  const [activeEmotions, setActiveEmotions] = useState(initialActiveEmotions);

  const handleSetActiveGroup = (name: FEELING_GROUP_NAMES) => {
    if (activeGroup === name) {
      return;
    }

    setActiveGroup(name);
    setActiveEmotions([]);
  };

  const handleSetEmotion = useCallback(
    (emotion: string) => {
      if (activeEmotions.includes(emotion)) {
        setActiveEmotions(
          activeEmotions.filter((activeEmotion) => activeEmotion !== emotion),
        );
      } else {
        setActiveEmotions([...activeEmotions, emotion]);
      }
    },
    [activeEmotions, setActiveEmotions],
  );

  const isEdited =
    !isEqual(activeGroup, initialActiveGroup) ||
    !isEqual(sortBy(activeEmotions), sortBy(initialActiveEmotions));

  const { showDiscardDialog } = useDiscardDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showDiscardDialog({
      message: "Do you wish to discard the changes?",
      callback: router.back,
    });
  }, [showDiscardDialog, router.back]);

  const handleBackPress = () => {
    if (isEdited) {
      handleShowDiscardDialog();
    } else {
      router.back();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEdited) {
          handleShowDiscardDialog();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [isEdited, handleShowDiscardDialog]),
  );

  const handleUpdateEntry = () => {
    if (!entryObject || !activeGroup) {
      return;
    }

    realm.write(() => {
      realm.create(
        "Entry",
        {
          _id: entryObject._id,
          feelings: {
            name: activeGroup,
            emotions: activeEmotions,
          },
        },
        UpdateMode.Modified,
      );
    });

    router.back();
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={handleBackPress} />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.surface,
        }}
      />
      <View style={styles.contentWrapper}>
        <View>
          <Text variant="titleMedium" style={styles.subheading}>
            {formatFullDate(parseDateId(dateId))}
          </Text>
          <Text variant="headlineLarge" style={styles.headline}>
            How did you feel?
          </Text>
        </View>
        <View style={styles.scrollViewWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            ref={scrollViewRef}
          >
            {feelings.map(({ name, emotions }, index) => {
              const isActive = activeGroup === name;

              const handleOnLayout = () => {
                if (isActive) {
                  handleScrollToGroup(index);
                }
              };

              return (
                <Card
                  key={name}
                  style={[
                    styles.card,
                    isActive && {
                      backgroundColor: theme.colors[`${name}Container`],
                    },
                  ]}
                  onPress={() => handleSetActiveGroup(name)}
                  onLayout={handleOnLayout}
                >
                  <Card.Content
                    style={{
                      paddingHorizontal: spacing.spaceMedium,
                      paddingVertical: spacing.spaceMedium,
                    }}
                  >
                    <Text
                      variant="titleLarge"
                      style={[
                        isActive && styles.feelingsGroupName,
                        {
                          color: isActive
                            ? // Active color
                              theme.colors[`on${name}Container`]
                            : // Inactive color
                              theme.colors[name],
                        },
                      ]}
                    >
                      {name}
                    </Text>
                    {isActive && (
                      <EmotionChips
                        emotions={emotions}
                        activeEmotions={activeEmotions}
                        onEmotionPress={handleSetEmotion}
                        feelingsGroupName={name}
                      />
                    )}
                  </Card.Content>
                </Card>
              );
            })}
          </ScrollView>
        </View>
        <CloseSaveButtons
          style={styles.bottomButtonsWrapper}
          closeButton={{ onPress: handleBackPress }}
          saveButton={{
            disabled: !isEdited || activeEmotions.length === 0, // Disable save button if no emotions are selected
            onPress: handleUpdateEntry,
          }}
        />
      </View>
    </View>
  );
};

export default FeelingsScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  subheading: {
    padding: spacing.spaceMedium,
    paddingBottom: 0,
  },
  headline: {
    padding: spacing.spaceMedium,
    paddingTop: 0,
  },
  scrollViewWrapper: {
    flexShrink: 1,
  },
  scrollViewContent: {
    paddingHorizontal: spacing.spaceMedium,
    paddingTop: spacing.spaceSmall,
  },
  card: {
    minHeight: COLLAPSED_CARD_HEIGHT,
    borderRadius: roundness,
    marginBottom: spacing.spaceSmall,
  },
  feelingsGroupName: {
    marginBottom: spacing.spaceSmall,
  },
  bottomButtonsWrapper: {
    padding: spacing.spaceMedium,
  },
});
