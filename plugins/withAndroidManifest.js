const { withAndroidManifest } = require("@expo/config-plugins")

module.exports = function androiManifestPlugin(config) {
  return withAndroidManifest(config, async config => {
    let androidManifest = config.modResults.manifest

    // add the tools to apply permission remove
    console.log(`withAndroidManifest: remote deprecated package in manifest to ${namespace}`);
    delete androidManifest.$["package"]

    return config
  })
}