import useMediaLibrary from "@/hooks/useMediaLibrary";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Asset } from "expo-media-library";
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
import Image from "./Image";
import { Media } from "@/types/Media";

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

  const handleOnImagePress = useCallback((index: number) => {
    setInitialIndex(index);
    setIsPreviewVisible(true);
  }, []);

  const handleOnImageCheck = useCallback((index: number) => {
    console.log("checked");
  }, []);

  const itemSize = gridWidth / GRID_SIZE;

  const renderItem = useCallback(
    ({ item, index }: { item: Media; index: number }) => {
      return (
        <Image
          uri={item.uri}
          size={itemSize}
          index={index}
          onPress={handleOnImagePress}
          isChecked={false}
          onCheck={handleOnImageCheck}
          isVideo={item.mediaType === "video"}
        />
      );
    },
    [itemSize, handleOnImagePress, handleOnImageCheck],
  );

  const lastItemIndex = assets.length - 1;

  const onViewableItemsChanged = useCallback(
    async ({ changed }: { changed: ViewToken[] }) => {
      for (const { isViewable, index } of changed) {
        if (
          hasNextPage &&
          !isFetchingAssets.current &&
          isViewable &&
          index &&
          index > lastItemIndex - EXTEND_LIST_OFFSET
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
    () => assets.map(({ uri, mediaType }) => ({ uri, mediaType })),
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
