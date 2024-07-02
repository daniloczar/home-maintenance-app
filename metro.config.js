const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__direname);
defaultConfig.resolver.assetExts.push("cjs");
module.exports = defaultConfig;
