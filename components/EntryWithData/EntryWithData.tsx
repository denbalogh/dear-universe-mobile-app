import { FOCUS_DESCRIPTION, FOCUS_TITLE } from "@/constants/screens";
import { Entry as EntryType } from "@/models/Entry";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import Entry from "../Entry/Entry";
import { StyleSheet } from "react-native";
import { spacing } from "@/constants/theme";
import { useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { MenuItemProps } from "react-native-paper";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { deleteAsync } from "expo-file-system";
import useDeleteEmptyEntry from "@/hooks/useDeleteEmptyEntry";

type Props = {
  entryObject: EntryType;
  dayObject: Day | null;
  index: number;
};

const EntryWithData = ({ entryObject, dayObject, index }: Props) => {
  const router = useRouter();
  const realm = useRealm();
  const theme = useCustomTheme();

  const { showConfirmDialog } = useConfirmDialog();

  useDeleteEmptyEntry(entryObject);

  const {
    _id,
    title = "",
    description = "",
    feelings,
    recordingUri = "",
    imagesUri = [],
    videosWithThumbnail = [],
  } = entryObject;

  const handleOnTitlePress = () =>
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}/text`,
        params: FOCUS_TITLE,
      },
      { relativeToDirectory: true },
    );

  const handleOnDescriptionPress = () =>
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}/text`,
        params: FOCUS_DESCRIPTION,
      },
      { relativeToDirectory: true },
    );

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
    if (recordingUri) {
      await deleteAsync(recordingUri);
    }

    for (const imageURI of imagesUri) {
      await deleteAsync(imageURI);
    }
  }, [recordingUri, imagesUri]);

  const optionsMenuItem = useMemo(() => {
    const menuItems = [];

    menuItems.push({
      leadingIcon: "delete",
      title: "Delete entry",
      onPress: () => {
        showConfirmDialog("Do you wish to delete the entry?", async () => {
          await handleDeleteFilesInEntry();

          realm.write(() => {
            realm.delete(entryObject);
          });
        });
      },
      titleStyle: { color: theme.colors.error },
    });

    return menuItems;
  }, [entryObject, realm, handleDeleteFilesInEntry, showConfirmDialog, theme]);

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
          showConfirmDialog("Do you wish to remove the videos?", async () => {
            for (const { videoUri, thumbnailUri } of videosWithThumbnail) {
              await deleteAsync(videoUri);
              await deleteAsync(thumbnailUri);
            }

            realm.write(() => {
              entryObject.videosWithThumbnail = [];
            });
          });
        },
        titleStyle: { color: theme.colors.error },
      });
    }

    if (entryObject?.imagesUri?.length === 0) {
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
          showConfirmDialog("Do you wish to remove the images?", async () => {
            for (const imageURI of imagesUri) {
              await deleteAsync(imageURI);
            }

            realm.write(() => {
              entryObject.imagesUri = [];
            });
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

    if (entryObject?.recordingUri) {
      menuItems.push({
        leadingIcon: "microphone-minus",
        title: "Remove recording",
        onPress: () => {
          showConfirmDialog(
            "Do you wish to remove the recording?",
            async () => {
              await deleteAsync(entryObject?.recordingUri || "");

              realm.write(() => {
                entryObject.recordingUri = undefined;
              });
            },
          );
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
    imagesUri,
    showConfirmDialog,
    videosWithThumbnail,
  ]);

  return (
    <Entry
      style={styles.entry}
      title={title}
      onTitlePress={handleOnTitlePress}
      description={description}
      onDescriptionPress={handleOnDescriptionPress}
      feelingsActiveGroup={feelings?.name || ""}
      feelingsActiveEmotions={feelings?.emotions || []}
      onFeelingsPress={handleFeelingsPress}
      recordingUri={recordingUri}
      imagesUri={imagesUri}
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
