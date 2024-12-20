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
import ImageGallery from "@/components/ImageGallery/ImageGallery";
import useCamera from "@/hooks/useCamera";
import useImageLibrary from "@/hooks/useImageLibrary";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { IMAGES_DIR } from "../new/image";
import { EntrySearchTermParams } from "@/types/entryTextScreen";
import { BSON } from "realm";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";
import {
  deleteAsync,
  getInfoAsync,
  makeDirectoryAsync,
  moveAsync,
} from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";
import { isEqual } from "lodash";

const EditEntryImagesScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId, entryId } = useLocalSearchParams<EntrySearchTermParams>();

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const { imagesURI: initialImagesURI = [] } = entryObject || {};

  const hasInitialImages = initialImagesURI.length > 0;

  const initialImagesURIPrepared = initialImagesURI.map((image) => ({
    new: false,
    uri: image,
  }));

  const [images, setImages] = useState(initialImagesURIPrepared);
  const imagesToDelete = useRef<string[]>([]);

  const handleAddImages = (newImages: ImagePickerAsset[]) => {
    const newImagesURI = newImages.map((image) => ({
      uri: image.uri,
      new: true,
    }));

    setImages((prevImagesURI) => [...prevImagesURI, ...newImagesURI]);
  };

  const openCamera = useCamera(handleAddImages);
  const openImageLibrary = useImageLibrary(handleAddImages);

  const hasImages = images.length > 0;

  const handleOnDeletePress = (index: number) => {
    imagesToDelete.current.push(images[index].uri);

    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleMoveLeftPress = (index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const [removedImage] = newImages.splice(index, 1);
      newImages.splice(index - 1, 0, removedImage);
      return newImages;
    });
  };

  const handleMoveRightPress = (index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const [removedImage] = newImages.splice(index, 1);
      newImages.splice(index + 1, 0, removedImage);
      return newImages;
    });
  };

  const isEdited = !isEqual(images, initialImagesURIPrepared);

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

    for (const image of images) {
      if (image.new) {
        const filename = image.uri.split("/").pop();
        const dest = `${IMAGES_DIR}${filename}`;

        await moveAsync({
          from: image.uri,
          to: dest,
        });

        newImages.push(dest);
      } else {
        newImages.push(image.uri);
      }
    }

    updateEntryWithImages(newImages);
  };

  const updateEntryWithImages = (imagesURI: string[]) => {
    if (entryObject === null) {
      return;
    }

    realm.write(() => {
      entryObject.imagesURI = imagesURI;
    });

    router.back();
  };

  const imagesURI = images.map((image) => image.uri);

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
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
              <ImageGallery
                imagesURI={imagesURI}
                optionsCallbacks={{
                  onDeletePress: handleOnDeletePress,
                  onMoveLeftPress: handleMoveLeftPress,
                  onMoveRightPress: handleMoveRightPress,
                }}
                addButtons={{
                  onCameraPress: openCamera,
                  onImageLibraryPress: openImageLibrary,
                }}
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
