import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, BackHandler, ScrollView } from "react-native";
import { Appbar, Card, Text } from "react-native-paper";
import { roundness, spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import DiscardDialog from "@/components/DiscardDialog/DiscardDialog";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { BSON, UpdateMode } from "realm";
import { EntrySearchTermParams } from "@/types/entryTextScreen";
import * as _ from "lodash";
import EmotionChips from "@/components/FeelingsScreen/EmotionChips";
import { FEELING_GROUP_NAMES, feelings } from "@/constants/feelings";
import { useCustomTheme } from "@/hooks/useCustomTheme";

const FeelingsScreen = () => {
  const theme = useCustomTheme();
  const realm = useRealm();
  const navigation = useNavigation();

  const { entryId } = useLocalSearchParams<EntrySearchTermParams>();

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const [isDiscardDialogVisible, setIsDiscardDialogVisible] = useState(false);

  const hideDiscardDialog = () => setIsDiscardDialogVisible(false);
  const showDiscardDialog = () => setIsDiscardDialogVisible(true);

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
    !_.isEqual(activeGroup, initialActiveGroup) ||
    !_.isEqual(_.sortBy(activeEmotions), _.sortBy(initialActiveEmotions));

  const handleBackPress = () => {
    if (isEdited) {
      showDiscardDialog();
    } else {
      navigation.goBack();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEdited) {
          showDiscardDialog();
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
    }, [isEdited]),
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

    navigation.goBack();
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
        }}
      />
      <View style={styles.contentWrapper}>
        <Text variant="titleLarge" style={styles.headline}>
          What emotions did you experience?
        </Text>
        <View>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {feelings.map(({ name, emotions }) => {
              const isActive = activeGroup === name;

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
      <DiscardDialog
        text="Do you wish to discard the changes?"
        isVisible={isDiscardDialogVisible}
        hideDialog={hideDiscardDialog}
        onConfirm={navigation.goBack}
      />
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
  headline: {
    padding: spacing.spaceMedium,
  },
  scrollViewContent: {
    paddingHorizontal: spacing.spaceMedium,
    paddingTop: spacing.spaceSmall,
  },
  card: {
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
