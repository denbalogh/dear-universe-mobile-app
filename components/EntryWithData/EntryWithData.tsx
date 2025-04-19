import {
  ENTRY_SCREEN_FOCUS_DESCRIPTION,
  ENTRY_SCREEN_FOCUS_TITLE,
  ENTRY_SCREEN_SCROLL_TO_RECORDING,
  ENTRY_SCREEN_SCROLL_TO_MEDIA,
  ENTRY_SCREEN_SCROLL_TO_FEELINGS,
} from "@/constants/screens";
import { Entry as EntryType } from "@/models/Entry";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
// import Entry from "../Entry/Entry";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { MenuItemProps } from "react-native-paper";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import useDeleteEmptyEntry from "@/hooks/useDeleteEmptyEntry";
import { deleteFilesInEntry } from "@/utils/files";
import { getSelectedMediaImageUri } from "@/utils/screens";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { BSON } from "realm";

type Props = {
  entryId: string;
  dayObject: Day | null;
  index: number;
  locked: boolean;
};

const EntryWithData = ({ entryId, dayObject, index, locked }: Props) => {
  const router = useRouter();
  const realm = useRealm();
  const { showSnackbar } = useSnackbar();
  const { showConfirmDialog } = useConfirmDialog();

  useDeleteEmptyEntry(entryId);

  const entryObject = useObject(EntryType, new BSON.ObjectId(entryId));

  const {
    _id = new BSON.ObjectId(),
    title = "",
    description = "",
    recordingUri = "",
    media = [],
    feelingsGroupName = "",
    feelingsEmotions = [],
  } = entryObject || {};

  const handleOnTitlePress = () =>
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: ENTRY_SCREEN_FOCUS_TITLE,
      },
      { relativeToDirectory: true },
    );

  const handleOnDescriptionPress = () =>
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: ENTRY_SCREEN_FOCUS_DESCRIPTION,
      },
      { relativeToDirectory: true },
    );

  const handleFeelingsPress = () => {
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: ENTRY_SCREEN_SCROLL_TO_FEELINGS,
      },
      { relativeToDirectory: true },
    );
  };

  const handleDeleteEntryPress = useCallback(async () => {
    showConfirmDialog("Do you wish to delete this entry?", async () => {
      await deleteFilesInEntry(media, recordingUri);

      realm.write(() => {
        realm.delete(entryObject);
      });

      showSnackbar("Entry was deleted");
    });
  }, [
    entryObject,
    media,
    recordingUri,
    realm,
    showConfirmDialog,
    showSnackbar,
  ]);

  const handleOnMediaLongPress = (uri: string) => {
    router.navigate(
      {
        pathname: `./entry/${_id.toString()}`,
        params: {
          ...ENTRY_SCREEN_SCROLL_TO_MEDIA,
          ...getSelectedMediaImageUri(uri),
        },
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

  const editMenuItems = useMemo(() => {
    const menuItems = [];

    const hasMedia = media && media.length > 0;

    if (!title) {
      menuItems.push({
        leadingIcon: "format-title",
        title: "Add title",
        onPress: () =>
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}`,
              params: ENTRY_SCREEN_FOCUS_TITLE,
            },
            { relativeToDirectory: true },
          ),
      });
    }

    menuItems.push({
      leadingIcon: hasMedia ? "image-edit" : "image-plus",
      title: hasMedia ? "Edit media" : "Add media",
      onPress: () =>
        router.navigate(
          {
            pathname: `./entry/${_id.toString()}`,
            params: ENTRY_SCREEN_SCROLL_TO_MEDIA,
          },
          { relativeToDirectory: true },
        ),
    });

    menuItems.push({
      leadingIcon: recordingUri ? "microphone" : "microphone-plus",
      title: recordingUri ? "Edit recording" : "Add recording",
      onPress: () => {
        router.navigate(
          {
            pathname: `./entry/${_id.toString()}`,
            params: ENTRY_SCREEN_SCROLL_TO_RECORDING,
          },
          { relativeToDirectory: true },
        );
      },
    });

    if (!description) {
      menuItems.push({
        leadingIcon: "pen-plus",
        title: "Add description",
        onPress: () =>
          router.navigate(
            {
              pathname: `./entry/${_id.toString()}`,
              params: ENTRY_SCREEN_FOCUS_DESCRIPTION,
            },
            { relativeToDirectory: true },
          ),
      });
    }

    return menuItems;
  }, [router, _id, media, recordingUri, title, description]);

  // return (
  //   <Entry
  //     title={title}
  //     onTitlePress={handleOnTitlePress}
  //     description={description}
  //     onDescriptionPress={handleOnDescriptionPress}
  //     feelingsActiveGroup={feelingsGroupName}
  //     feelingsActiveEmotions={feelingsEmotions}
  //     onFeelingsPress={handleFeelingsPress}
  //     onDeleteEntryPress={handleDeleteEntryPress}
  //     onMediaLongPress={handleOnMediaLongPress}
  //     recordingUri={recordingUri}
  //     media={media}
  //     moveMenuItems={moveMenuItems}
  //     editMenuItems={editMenuItems}
  //     locked={locked}
  //   />
  // );
};

export default EntryWithData;
