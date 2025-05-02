import { ImagePickerAsset } from "expo-image-picker";

export type MediaType = ImagePickerAsset["type"];

export type Media = {
  uri: string;
  mediaType: MediaType;
};
