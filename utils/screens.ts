// Day - entry - screens

import { EntrySearchParams } from "@/types/createEditEntryScreen";

export const getSelectedMediaImageUri = (
  uri: string,
): Pick<EntrySearchParams, "selectedMediaImageUri"> => ({
  selectedMediaImageUri: uri,
});
