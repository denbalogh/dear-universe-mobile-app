import { EntrySearchParams } from "@/types/createEditEntryScreen";
import { DaySearchTermParams } from "@/types/dayScreen";

// Day screen

export const DAY_SCREEN_APPEAR_FROM_LEFT: Pick<
  DaySearchTermParams,
  "appearFrom"
> = {
  appearFrom: "left",
};

export const DAY_SCREEN_APPEAR_FROM_RIGHT: Pick<
  DaySearchTermParams,
  "appearFrom"
> = {
  appearFrom: "right",
};

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
