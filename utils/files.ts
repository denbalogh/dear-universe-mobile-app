import { VideoWithThumbnail } from "@/components/MediaGallery/VideoGallery";
import {
  IMAGES_DIR,
  RECORDINGS_DIR,
  THUMBNAILS_DIR,
  VIDEOS_DIR,
} from "@/constants/files";
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

export const moveImagesToAppDirectoryAndGetPaths = async (
  imagesUri: string[],
) => {
  if (imagesUri.length === 0) {
    return [];
  }

  await createDirectoryIfNotExists(IMAGES_DIR);

  const newFiles: string[] = [];

  for (const uri of imagesUri) {
    const filename = uri.split("/").pop();
    const dest = `${IMAGES_DIR}${filename}`;

    await moveAsync({
      from: uri,
      to: dest,
    });

    newFiles.push(dest);
  }

  return newFiles;
};

export const moveVideosToAppDirectoryAndGetPaths = async (
  videosWithThumbnail: VideoWithThumbnail[],
) => {
  if (videosWithThumbnail.length === 0) {
    return [];
  }

  await createDirectoryIfNotExists(VIDEOS_DIR);
  await createDirectoryIfNotExists(THUMBNAILS_DIR);

  const newVideosWithThumbnail: VideoWithThumbnail[] = [];

  for (const { videoUri, thumbnailUri } of videosWithThumbnail) {
    const videoFilename = videoUri.split("/").pop();
    const thumbnailFilename = thumbnailUri.split("/").pop();

    const videoDest = `${VIDEOS_DIR}${videoFilename}`;
    const thumbnailDest = `${THUMBNAILS_DIR}${thumbnailFilename}`;

    await moveAsync({
      from: videoUri,
      to: videoDest,
    });

    await moveAsync({
      from: thumbnailUri,
      to: thumbnailDest,
    });

    newVideosWithThumbnail.push({
      videoUri: videoDest,
      thumbnailUri: thumbnailDest,
    });
  }

  return newVideosWithThumbnail;
};

export const moveRecordingToAppDirectoryAndGetPath = async (
  recordingUri: string,
) => {
  if (!recordingUri) {
    return "";
  }

  await createDirectoryIfNotExists(RECORDINGS_DIR);

  const filename = recordingUri.split("/").pop();
  const dest = `${RECORDINGS_DIR}${filename}`;

  await moveAsync({
    from: recordingUri,
    to: dest,
  });

  return dest;
};

export const moveAndDeleteUpdatedImagesAndGetPaths = async (
  imagesUri: string[],
  initialImagesUri: string[],
) => {
  const deletedImagesUri = initialImagesUri.filter(
    (initialImageUri) => !imagesUri.includes(initialImageUri),
  );

  await createDirectoryIfNotExists(IMAGES_DIR);

  // Remove deleted images from phone storage
  for (const uri of deletedImagesUri) {
    await deleteAsync(uri);
  }

  const newImagesUri: string[] = [];

  for (const uri of imagesUri) {
    const isNewImageUri = !initialImagesUri.includes(uri);

    if (isNewImageUri) {
      const filename = uri.split("/").pop();
      const dest = `${IMAGES_DIR}${filename}`;

      await moveAsync({
        from: uri,
        to: dest,
      });

      newImagesUri.push(dest);
    } else {
      newImagesUri.push(uri);
    }
  }

  return newImagesUri;
};

export const moveAndDeleteUpdatedVideosAndGetPaths = async (
  videosWithThumbnail: VideoWithThumbnail[],
  initialVideosWithThumbnail: VideoWithThumbnail[],
) => {
  const deletedVideosWithThumbnail = initialVideosWithThumbnail.filter(
    ({ videoUri, thumbnailUri }) =>
      !videosWithThumbnail.some(
        ({ videoUri: newVideoUri, thumbnailUri: newThumbnailUri }) =>
          videoUri === newVideoUri && thumbnailUri === newThumbnailUri,
      ),
  );

  await createDirectoryIfNotExists(VIDEOS_DIR);
  await createDirectoryIfNotExists(THUMBNAILS_DIR);

  // Remove deleted videos and thumbnails from phone storage
  for (const { videoUri, thumbnailUri } of deletedVideosWithThumbnail) {
    await deleteAsync(videoUri);
    await deleteAsync(thumbnailUri);
  }

  const newVideosWithThumbnail: VideoWithThumbnail[] = [];

  for (const { videoUri, thumbnailUri } of videosWithThumbnail) {
    const isNewVideoWithThumbnail = !initialVideosWithThumbnail.some(
      ({ videoUri: initialVideoUri, thumbnailUri: initialThumbnailUri }) =>
        videoUri === initialVideoUri && thumbnailUri === initialThumbnailUri,
    );

    if (isNewVideoWithThumbnail) {
      const videoFilename = videoUri.split("/").pop();
      const thumbnailFilename = thumbnailUri.split("/").pop();

      const videoDest = `${VIDEOS_DIR}${videoFilename}`;
      const thumbnailDest = `${THUMBNAILS_DIR}${thumbnailFilename}`;

      await moveAsync({
        from: videoUri,
        to: videoDest,
      });

      await moveAsync({
        from: thumbnailUri,
        to: thumbnailDest,
      });

      newVideosWithThumbnail.push({
        videoUri: videoDest,
        thumbnailUri: thumbnailDest,
      });
    } else {
      newVideosWithThumbnail.push({ videoUri, thumbnailUri });
    }
  }

  return newVideosWithThumbnail;
};

export const moveAndDeleteUpdatedRecordingAndGetPath = async (
  recordingUri: string,
  initialRecordingUri: string,
) => {
  if (!recordingUri) {
    return "";
  }

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
