const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') ? 'production' : 'development';

module.exports = {
  entry: './web/index.js',
  mode: mode,
  devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!(react-native-.*|@react-native.*|tamagui|@tamagui.*|react-native-webview)\/).*|node_modules\/react-native-image-picker/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false, // Don't use babel.config.js for webpack
            configFile: false, // Don't use babel.config.js for webpack
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions']
                }
              }],
              ['@babel/preset-react', { 
                runtime: 'automatic'
              }],
            ],
            plugins: [],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|eot)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.ttf$/,
        include: [
          path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
          path.resolve(__dirname, 'web/fonts'),
        ],
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      // Exclude react-native-image-picker on web (we use browser file picker instead)
      'react-native-image-picker': false,
    },
    fallback: {
      // process is provided by ProvidePlugin and DefinePlugin
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.platform': JSON.stringify('web'),
      'process.version': JSON.stringify('v16.0.0'),
      'process.browser': JSON.stringify(true),
      '__DEV__': JSON.stringify(mode !== 'production'),
      '__TEST__': JSON.stringify(false),
    }),
    // process is imported in web/index.js, no need for ProvidePlugin
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'web'),
      },
      {
        directory: path.join(__dirname, 'web/fonts'),
        publicPath: '/fonts',
      },
    ],
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, 'web-build'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/',
  },
};
