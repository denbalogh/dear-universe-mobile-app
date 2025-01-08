// Day - entry - screens

import { EntrySearchParams } from "@/types/createEditEntryScreen";

export const getImagesSelectedIndex = (
  index: number,
): Pick<EntrySearchParams, "imagesSelectedIndex"> => ({
  imagesSelectedIndex: index.toString(),
});

export const getVideosSelectedIndex = (
  index: number,
): Pick<EntrySearchParams, "videosSelectedIndex"> => ({
  videosSelectedIndex: index.toString(),
});
