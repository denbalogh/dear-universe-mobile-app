import useMediaLibrary from "@/hooks/useMediaLibrary";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Asset, MediaType } from "expo-media-library";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { spacing } from "@/constants/theme";
import { LayoutChangeEvent, StyleSheet, ViewToken } from "react-native";
import MediaGalleryPreview from "@/components/MediaGallery/MediaGalleryPreview/MediaGalleryPreview";
import MediaGalleryItem from "@/components/MediaGallery/MediaGalleryItem";
import { Media } from "@/components/MediaGallery/EditableMediaGallery";
import EditableMediaGalleryItem from "@/components/MediaGallery/EditableMediaGalleryItem";

const GRID_SIZE = 3;
const EXTEND_LIST_OFFSET = 5 * GRID_SIZE; // 5 rows

const MediaSection = () => {
  const [gridWidth, setGridWidth] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleOnPreviewClose = () => {
    setIsPreviewVisible(false);
  };

  const isFetchingAssets = useRef(false);
  const { getInitAssets, getNextAssets, hasNextPage } = useMediaLibrary();

  useEffect(() => {
    (async () => {
      setAssets(await getInitAssets());
    })();
  }, [getInitAssets]);

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width },
      },
    }: LayoutChangeEvent) => {
      setGridWidth(width);
    },
    [],
  );

  const handleOnImagePress = (index: number) => {
    setInitialIndex(index);
    setIsPreviewVisible(true);
  };

  const itemSize = gridWidth / GRID_SIZE;

  const renderItem = useCallback(
    ({ item, index }: { item: Media; index: number }) => {
      return (
        <EditableMediaGalleryItem
          item={item}
          index={index}
          imagesCount={assets.length}
          gridSize={GRID_SIZE}
          touchableProps={{
            onPress: () => handleOnImagePress(index),
          }}
          style={{
            width: itemSize,
            height: itemSize,
          }}
          isSelected={false}
          onSelect={() => {}}
          dndEnabled={false}
        />
      );
    },
    [assets.length, itemSize],
  );

  const lastItemIndex = assets.length - 1;

  const onViewableItemsChanged = useCallback(
    async ({ changed }: { changed: ViewToken[] }) => {
      for (const item of changed) {
        // Handle appending days
        if (
          hasNextPage &&
          !isFetchingAssets.current &&
          item.isViewable &&
          item.index &&
          item.index > lastItemIndex - EXTEND_LIST_OFFSET
        ) {
          isFetchingAssets.current = true;

          const nextAssets = await getNextAssets();
          setAssets((prev) => [...prev, ...nextAssets]);

          isFetchingAssets.current = false;
        }
      }
    },
    [lastItemIndex, getNextAssets, hasNextPage],
  );

  const media = useMemo(
    () =>
      assets.map((asset) => ({
        imageUri: asset.uri,
        videoUri: asset.mediaType === MediaType.video ? asset.uri : undefined,
      })),
    [assets],
  );

  const handleGetItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemSize,
      offset: itemSize * index,
      index,
    }),
    [itemSize],
  );

  return (
    <>
      <BottomSheetFlatList
        onLayout={handleOnLayout}
        style={styles.flatList}
        data={media}
        renderItem={renderItem}
        numColumns={GRID_SIZE}
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={handleGetItemLayout}
      />
      <MediaGalleryPreview
        media={media}
        onClose={handleOnPreviewClose}
        isVisible={isPreviewVisible}
        initialIndex={initialIndex}
      />
    </>
  );
};

export default MediaSection;

const styles = StyleSheet.create({
  flatList: {
    marginHorizontal: -spacing.spaceSmall,
  },
});
