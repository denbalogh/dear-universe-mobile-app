import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB, Text, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { formatFullDate, parseDateId } from "@/utils/date";
import { NewEntrySearchTermParams } from "@/types/newEntryTextScreen";
import ImageGallery from "@/components/ImageGallery/ImageGallery";
import useCamera from "@/hooks/useCamera";
import useImageLibrary from "@/hooks/useImageLibrary";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";
import {
  documentDirectory,
  getInfoAsync,
  makeDirectoryAsync,
  moveAsync,
} from "expo-file-system";
import { ImagePickerAsset } from "expo-image-picker";

export const IMAGES_DIR = `${documentDirectory}images/`;

const NewEntryImageScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId, comingFromScreen } =
    useLocalSearchParams<NewEntrySearchTermParams>();
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

  const [imagesURI, setImagesURI] = useState<string[]>([]);

  const handleAddImages = (newImages: ImagePickerAsset[]) => {
    const newImagesURI = newImages.map((image) => image.uri);

    setImagesURI((prevImagesURI) => [...prevImagesURI, ...newImagesURI]);
  };

  const openCamera = useCamera(handleAddImages);
  const openImageLibrary = useImageLibrary(handleAddImages);

  const hasImages = imagesURI.length > 0;

  const handleOnDeletePress = (index: number) => {
    setImagesURI((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleMoveLeftPress = (index: number) => {
    setImagesURI((prevImages) => {
      const newImages = [...prevImages];
      const [removedImage] = newImages.splice(index, 1);
      newImages.splice(index - 1, 0, removedImage);
      return newImages;
    });
  };

  const handleMoveRightPress = (index: number) => {
    setImagesURI((prevImages) => {
      const newImages = [...prevImages];
      const [removedImage] = newImages.splice(index, 1);
      newImages.splice(index + 1, 0, removedImage);
      return newImages;
    });
  };

  const { showDiscardDialog } = useDiscardDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showDiscardDialog({
      message: "Do you wish to discard the images?",
      callback: router.back,
    });
  }, [showDiscardDialog, router.back]);

  const handleBackPress = () => {
    if (hasImages) {
      handleShowDiscardDialog();
    } else {
      router.back();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (hasImages) {
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
    }, [hasImages, handleShowDiscardDialog]),
  );

  const handleSavePress = async () => {
    const { exists } = await getInfoAsync(IMAGES_DIR);

    if (!exists) {
      await makeDirectoryAsync(IMAGES_DIR);
    }

    const newImages = [];

    for (const uri of imagesURI) {
      const filename = uri.split("/").pop();
      const dest = `${IMAGES_DIR}${filename}`;

      await moveAsync({
        from: uri,
        to: dest,
      });

      newImages.push(dest);
    }

    createEntryWithImages(newImages);
  };

  const createEntryWithImages = (imagesURI: string[]) => {
    if (dayObject === null) {
      return;
    }

    realm.write(() => {
      const entry = realm.create(Entry, {
        imagesURI,
        day: dayObject,
      });

      dayObject.entryObjects.push(entry);
    });

    if (comingFromScreen === "index") {
      router.replace({
        pathname: "/day/[dateId]",
        params: { dateId },
      });
    } else {
      router.back();
    }
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
        }}
      />
      <View style={styles.contentWrapper}>
        <Text variant="titleMedium" style={styles.subheading}>
          {formatFullDate(parseDateId(dateId))}
        </Text>
        <Text variant="headlineLarge" style={styles.headline}>
          Creating new entry
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
              saveButton={{ onPress: handleSavePress }}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default NewEntryImageScreen;

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
    paddingBottom: spacing.spaceLarge,
    marginTop: spacing.spaceMedium,
  },
  imageSourceButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  imageSourceTitle: {
    marginBottom: spacing.spaceMedium,
    textAlign: "center",
  },
  bottomButtons: {
    padding: spacing.spaceMedium,
  },
});
