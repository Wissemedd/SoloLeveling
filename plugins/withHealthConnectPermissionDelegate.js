const { withMainActivity } = require("@expo/config-plugins");

// react-native-health-connect's Expo plugin only patches AndroidManifest.xml.
// Its permission dialog relies on a lateinit ActivityResultLauncher that is
// never initialized unless MainActivity explicitly registers it, which
// otherwise crashes with `UninitializedPropertyAccessException: lateinit
// property requestPermission has not been initialized` the first time a
// permission request is launched. See:
// https://github.com/matinzd/react-native-health-connect#installation
const IMPORT_LINE = "import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate";
const DELEGATE_CALL = "HealthConnectPermissionDelegate.setPermissionDelegate(this)";

module.exports = function withHealthConnectPermissionDelegate(config) {
  return withMainActivity(config, (config) => {
    let { contents } = config.modResults;

    if (!contents.includes(IMPORT_LINE)) {
      contents = contents.replace(/(class MainActivity)/, `${IMPORT_LINE}\n\n$1`);
    }

    if (!contents.includes(DELEGATE_CALL)) {
      contents = contents.replace(/(super\.onCreate\([^)]*\)\s*\n)/, `$1    ${DELEGATE_CALL}\n`);
    }

    config.modResults.contents = contents;
    return config;
  });
};
