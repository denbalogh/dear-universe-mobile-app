export type FocusTypes = "title" | "description";
export type ScrollToTypes = "recording" | "images" | "videos" | "feelings";

export type EntrySearchParams = {
  dateId: string;
  entryId?: string;
  focus?: FocusTypes;
  scrollTo?: ScrollToTypes;
  imagesSelectedUri?: string;
  videosSelectedThumbnailUri?: string;
};
