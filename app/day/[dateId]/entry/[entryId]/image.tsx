import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB, Text, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { formatFullDate, parseDateId } from "@/utils/date";
import useCamera from "@/hooks/useCamera";
import useMediaLibrary from "@/hooks/useMediaLibrary";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { EntrySearchParams } from "@/types/createEditEntryScreen";
import { BSON } from "realm";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  deleteAsync,
  getInfoAsync,
  makeDirectoryAsync,
  moveAsync,
} from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
import { isEqual } from "lodash";
import EditableImageGallery from "@/components/MediaGallery/EditableImageGallery";
import { IMAGES_DIR } from "@/constants/files";

const EditEntryImagesScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId, entryId } = useLocalSearchParams<EntrySearchParams>();

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const { imagesUri: initialImagesUri = [] } = entryObject || {};

  const hasInitialImages = initialImagesUri.length > 0;

  const [imagesUri, setImagesUri] = useState<string[]>(initialImagesUri);
  const imagesToDelete = useRef<string[]>([]);

  const handleAddImages = (newImages: ImagePickerAsset[]) => {
    const newImagesUri = newImages.map((image) => image.uri);

    setImagesUri((prevImagesUri) => [...prevImagesUri, ...newImagesUri]);
  };

  const openCamera = useCamera("images", handleAddImages);
  const openImageLibrary = useMediaLibrary("images", handleAddImages);

  const hasImages = imagesUri.length > 0;

  const handleOnDeletePress = (index: number) => {
    imagesToDelete.current.push(imagesUri[index]);

    setImagesUri((prevImagesUri) =>
      prevImagesUri.filter((_, i) => i !== index),
    );
  };

  const handleMoveLeftPress = (index: number) => {
    setImagesUri((prevImagesUri) => {
      const newImagesUri = [...prevImagesUri];
      const [removedImageUri] = newImagesUri.splice(index, 1);
      newImagesUri.splice(index - 1, 0, removedImageUri);
      return newImagesUri;
    });
  };

  const handleMoveRightPress = (index: number) => {
    setImagesUri((prevImagesUri) => {
      const newImagesUri = [...prevImagesUri];
      const [removedImageUri] = newImagesUri.splice(index, 1);
      newImagesUri.splice(index + 1, 0, removedImageUri);
      return newImagesUri;
    });
  };

  const isEdited = !isEqual(imagesUri, initialImagesUri);

  const { showConfirmDialog } = useConfirmDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showConfirmDialog("Do you wish to discard the changes?", router.back);
  }, [showConfirmDialog, router.back]);

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

  const handleSavePress = async () => {
    const { exists } = await getInfoAsync(IMAGES_DIR);

    if (!exists) {
      await makeDirectoryAsync(IMAGES_DIR);
    }

    // Delete images that were removed
    for (const image of imagesToDelete.current) {
      await deleteAsync(image);
    }

    const newImages = [];

    for (const imageUri of imagesUri) {
      const isImageNew = !initialImagesUri.includes(imageUri);

      if (isImageNew) {
        const filename = imageUri.split("/").pop();
        const dest = `${IMAGES_DIR}${filename}`;

        await moveAsync({
          from: imageUri,
          to: dest,
        });

        newImages.push(dest);
      } else {
        newImages.push(imageUri);
      }
    }

    updateEntryWithImages(newImages);
  };

  const updateEntryWithImages = (imagesUri: string[]) => {
    if (entryObject === null) {
      return;
    }

    realm.write(() => {
      entryObject.imagesUri = imagesUri;
    });

    router.back();
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
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
        <Text variant="titleMedium" style={styles.subheading}>
          {formatFullDate(parseDateId(dateId))}
        </Text>
        <Text variant="headlineLarge" style={styles.headline}>
          {hasInitialImages ? "Editing images" : "Adding images"}
        </Text>
        {!hasImages ? (
          <View style={styles.imageSourceWrapper}>
            <Text variant="bodyLarge" style={styles.imageSourceTitle}>
              Choose source of the images:
            </Text>
            <View style={styles.imageSourceButtonsWrapper}>
              <FAB
                mode="elevated"
                icon="camera"
                label="Take a photo"
                onPress={openCamera}
              />
              <FAB
                mode="elevated"
                icon="folder-multiple-image"
                label="From gallery"
                onPress={openImageLibrary}
              />
            </View>
            {hasInitialImages && (
              <CloseSaveButtons
                style={styles.bottomButtons}
                closeButton={{ onPress: handleBackPress }}
                saveButton={{ onPress: handleSavePress, disabled: !isEdited }}
              />
            )}
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <EditableImageGallery
                imagesUri={imagesUri}
                optionsCallbacks={{
                  onDeletePress: handleOnDeletePress,
                  onMoveLeftPress: handleMoveLeftPress,
                  onMoveRightPress: handleMoveRightPress,
                }}
                addButtons={[
                  {
                    leadingIcon: "camera",
                    title: "Take a photo",
                    onPress: openCamera,
                  },
                  {
                    leadingIcon: "folder-multiple-image",
                    title: "From gallery",
                    onPress: openImageLibrary,
                  },
                ]}
              />
            </ScrollView>
            <CloseSaveButtons
              style={styles.bottomButtons}
              closeButton={{ onPress: handleBackPress }}
              saveButton={{ onPress: handleSavePress, disabled: !isEdited }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default EditEntryImagesScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  subheading: {
    margin: spacing.spaceMedium,
    marginBottom: 0,
  },
  headline: {
    margin: spacing.spaceMedium,
    marginTop: 0,
  },
  scrollViewContent: {
    padding: spacing.spaceMedium,
  },
  extraItemWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageSourceWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "stretch",
    marginTop: spacing.spaceMedium,
  },
  imageSourceButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: spacing.spaceLarge,
  },
  imageSourceTitle: {
    marginBottom: spacing.spaceMedium,
    textAlign: "center",
  },
  bottomButtons: {
    padding: spacing.spaceMedium,
  },
});
