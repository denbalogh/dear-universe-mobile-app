import { ImagePickerAsset } from "expo-image-picker";

export type MediaType = ImagePickerAsset["type"];

export type Media = {
  id: string;
  entryId: string;
  uri: string;
  mediaType: MediaType;
};
