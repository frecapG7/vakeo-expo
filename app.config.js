const IS_PRODUCTION = process.env.APP_ENVIRONMENT === 'production';
const packageJson = require('./package.json');

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
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: IS_PRODUCTION ? 'com.frecapg7.olyne' : 'com.frecapg7.vakeoexpo',
      versionCode: packageJson.version.split('.').reduce((acc, part, i) => acc + parseInt(part, 10) * Math.pow(100, 2 - i), 0)
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
          backgroundColor: '#7BDCB5',
          dark: {
            image: './assets/images/splash-dark.png',
            backgroundColor: '#000000',
          },
          imageWidth: 200,
        },
      ],
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
