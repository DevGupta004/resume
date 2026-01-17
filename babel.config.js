// Babel config for React Native (Metro bundler)
// Webpack uses its own inline babel config in webpack.config.js
module.exports = {
  presets: [
    '@react-native/babel-preset',
  ],
  plugins: [
    // NativeWind v4 doesn't require babel plugin - it uses react-native-css-interop
  ],
};
