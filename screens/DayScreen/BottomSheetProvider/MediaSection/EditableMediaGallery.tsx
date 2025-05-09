import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import AddImageGridItem from "./EditableMediaGalleryAddItem";
import MediaGalleryPreview from "../../EntriesList/Entry/MediaGallery/MediaGalleryPreview/MediaGalleryPreview";
import { DndProvider, DndProviderProps } from "@mgcrea/react-native-dnd";
import EditableMediaGalleryItem from "./EditableMediaGalleryItem";
import { runOnJS } from "react-native-reanimated";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";
import { Button, IconButton } from "react-native-paper";
import { spacing } from "@/common/constants/theme";
import { useConfirmDialog } from "@/common/providers/ConfirmDialogProvider";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import Sortable, {
  SortableGridDragEndParams,
  SortableGridRenderItem,
} from "react-native-sortables";
import { Media } from "@/common/types/Media";

type Props = {
  gridSize?: number;
  onAddImagePress: () => void;
};

const EditableMediaGallery = ({ gridSize = 4, onAddImagePress }: Props) => {
  const theme = useCustomTheme();
  const { media, setMedia } = useEntryEditor();

  const { showDialog } = useConfirmDialog();

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [gridWidth, setGridWidth] = useState(0);

  const [selectedUri, setSelectedUri] = useState<string[]>([]);

  const handleOnImagePress = useCallback((index: number) => {
    setInitialIndex(index);
    setIsPreviewVisible(true);
  }, []);

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
    () => ({ width: imageSize, height: imageSize }),
    [imageSize],
  );

  const handleOrderChange = useCallback(
    ({ data }: SortableGridDragEndParams<Media>) => setMedia(data),
    [setMedia],
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

  const handleSelectAll = () => {
    setSelectedUri(media.map(({ uri }) => uri));
  };

  const handleCancelSelection = () => {
    setSelectedUri([]);
  };

  const handleOnSelectedDelete = () => {
    showDialog("Do you wish to delete the selected media?", () => {
      const newMedia = media.filter(({ uri }) => !selectedUri.includes(uri));

      setMedia(newMedia);
      handleCancelSelection();
    });
  };

  const renderItem = useCallback<SortableGridRenderItem<Media>>(
    ({ item, index }) => (
      <EditableMediaGalleryItem
        item={item}
        index={index}
        imagesCount={itemCountPlusAddButton}
        gridSize={gridSize}
        style={imageStyle}
        isSelected={selectedUri.includes(item.uri)}
        onSelect={handleOnSelect}
        onImagePress={handleOnImagePress}
      />
    ),
    [
      gridSize,
      imageStyle,
      itemCountPlusAddButton,
      selectedUri,
      handleOnSelect,
      handleOnImagePress,
    ],
  );

  const keyExtractor = useCallback((item: Media) => item.uri, []);

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
      <View onLayout={handleOnLayout}>
        <Sortable.Grid
          columns={gridSize}
          data={media}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onDragEnd={handleOrderChange}
        />
      </View>
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
