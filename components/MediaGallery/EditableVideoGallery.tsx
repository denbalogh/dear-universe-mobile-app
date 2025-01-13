import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import ImageGridItem from "./ImageGridItem";
import { Checkbox, MenuItemProps } from "react-native-paper";
import AddImageGridItem from "./ImageGridAddItem";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { roundness, sizing, spacing } from "@/constants/theme";
import { VideoWithThumbnail } from "./VideoGallery";
import VideoPlayerModal from "./VideoPlayerModal";

type Props = {
  videosWithThumbnail: VideoWithThumbnail[];
  gridSize?: number;
  addButtons: MenuItemProps[];
  addButtonsLoading?: boolean;
  onMoveLeftPress: (index: number) => void;
  onMoveToStartPress: (index: number) => void;
  onMoveRightPress: (index: number) => void;
  onMoveToEndPress: (index: number) => void;
  onVideoLongPress: (index: number) => void;
  selectable?: {
    selected: number[];
    onSelectedChange: (selected: number[]) => void;
  };
} & ViewProps;

const EditableVideoGallery = ({
  videosWithThumbnail,
  gridSize = 3,
  style,
  addButtons,
  addButtonsLoading = false,
  onMoveLeftPress,
  onMoveToStartPress,
  onMoveRightPress,
  onMoveToEndPress,
  onVideoLongPress,
  selectable,
  ...props
}: Props) => {
  const theme = useCustomTheme();

  const [gridWidth, setGridWidth] = useState(0);
  const [isVideaPlayerVisible, setIsVideoPlayerVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const onVideoPress = (index: number) => {
    setInitialIndex(index);
    setIsVideoPlayerVisible(true);
  };

  const handleGalleryPreviewClose = () => {
    setIsVideoPlayerVisible(false);
  };

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setGridWidth(width);
  };

  const imageSize = Math.floor((gridWidth / gridSize) * 1000) / 1000; // Floor to 3 decimal places, because it was wrapping incorrectly
  const imagesCount = videosWithThumbnail.length + 1; // Add button

  const videosUri = videosWithThumbnail.map(({ videoUri }) => videoUri);

  const handleOnSelect = (index: number) => {
    if (selectable) {
      const { selected, onSelectedChange } = selectable;
      const isSelected = selected.includes(index);
      onSelectedChange(
        isSelected
          ? selected.filter((item) => item !== index)
          : [...selected, index],
      );
    }
  };

  return (
    <>
      <View
        {...props}
        style={[style, styles.wrapper]}
        onLayout={handleOnLayout}
      >
        {videosWithThumbnail.map((item, index) => {
          const menuItems = [];

          if (index > 0) {
            menuItems.push({
              leadingIcon: "arrow-collapse-left",
              onPress: () => onMoveToStartPress(index),
              title: "To start",
            });
            menuItems.push({
              leadingIcon: "arrow-left",
              onPress: () => onMoveLeftPress(index),
              title: "Left",
            });
          }

          if (index < videosWithThumbnail.length - 1) {
            menuItems.push({
              leadingIcon: "arrow-right",
              onPress: () => onMoveRightPress(index),
              title: "Right",
            });
            menuItems.push({
              leadingIcon: "arrow-collapse-right",
              onPress: () => onMoveToEndPress(index),
              title: "To end",
            });
          }

          const isSelected = selectable?.selected.includes(index);

          return (
            <View key={`${item}-${index}`}>
              <ImageGridItem
                source={{ uri: item.thumbnailUri }}
                index={index}
                imagesCount={imagesCount}
                gridSize={gridSize}
                style={{ width: imageSize, height: imageSize }}
                touchableProps={{
                  onPress: () => onVideoPress(index),
                  onLongPress: () => onVideoLongPress(index),
                }}
                showPlayIcon={true}
                playIconPosition="topLeft"
              />
              {selectable ? (
                <View
                  style={[
                    styles.select,
                    { backgroundColor: theme.colors.background },
                  ]}
                >
                  <Checkbox
                    status={isSelected ? "checked" : "unchecked"}
                    onPress={() => handleOnSelect(index)}
                  />
                </View>
              ) : (
                <View style={styles.buttons}>
                  <IconButtonMenu
                    iconButtonProps={{
                      icon: "arrow-left-right",
                      mode: "contained-tonal",
                      size: sizing.sizeSmall,
                    }}
                    menuItems={menuItems}
                  />
                </View>
              )}
            </View>
          );
        })}
        <AddImageGridItem
          imagesCount={imagesCount}
          gridSize={gridSize}
          addButtons={addButtons}
          style={{ width: imageSize, height: imageSize }}
          loading={addButtonsLoading}
          disabled={!!selectable}
        />
      </View>
      <VideoPlayerModal
        videosUri={videosUri}
        initialIndex={initialIndex}
        isVisible={isVideaPlayerVisible}
        onClose={handleGalleryPreviewClose}
      />
    </>
  );
};

export default EditableVideoGallery;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  buttons: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  select: {
    position: "absolute",
    bottom: spacing.spaceSmall,
    right: spacing.spaceSmall,
    borderRadius: roundness,
  },
});
