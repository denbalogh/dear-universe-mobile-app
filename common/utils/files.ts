import {
  deleteAsync,
  getInfoAsync,
  makeDirectoryAsync,
  moveAsync,
} from "expo-file-system";
import { IMAGES_DIR, RECORDINGS_DIR, VIDEOS_DIR } from "../constants/files";
import { Media } from "../types/Media";

const createDirIfNotExists = async (directory: string) => {
  const { exists } = await getInfoAsync(directory);

  if (!exists) {
    await makeDirectoryAsync(directory);
  }
};

export const moveMediaToAppDirAndGetPaths = async (media: Media[]) => {
  const newFiles: Media[] = [];

  for (const { uri, mediaType } of media) {
    const filename = uri.split("/").pop();
    let dest;

    if (mediaType === "image") {
      await createDirIfNotExists(IMAGES_DIR);
      dest = `${IMAGES_DIR}${filename}`;
    } else if (mediaType === "video") {
      await createDirIfNotExists(VIDEOS_DIR);
      dest = `${VIDEOS_DIR}${filename}`;
    } else {
      // Skip unsupported media types
      continue;
    }
    // Move the file to the new directory
    await moveAsync({ from: uri, to: dest });
    newFiles.push({ uri: dest, mediaType } as Media);
  }

  return newFiles;
};

export const moveRecordingToAppDirAndGetPath = async (recordingUri: string) => {
  if (!recordingUri) return "";

  await createDirIfNotExists(RECORDINGS_DIR);

  const filename = recordingUri.split("/").pop();
  const dest = `${RECORDINGS_DIR}${filename}`;

  await moveAsync({ from: recordingUri, to: dest });
  return dest;
};

export const moveAndDeleteUpdatedMediaAndGetPaths = async (
  media: Media[],
  initialMedia: Media[],
) => {
  const deletedMedia = initialMedia.filter(
    ({ uri: initialUri, mediaType: initialMediaType }) =>
      !media.some(
        ({ uri: newUri, mediaType: newMediaType }) =>
          initialUri === newUri && initialMediaType === newMediaType,
      ),
  );

  // Remove deleted media from phone storage
  for (const { uri } of deletedMedia) {
    await deleteAsync(uri);
  }

  const newMedia: Media[] = [];

  for (const { uri, mediaType } of media) {
    const isNewMedia = !initialMedia.some(
      ({ uri: initialUri, mediaType: initialMediaType }) =>
        uri === initialUri && mediaType === initialMediaType,
    );

    if (isNewMedia) {
      const filename = uri.split("/").pop();
      let dest;

      if (mediaType === "image") {
        await createDirIfNotExists(IMAGES_DIR);
        dest = `${IMAGES_DIR}${filename}`;
      } else if (mediaType === "video") {
        await createDirIfNotExists(VIDEOS_DIR);
        dest = `${VIDEOS_DIR}${filename}`;
      } else {
        // Skip unsupported media types
        continue;
      }
      // Move the file to the new directory
      await moveAsync({ from: uri, to: dest });
      newMedia.push({ uri: dest, mediaType } as Media);
    } else {
      newMedia.push({ uri, mediaType } as Media);
    }
  }

  return newMedia;
};

export const moveAndDeleteUpdatedRecordingAndGetPath = async (
  recordingUri: string,
  initialRecordingUri: string,
) => {
  if (initialRecordingUri && !recordingUri) {
    // Remove deleted recording from phone storage
    await deleteAsync(initialRecordingUri);
  }

  if (!recordingUri) return "";

  await createDirIfNotExists(RECORDINGS_DIR);

  // Remove deleted recording from phone storage
  if (initialRecordingUri && recordingUri !== initialRecordingUri) {
    await deleteAsync(initialRecordingUri);
  }

  const filename = recordingUri.split("/").pop();
  const dest = `${RECORDINGS_DIR}${filename}`;

  await moveAsync({ from: recordingUri, to: dest });
  return dest;
};

export const deleteFilesInEntry = async (
  media: Media[],
  recordingUri: string,
) => {
  for (const { uri } of media) {
    await deleteAsync(uri);
  }

  if (recordingUri) {
    await deleteAsync(recordingUri);
  }
};
