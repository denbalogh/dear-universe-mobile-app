import React, { useCallback, useState } from "react";
import MediaGalleryItem from "./MediaGalleryItem";
import MediaGalleryPreview from "./MediaGalleryPreview/MediaGalleryPreview";
import { Media } from "@/common/types/Media";
import Sortable, {
  SortableGridDragEndParams,
  SortableGridRenderItem,
} from "react-native-sortables";
import { spacing } from "@/common/constants/theme";

type Props = {
  media: Media[];
  onOrderChange: (media: Media[]) => void;
  disabled: boolean;
};

const MediaGallery = ({ media, onOrderChange, disabled }: Props) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleOnPreviewClose = () => {
    setIsPreviewVisible(false);
  };

  const handleOnImagePress = useCallback((index: number) => {
    setInitialIndex(index);
    setIsPreviewVisible(true);
  }, []);

  const keyExtractor = useCallback((item: Media) => item.uri, []);

  const renderItem = useCallback<SortableGridRenderItem<Media>>(
    ({ item, index }) => (
      <MediaGalleryItem
        key={item.uri}
        item={item}
        index={index}
        onPress={handleOnImagePress}
      />
    ),
    [handleOnImagePress],
  );

  const handleDragEnd = useCallback(
    (params: SortableGridDragEndParams<Media>) => onOrderChange(params.data),
    [onOrderChange],
  );

  return (
    <>
      <Sortable.Grid
        rowGap={spacing.spaceExtraSmall}
        columnGap={spacing.spaceExtraSmall}
        columns={Math.min(5, media.length)}
        data={media}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onDragEnd={handleDragEnd}
        sortEnabled={!disabled}
        enableActiveItemSnap={false}
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

export default MediaGallery;
