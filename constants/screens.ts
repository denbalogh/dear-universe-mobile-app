import { EntrySearchParams } from "@/types/createEditEntryScreen";
import { LockSearchTermParams } from "@/types/lockScreen";

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

// Lock screen

export const LOCK_SCREEN_NAVIGATE_TO_APP: Pick<
  LockSearchTermParams,
  "navigateTo"
> = { navigateTo: "app" };
export const LOCK_SCREEN_NAVIGATE_TO_PREVIOUS: Pick<
  LockSearchTermParams,
  "navigateTo"
> = { navigateTo: "previous" };
