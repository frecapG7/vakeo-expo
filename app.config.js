const IS_PRODUCTION = process.env.APP_ENVIRONMENT === 'production';
const packageJson = require('./package.json');


const { withGradleProperties } = require('@expo/config-plugins');

// Tuning Gradle pour le build (CI comme local) : cache de build + JVM 3g.
// Le template Expo pose jvmargs 2g - remplace, pas duplique.
const withGradleBuildTuning = (config) =>
  withGradleProperties(config, (props) => {
    // L'action d'un mod recoit le config : le tableau des proprietes est
    // modResults, items discrimines par type ("property").
    const jvmArgs = props.modResults.find(
      (item) => item.type === 'property' && item.key === 'org.gradle.jvmargs'
    );
    if (jvmArgs) {
      jvmArgs.value = '-Xmx3g -XX:MaxMetaspaceSize=512m';
    } else {
      props.modResults.push({ type: 'property', key: 'org.gradle.jvmargs', value: '-Xmx3g -XX:MaxMetaspaceSize=512m' });
    }
    if (!props.modResults.some((item) => item.type === 'property' && item.key === 'org.gradle.caching')) {
      props.modResults.push({ type: 'property', key: 'org.gradle.caching', value: 'true' });
    }
    return props;
  });


const computeVersionCode = (version) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return major * 10000 + minor * 100 + patch;
}

export default {
  expo: {
    name: IS_PRODUCTION ? 'olyne' : 'vakeo-expo',
    slug: 'vakeo-expo',
    version: packageJson.version,
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: IS_PRODUCTION ? 'olyne' : 'vakeoexpo',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_PRODUCTION ? 'com.frecapg7.olyne' : 'com.frecapg7.vakeoexpo',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      icon: {
        dark: './assets/images/ios-dark.png',
        light: './assets/images/ios-light.png',
        tinted: './assets/images/ios-tinted.png',
      },
    },
    android: {
      versionCode: computeVersionCode(packageJson.version),
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#16265C',
      },
      package: IS_PRODUCTION ? 'com.frecapg7.olyne' : 'com.frecapg7.vakeoexpo'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash.png',
          backgroundColor: '#F7B74A',
          dark: {
            image: './assets/images/splash-dark.png',
            backgroundColor: '#101736',
          },
          imageWidth: 400,
        },
      ],
      'expo-status-bar',
      'expo-web-browser',
      [
        '@sentry/react-native/expo',
        {
          url: 'https://sentry.io/',
          project: 'vakeo',
          organization: 'florian-recape',
        },
      ],
      '@sentry/react-native',
      'expo-font',
      'expo-image',
      '@react-native-vector-icons/fontawesome5',
      '@react-native-vector-icons/material-icons',
      withGradleBuildTuning,
      [
        'expo-build-properties',
        {
          android: {
            // R8 + shrink resources : coeur du score d'optimisation Play Console
            // (AAB non minifie = score nul) et de la taille telechargee.
            // Le preview APK est un build release minifie : c'est le vehicule de
            // validation R8 avant toute soumission prod.
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            // ABI unique : x86/x86_64 ne servent qu'aux emulateurs (les tests
            // sont sur tel physique arm64). Temps de compile natif et taille
            // d'APK divises. Remettre x86_64 si l'emulateur devient necessaire.
            buildArchs: ['arm64-v8a'],
            // Reprise des keeps du proguard-rules.pro local : le dossier android/
            // est regenere par prebuild en CI, seul ce canal survit.
            extraProguardRules: [
              '# react-native-reanimated',
              '-keep class com.swmansion.reanimated.** { *; }',
              '-keep class com.facebook.react.turbomodule.** { *; }',
            ].join('\n'),
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'efe585ed-3046-49de-b34c-795cba4467fe',
      },
    },
  },
};
