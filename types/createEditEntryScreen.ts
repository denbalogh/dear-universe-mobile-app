export type FocusTypes = "title" | "description";
export type ScrollToTypes = "recording" | "media" | "feelings";

export type EntrySearchParams = {
  dateId: string;
  entryId?: string;
  focus?: FocusTypes;
  scrollTo?: ScrollToTypes;
  selectedMediaImageUri?: string;
};
