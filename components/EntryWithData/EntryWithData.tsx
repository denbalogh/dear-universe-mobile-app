import {
  FOCUS_DESCRIPTION,
  FOCUS_TITLE,
  SCROLL_TO_FEELINGS,
  SCROLL_TO_IMAGES,
  SCROLL_TO_RECORDING,
  SCROLL_TO_VIDEOS,
} from "@/constants/screens";
import { Entry as EntryType } from "@/models/Entry";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import Entry from "../Entry/Entry";
import { StyleSheet } from "react-native";
import { spacing } from "@/constants/theme";
import { useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { MenuItemProps } from "react-native-paper";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import useDeleteEmptyEntry from "@/hooks/useDeleteEmptyEntry";
import { deleteFilesInEntry } from "@/utils/files";
import {
  getImagesSelectedIndex,
  getVideosSelectedIndex,
} from "@/utils/screens";

type Props = {
  entryObject: EntryType;
  dayObject: Day | null;
  index: number;
};

const EntryWithData = ({ entryObject, dayObject, index }: Props) => {
  const router = useRouter();
  const realm = useRealm();

  const { showConfirmDialog } = useConfirmDialog();

  useDeleteEmptyEntry(entryObject);

  const {
    _id,
    title = "",
    description = "",
    recordingUri = "",
    imagesUri = [],
    videosWithThumbnail = [],
    feelingsGroupName = "",
    feelingsEmotions = [],
  } = entryObject;

  const handleOnTitlePress = () =>
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: FOCUS_TITLE,
      },
      { relativeToDirectory: true },
    );

  const handleOnDescriptionPress = () =>
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: FOCUS_DESCRIPTION,
      },
      { relativeToDirectory: true },
    );

  const handleFeelingsPress = () => {
    router.navigate(
      { pathname: `./entry/${_id.toString()}`, params: SCROLL_TO_FEELINGS },
      { relativeToDirectory: true },
    );
  };

  const handleDeleteEntryPress = useCallback(async () => {
    showConfirmDialog("Do you wish to delete this entry?", async () => {
      await deleteFilesInEntry(imagesUri, videosWithThumbnail, recordingUri);

      realm.write(() => {
        realm.delete(entryObject);
      });
    });
  }, [
    entryObject,
    imagesUri,
    videosWithThumbnail,
    recordingUri,
    realm,
    showConfirmDialog,
  ]);

  const handleOnRecordingLongPress = () => {
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: SCROLL_TO_RECORDING,
      },
      { relativeToDirectory: true },
    );
  };

  const handleOnImageLongsPress = (index: number) => {
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: { ...SCROLL_TO_IMAGES, ...getImagesSelectedIndex(index) },
      },
      { relativeToDirectory: true },
    );
  };

  const handleOnVideoLongsPress = (index: number) => {
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: { ...SCROLL_TO_VIDEOS, ...getVideosSelectedIndex(index) },
      },
      { relativeToDirectory: true },
    );
  };

  const moveMenuItems: MenuItemProps[] = useMemo(() => {
    if (dayObject === null) {
      return [];
    }

    const { entryObjects } = dayObject;

    const isFirst = index === 0;
    const isLast = index === entryObjects.length - 1;

    const menuItems = [];

    if (!isFirst) {
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

    if (!isLast) {
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

  const addMenuItems = useMemo(() => {
    const menuItems = [];

    const { title, description, videosWithThumbnail, imagesUri, recordingUri } =
      entryObject;

    const hasVideos = videosWithThumbnail && videosWithThumbnail.length > 0;
    const hasImages = imagesUri && imagesUri.length > 0;

    if (!title) {
      menuItems.push({
        leadingIcon: "format-title",
        title: "Add title",
        onPress: () =>
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}`,
              params: FOCUS_TITLE,
            },
            { relativeToDirectory: true },
          ),
      });
    }

    if (!hasVideos) {
      menuItems.push({
        leadingIcon: "movie-open-plus",
        title: "Add videos",
        onPress: () =>
          router.navigate(
            { pathname: `./entry/${_id.toString()}`, params: SCROLL_TO_VIDEOS },
            { relativeToDirectory: true },
          ),
      });
    }

    if (!hasImages) {
      menuItems.push({
        leadingIcon: "image-plus",
        title: "Add images",
        onPress: () =>
          router.navigate(
            { pathname: `./entry/${_id.toString()}`, params: SCROLL_TO_IMAGES },
            { relativeToDirectory: true },
          ),
      });
    }

    if (!recordingUri) {
      menuItems.push({
        leadingIcon: "microphone-plus",
        title: "Add recording",
        onPress: () => {
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}`,
              params: SCROLL_TO_RECORDING,
            },
            { relativeToDirectory: true },
          );
        },
      });
    }

    if (!description) {
      menuItems.push({
        leadingIcon: "pen-plus",
        title: "Add description",
        onPress: () =>
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}`,
              params: FOCUS_DESCRIPTION,
            },
            { relativeToDirectory: true },
          ),
      });
    }

    return menuItems;
  }, [entryObject, router, _id]);

  return (
    <Entry
      style={styles.entry}
      title={title}
      onTitlePress={handleOnTitlePress}
      description={description}
      onDescriptionPress={handleOnDescriptionPress}
      feelingsActiveGroup={feelingsGroupName}
      feelingsActiveEmotions={feelingsEmotions}
      onFeelingsPress={handleFeelingsPress}
      onDeleteEntryPress={handleDeleteEntryPress}
      onRecordingLongPress={handleOnRecordingLongPress}
      onImageLongPress={handleOnImageLongsPress}
      onVideoLongPress={handleOnVideoLongsPress}
      recordingUri={recordingUri}
      imagesUri={imagesUri}
      videosWithThumbnail={videosWithThumbnail}
      moveMenuItems={moveMenuItems}
      addMenuItems={addMenuItems}
    />
  );
};

export default EntryWithData;

const styles = StyleSheet.create({
  entry: {
    marginBottom: spacing.spaceSmall,
  },
});
