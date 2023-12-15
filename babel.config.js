module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      ['expo-router/babel'],
      // ...
    ],
    presets: ['babel-preset-expo'],
  };
};
