import { useCallback, useMemo, useRef } from "react";
import usePermissionDeniedSnackbar from "./usePermissionDeniedSnackbar";
import logCrashlytics from "@/utils/logCrashlytics";
import {
  Asset,
  AssetsOptions,
  getAssetsAsync,
  MediaType,
  usePermissions,
} from "expo-media-library";

const assetsOptions: AssetsOptions = {
  first: 40,
  mediaType: [MediaType.photo, MediaType.video],
  sortBy: "creationTime",
};

type ReturnType = {
  getInitAssets: () => Promise<Asset[]>;
  getNextAssets: () => Promise<Asset[]>;
  hasNextPage: boolean;
};

const useMediaLibrary = (): ReturnType => {
  const nextPage = useRef<string | undefined>();
  const hasNextPage = useRef(true);

  const { showPermissionDeniedSnackbar } = usePermissionDeniedSnackbar();
  const [libraryPermissions, requestLibraryPermission] = usePermissions();

  const isLibraryAllowed = useMemo(
    () => libraryPermissions?.status === "granted",
    [libraryPermissions],
  );

  const handleRequestLibraryPermissions = useCallback(async () => {
    logCrashlytics("Requesting media library permission");
    const { canAskAgain, granted } = await requestLibraryPermission();

    if (!granted && !canAskAgain) {
      showPermissionDeniedSnackbar("media library");
    }
  }, [requestLibraryPermission, showPermissionDeniedSnackbar]);

  const handleFetchInitialAssets = useCallback(async () => {
    const assets = await getAssetsAsync(assetsOptions);

    nextPage.current = assets.endCursor;
    hasNextPage.current = assets.hasNextPage;
    return assets.assets;
  }, []);

  const handleFetchNextAssets = useCallback(async () => {
    const assets = await getAssetsAsync({
      ...assetsOptions,
      after: nextPage.current,
    });

    nextPage.current = assets.endCursor;
    hasNextPage.current = assets.hasNextPage;
    return assets.assets;
  }, [nextPage]);

  const getInitAssets = useCallback(async () => {
    if (!isLibraryAllowed) {
      await handleRequestLibraryPermissions();
    } else {
      return await handleFetchInitialAssets();
    }
    return [];
  }, [
    handleFetchInitialAssets,
    handleRequestLibraryPermissions,
    isLibraryAllowed,
  ]);

  const getNextAssets = useCallback(async () => {
    if (!isLibraryAllowed) {
      await handleRequestLibraryPermissions();
    } else {
      return await handleFetchNextAssets();
    }
    return [];
  }, [
    handleFetchNextAssets,
    handleRequestLibraryPermissions,
    isLibraryAllowed,
  ]);

  return { getInitAssets, getNextAssets, hasNextPage: hasNextPage.current };
};

export default useMediaLibrary;
