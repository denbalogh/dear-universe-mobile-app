import { documentDirectory } from "expo-file-system";

export const IMAGES_DIR = `${documentDirectory}images/` as const;
export const RECORDINGS_DIR = `${documentDirectory}recordings/` as const;
export const VIDEOS_DIR = `${documentDirectory}videos/` as const;
export const THUMBNAILS_DIR = `${documentDirectory}thumbnails/` as const;
