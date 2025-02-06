import { Media } from "@/components/MediaGallery/EditableMediaGallery";
import { IMAGES_DIR, RECORDINGS_DIR, VIDEOS_DIR } from "@/constants/files";
import { getCrashlytics } from "@react-native-firebase/crashlytics";
import {
  deleteAsync,
  getInfoAsync,
  makeDirectoryAsync,
  moveAsync,
} from "expo-file-system";

const createDirectoryIfNotExists = async (directory: string) => {
  const { exists } = await getInfoAsync(directory);

  if (!exists) {
    await makeDirectoryAsync(directory);
  }
};

export const moveMediaToAppDirectoryAndGetPaths = async (media: Media[]) => {
  getCrashlytics().log("Moving media to app directory");

  const newFiles: Media[] = [];

  await createDirectoryIfNotExists(IMAGES_DIR);
  await createDirectoryIfNotExists(VIDEOS_DIR);

  for (const { imageUri, videoUri } of media) {
    const filename = imageUri.split("/").pop();
    const dest = `${IMAGES_DIR}${filename}`;

    await moveAsync({
      from: imageUri,
      to: dest,
    });

    const newMedia: Media = { imageUri: dest };

    if (videoUri) {
      const videoFilename = videoUri.split("/").pop();
      const videoDest = `${VIDEOS_DIR}${videoFilename}`;

      await moveAsync({
        from: videoUri,
        to: videoDest,
      });

      newMedia.videoUri = videoDest;
    }

    newFiles.push(newMedia);
  }

  return newFiles;
};

export const moveRecordingToAppDirectoryAndGetPath = async (
  recordingUri: string,
) => {
  if (!recordingUri) {
    return "";
  }

  getCrashlytics().log("Moving recording to app directory");

  await createDirectoryIfNotExists(RECORDINGS_DIR);

  const filename = recordingUri.split("/").pop();
  const dest = `${RECORDINGS_DIR}${filename}`;

  await moveAsync({
    from: recordingUri,
    to: dest,
  });

  return dest;
};

export const moveAndDeleteUpdatedMediaAndGetPaths = async (
  media: Media[],
  initialMedia: Media[],
) => {
  getCrashlytics().log("Moving and deleting updated media");

  const deletedMedia = initialMedia.filter(
    ({ imageUri, videoUri }) =>
      !media.some(
        ({ imageUri: newImageUri, videoUri: newVideoUri }) =>
          imageUri === newImageUri && videoUri === newVideoUri,
      ),
  );

  await createDirectoryIfNotExists(IMAGES_DIR);
  await createDirectoryIfNotExists(VIDEOS_DIR);

  // Remove deleted media from phone storage
  for (const { imageUri, videoUri } of deletedMedia) {
    await deleteAsync(imageUri);

    if (videoUri) {
      await deleteAsync(videoUri);
    }
  }

  const newMedia: Media[] = [];

  for (const { imageUri, videoUri } of media) {
    const isNewMedia = !initialMedia.some(
      ({ imageUri: initialImageUri, videoUri: initialVideoUri }) =>
        imageUri === initialImageUri && videoUri === initialVideoUri,
    );

    if (isNewMedia) {
      const imageFilename = imageUri.split("/").pop();
      const imageDest = `${IMAGES_DIR}${imageFilename}`;

      await moveAsync({
        from: imageUri,
        to: imageDest,
      });

      const newMediaItem: Media = { imageUri: imageDest };

      if (videoUri) {
        const videoFilename = videoUri.split("/").pop();
        const videoDest = `${VIDEOS_DIR}${videoFilename}`;

        await moveAsync({
          from: videoUri,
          to: videoDest,
        });

        newMediaItem.videoUri = videoDest;
      }

      newMedia.push(newMediaItem);
    } else {
      newMedia.push({ imageUri, videoUri });
    }
  }

  return newMedia;
};

export const moveAndDeleteUpdatedRecordingAndGetPath = async (
  recordingUri: string,
  initialRecordingUri: string,
) => {
  if (!recordingUri) {
    return "";
  }

  getCrashlytics().log("Moving and deleting updated recording");

  await createDirectoryIfNotExists(RECORDINGS_DIR);

  // Remove deleted recording from phone storage
  if (initialRecordingUri && recordingUri !== initialRecordingUri) {
    await deleteAsync(initialRecordingUri);
  }

  const filename = recordingUri.split("/").pop();
  const dest = `${RECORDINGS_DIR}${filename}`;

  await moveAsync({
    from: recordingUri,
    to: dest,
  });

  return dest;
};

export const deleteFilesInEntry = async (
  media: Media[],
  recordingUri: string,
) => {
  getCrashlytics().log("Deleting files in entry");

  for (const { imageUri, videoUri } of media) {
    await deleteAsync(imageUri);

    if (videoUri) {
      await deleteAsync(videoUri);
    }
  }

  if (recordingUri) {
    await deleteAsync(recordingUri);
  }
};
