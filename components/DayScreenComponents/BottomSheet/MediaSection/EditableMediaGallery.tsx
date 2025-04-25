import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import AddImageGridItem from "./EditableMediaGalleryAddItem";
import MediaGalleryPreview from "../../EntriesList/MediaGallery/MediaGalleryPreview/MediaGalleryPreview";
import { DndProvider, DndProviderProps } from "@mgcrea/react-native-dnd";
import EditableMediaGalleryItem from "./EditableMediaGalleryItem";
import { runOnJS } from "react-native-reanimated";
import logCrashlytics from "@/utils/logCrashlytics";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import { Button, IconButton } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { useCustomTheme } from "@/hooks/useCustomTheme";

type Props = {
  gridSize?: number;
  onAddImagePress: () => void;
};

const EditableMediaGallery = ({ gridSize = 4, onAddImagePress }: Props) => {
  const theme = useCustomTheme();
  const { media, setMedia } = useEntryDraft();

  const { showConfirmDialog } = useConfirmDialog();

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [gridWidth, setGridWidth] = useState(0);

  const [selectedUri, setSelectedUri] = useState<string[]>([]);

  const handleOnImagePress = (index: number) => {
    setInitialIndex(index);
    setIsPreviewVisible(true);
  };

  const handleOnPreviewClose = () => {
    setIsPreviewVisible(false);
  };

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setGridWidth(width);
  };

  const imageSize = gridWidth / gridSize;
  const itemCountPlusAddButton = media.length + 1;

  const imageStyle = useMemo(
    () => ({
      width: imageSize,
      height: imageSize,
      marginHorizontal: -0.1,
    }),
    [imageSize],
  );

  const handleOrderChange = useCallback(
    (fromId: string, toId: string) => {
      logCrashlytics("Changing media order");
      const fromIndex = media.findIndex(({ uri }) => uri === fromId);
      const toIndex = media.findIndex(({ uri }) => uri === toId);

      const newMedia = [...media];
      const [removed] = newMedia.splice(fromIndex, 1);
      newMedia.splice(toIndex, 0, removed);

      setMedia(newMedia);
    },
    [media, setMedia],
  );

  const handleOnSelect = useCallback(
    (imageUri: string) => {
      const isSelected = selectedUri.includes(imageUri);
      setSelectedUri(
        isSelected
          ? selectedUri.filter((item) => item !== imageUri)
          : [...selectedUri, imageUri],
      );
    },
    [selectedUri],
  );

  const handleOnDragEnd: DndProviderProps["onDragEnd"] = ({ active, over }) => {
    "worklet";
    if (over) {
      const activeId = active.id as string;
      const overId = over.id as string;
      runOnJS(handleOrderChange)(activeId, overId);
    }
  };

  const handleSelectAll = () => {
    setSelectedUri(media.map(({ uri }) => uri));
  };

  const handleCancelSelection = () => {
    setSelectedUri([]);
  };

  const handleOnSelectedDelete = () => {
    showConfirmDialog("Do you wish to delete the selected media?", () => {
      const newMedia = media.filter(({ uri }) => !selectedUri.includes(uri));

      setMedia(newMedia);
      handleCancelSelection();
    });
  };

  const mediaConcatKey = useMemo(
    () => media.map(({ uri }) => uri).join(""),
    [media],
  );

  return (
    <>
      <View style={styles.selectionButtonsWrapper}>
        <IconButton onPress={handleSelectAll} icon="check-all" />
        <IconButton
          onPress={handleCancelSelection}
          disabled={!selectedUri.length}
          icon="cancel"
        />
        <Button
          style={styles.selectionButton}
          mode="outlined"
          textColor={theme.colors.error}
          onPress={handleOnSelectedDelete}
          disabled={!selectedUri.length}
        >
          Delete selected
        </Button>
      </View>
      <DndProvider
        key={mediaConcatKey} // When media reorders or changes, we need to reset the DND state, because it was not updating correctly
        activationDelay={500}
        onDragEnd={handleOnDragEnd}
      >
        <View style={styles.wrapper} onLayout={handleOnLayout}>
          {media.map((item, index) => {
            const isSelected = selectedUri.includes(item.uri);

            return (
              <EditableMediaGalleryItem
                key={item.uri}
                item={item}
                index={index}
                imagesCount={itemCountPlusAddButton}
                gridSize={gridSize}
                style={imageStyle}
                isSelected={isSelected}
                onSelect={handleOnSelect}
                onImagePress={handleOnImagePress}
              />
            );
          })}
          <AddImageGridItem
            imagesCount={itemCountPlusAddButton}
            gridSize={gridSize}
            style={{ width: imageSize, height: imageSize }}
            loading={false}
            onPress={onAddImagePress}
          />
        </View>
      </DndProvider>
      <MediaGalleryPreview
        media={media}
        isVisible={isPreviewVisible}
        initialIndex={initialIndex}
        onClose={handleOnPreviewClose}
      />
    </>
  );
};

export default EditableMediaGallery;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectionButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.spaceSmall,
  },
  selectionButton: {
    flex: 1,
    marginLeft: spacing.spaceSmall,
  },
});
