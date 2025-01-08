import { EntrySearchParams } from "@/types/createEditEntryScreen";

// Day - entry - screens

type Focus = Pick<EntrySearchParams, "focus">;

export const FOCUS_TITLE: Focus = { focus: "title" };
export const FOCUS_DESCRIPTION: Focus = { focus: "description" };

type ScrollTo = Pick<EntrySearchParams, "scrollTo">;

export const SCROLL_TO_RECORDING: ScrollTo = { scrollTo: "recording" };
export const SCROLL_TO_IMAGES: ScrollTo = { scrollTo: "images" };
export const SCROLL_TO_VIDEOS: ScrollTo = { scrollTo: "videos" };
export const SCROLL_TO_FEELINGS: ScrollTo = { scrollTo: "feelings" };
