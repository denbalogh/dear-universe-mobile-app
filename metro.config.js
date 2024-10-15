const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const withStorybook = require("@storybook/react-native/metro/withStorybook");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// This is a workaround to prevent storybook files from being included in the bundle
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const defaultResolveResult = context.resolveRequest(
    context,
    moduleName,
    platform,
  );

  if (
    process.env.STORYBOOK_ENABLED !== "true" &&
    defaultResolveResult?.filePath?.includes?.(".storybook/")
  ) {
    return {
      type: "empty",
    };
  }

  return defaultResolveResult;
};

module.exports = withStorybook(config, {
  // Set to false to remove storybook specific options
  enabled: process.env.STORYBOOK_ENABLED === "true",
  // Path to storybook config
  configPath: path.resolve(__dirname, "./.storybook"),
});
