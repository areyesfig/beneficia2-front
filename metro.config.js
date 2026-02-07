const path = require("path");
const { resolve: metroResolve } = require("metro-resolver");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Alias @/ -> src/ (Metro no usa tsconfig paths)
  if (moduleName.startsWith("@/")) {
    const subpath = moduleName.slice(2);
    const absolute = path.resolve(__dirname, "src", subpath);
    return metroResolve(
      { ...context, resolveRequest: metroResolve },
      absolute,
      platform
    );
  }
  // Metro a veces no resuelve bien los imports relativos con .js en @react-navigation/native
  if (
    context.originModulePath?.includes("@react-navigation/native") &&
    moduleName.startsWith("./") &&
    moduleName.endsWith(".js")
  ) {
    const dir = path.dirname(context.originModulePath);
    const absolute = path.resolve(dir, moduleName);
    return { type: "sourceFile", filePath: absolute };
  }
  // Usar el resolver por defecto; nunca devolver null (NativeWind hace "filePath" in resolved)
  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return metroResolve(
    { ...context, resolveRequest: metroResolve },
    moduleName,
    platform
  );
};

module.exports = withNativeWind(config, { input: "./global.css" });
