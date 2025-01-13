export type FocusTypes = "title" | "description";
export type ScrollToTypes = "recording" | "images" | "videos" | "feelings";

export type EntrySearchParams = {
  dateId: string;
  entryId?: string;
  focus?: FocusTypes;
  scrollTo?: ScrollToTypes;
  imagesSelectedIndex?: string;
  videosSelectedIndex?: string;
};
