import { FOCUS_DESCRIPTION, FOCUS_TITLE } from "@/constants/screens";
import { Entry as EntryType } from "@/models/Entry";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import Entry from "../Entry/Entry";
import { StyleSheet } from "react-native";
import { spacing } from "@/constants/theme";
import { useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { MenuItemProps } from "react-native-paper";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";
import { deleteAsync } from "expo-file-system";

type Props = {
  entryObject: EntryType;
  dayObject: Day | null;
  index: number;
};

const EntryWithData = ({ entryObject, dayObject, index }: Props) => {
  const router = useRouter();
  const realm = useRealm();
  const theme = useCustomTheme();

  const { showDiscardDialog } = useDiscardDialog();

  const {
    _id,
    title,
    description,
    feelings,
    recordingURI,
    imagesURI = [],
    videosWithThumbnail = [],
  } = entryObject;

  // Delete entry if it has no title, description, recording or images
  useEffect(() => {
    if (
      !title &&
      !description &&
      !recordingURI &&
      imagesURI.length === 0 &&
      videosWithThumbnail.length === 0
    ) {
      realm.write(() => {
        realm.delete(entryObject);
      });
    }
  }, [
    title,
    description,
    recordingURI,
    imagesURI,
    videosWithThumbnail,
    entryObject,
    realm,
  ]);

  const titleProp = title
    ? {
        text: title || "",
        onPress: () =>
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}/text`,
              params: FOCUS_TITLE,
            },
            { relativeToDirectory: true },
          ),
      }
    : undefined;

  const descriptionProp = description
    ? {
        text: description || "",
        onPress: () =>
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}/text`,
              params: FOCUS_DESCRIPTION,
            },
            { relativeToDirectory: true },
          ),
      }
    : undefined;

  const handleFeelingsPress = () => {
    router.navigate(
      { pathname: `./entry/${_id.toString()}/feelings` },
      { relativeToDirectory: true },
    );
  };

  const moveMenuItems: MenuItemProps[] = useMemo(() => {
    if (dayObject === null) {
      return [];
    }

    const { entryObjects } = dayObject;

    const menuItems = [];

    if (index !== 0) {
      menuItems.push({
        leadingIcon: "arrow-collapse-up",
        title: "Move to top",
        onPress: () => {
          realm.write(() => {
            entryObjects.move(index, 0);
          });
        },
      });
      menuItems.push({
        leadingIcon: "arrow-up",
        title: "Move up",
        onPress: () => {
          realm.write(() => {
            entryObjects.move(index, index - 1);
          });
        },
      });
    }

    if (index !== entryObjects?.length - 1) {
      menuItems.push({
        leadingIcon: "arrow-down",
        title: "Move down",
        onPress: () => {
          realm.write(() => {
            entryObjects.move(index, index + 1);
          });
        },
      });
      menuItems.push({
        leadingIcon: "arrow-collapse-down",
        title: "Move to bottom",
        onPress: () => {
          realm.write(() => {
            entryObjects.move(index, entryObjects.length - 1);
          });
        },
      });
    }

    return menuItems;
  }, [dayObject, index, realm]);

  const handleDeleteFilesInEntry = useCallback(async () => {
    if (recordingURI) {
      await deleteAsync(recordingURI);
    }

    for (const imageURI of imagesURI) {
      await deleteAsync(imageURI);
    }
  }, [recordingURI, imagesURI]);

  const optionsMenuItem = useMemo(() => {
    const menuItems = [];

    menuItems.push({
      leadingIcon: "delete",
      title: "Delete entry",
      onPress: () => {
        showDiscardDialog({
          message: "Do you wish to delete the entry?",
          callback: async () => {
            await handleDeleteFilesInEntry();

            realm.write(() => {
              realm.delete(entryObject);
            });
          },
        });
      },
      titleStyle: { color: theme.colors.error },
    });

    return menuItems;
  }, [entryObject, realm, handleDeleteFilesInEntry, showDiscardDialog, theme]);

  const addRemoveMenuItems = useMemo(() => {
    const menuItems = [];

    if (!entryObject.title) {
      menuItems.push({
        leadingIcon: "format-title",
        title: "Add title",
        onPress: () =>
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}/text`,
              params: FOCUS_TITLE,
            },
            { relativeToDirectory: true },
          ),
      });
    }

    if (entryObject?.videosWithThumbnail?.length === 0) {
      menuItems.push({
        leadingIcon: "movie-open-plus",
        title: "Add videos",
        onPress: () =>
          router.navigate(
            { pathname: `./entry/${_id.toString()}/video` },
            { relativeToDirectory: true },
          ),
      });
    } else {
      menuItems.push({
        leadingIcon: "movie-open-edit",
        title: "Edit videos",
        onPress: () => {
          router.navigate(
            { pathname: `./entry/${_id.toString()}/video` },
            { relativeToDirectory: true },
          );
        },
      });
      menuItems.push({
        leadingIcon: "movie-open-minus",
        title: "Remove videos",
        onPress: () => {
          showDiscardDialog({
            message: "Do you wish to remove the videos?",
            callback: async () => {
              for (const { videoUri, thumbnailUri } of videosWithThumbnail) {
                await deleteAsync(videoUri);
                await deleteAsync(thumbnailUri);
              }

              realm.write(() => {
                entryObject.videosWithThumbnail = [];
              });
            },
          });
        },
        titleStyle: { color: theme.colors.error },
      });
    }

    if (entryObject?.imagesURI?.length === 0) {
      menuItems.push({
        leadingIcon: "image-plus",
        title: "Add images",
        onPress: () =>
          router.navigate(
            { pathname: `./entry/${_id.toString()}/image` },
            { relativeToDirectory: true },
          ),
      });
    } else {
      menuItems.push({
        leadingIcon: "image-edit",
        title: "Edit images",
        onPress: () => {
          router.navigate(
            { pathname: `./entry/${_id.toString()}/image` },
            { relativeToDirectory: true },
          );
        },
      });
      menuItems.push({
        leadingIcon: "image-minus",
        title: "Remove images",
        onPress: () => {
          showDiscardDialog({
            message: "Do you wish to remove the images?",
            callback: async () => {
              for (const imageURI of imagesURI) {
                await deleteAsync(imageURI);
              }

              realm.write(() => {
                entryObject.imagesURI = [];
              });
            },
          });
        },
        titleStyle: { color: theme.colors.error },
      });
    }

    if (!entryObject.description) {
      menuItems.push({
        leadingIcon: "pen-plus",
        title: "Add description",
        onPress: () =>
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}/text`,
              params: FOCUS_DESCRIPTION,
            },
            { relativeToDirectory: true },
          ),
      });
    }

    if (entryObject?.recordingURI) {
      menuItems.push({
        leadingIcon: "microphone-minus",
        title: "Remove recording",
        onPress: () => {
          showDiscardDialog({
            message: "Do you wish to remove the recording?",
            callback: async () => {
              await deleteAsync(entryObject?.recordingURI || "");

              realm.write(() => {
                entryObject.recordingURI = undefined;
              });
            },
          });
        },
        titleStyle: { color: theme.colors.error },
      });
    } else {
      menuItems.push({
        leadingIcon: "microphone-plus",
        title: "Add recording",
        onPress: () => {
          router.navigate(
            { pathname: `./entry/${_id.toString()}/recording` },
            { relativeToDirectory: true },
          );
        },
      });
    }

    return menuItems;
  }, [
    entryObject,
    _id,
    router,
    theme,
    realm,
    imagesURI,
    showDiscardDialog,
    videosWithThumbnail,
  ]);

  return (
    <Entry
      style={styles.entry}
      title={titleProp}
      text={descriptionProp}
      feelings={feelings}
      onFeelingsPress={handleFeelingsPress}
      recordingURI={recordingURI}
      imagesURI={imagesURI}
      videosWithThumbnail={videosWithThumbnail}
      optionsMenuItems={optionsMenuItem}
      moveMenuItems={moveMenuItems}
      addRemoveMenuItems={addRemoveMenuItems}
    />
  );
};

export default EntryWithData;

const styles = StyleSheet.create({
  entry: {
    marginBottom: spacing.spaceSmall,
  },
});
