// Day - entry - screens

import { EntrySearchParams } from "@/types/createEditEntryScreen";

export const getImagesSelectedUri = (
  uri: string,
): Pick<EntrySearchParams, "imagesSelectedUri"> => ({
  imagesSelectedUri: uri,
});

export const getVideosSelectedUri = (
  uri: string,
): Pick<EntrySearchParams, "videosSelectedThumbnailUri"> => ({
  videosSelectedThumbnailUri: uri,
});
