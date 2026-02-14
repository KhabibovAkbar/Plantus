module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/navigation': './src/navigation',
            '@/store': './src/store',
            '@/services': './src/services',
            '@/utils': './src/utils',
            '@/hooks': './src/hooks',
            '@/types': './src/types',
            '@/assets': './assets',
          },
        },
      ],
    ],
  };
};
