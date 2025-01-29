import { EntrySearchParams } from "@/types/createEditEntryScreen";

// Day - entry - screens

type Focus = Pick<EntrySearchParams, "focus">;

export const ENTRY_SCREEN_FOCUS_TITLE: Focus = {
  focus: "title",
};
export const ENTRY_SCREEN_FOCUS_DESCRIPTION: Focus = {
  focus: "description",
};

type ScrollTo = Pick<EntrySearchParams, "scrollTo">;

export const ENTRY_SCREEN_SCROLL_TO_RECORDING: ScrollTo = {
  scrollTo: "recording",
};
export const ENTRY_SCREEN_SCROLL_TO_MEDIA: ScrollTo = {
  scrollTo: "media",
};
export const ENTRY_SCREEN_SCROLL_TO_FEELINGS: ScrollTo = {
  scrollTo: "feelings",
};
