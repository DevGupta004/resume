const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') ? 'production' : 'development';

module.exports = {
  entry: './web/index.js',
  mode: mode,
  devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
  ignoreWarnings: [
    {
      module: /react-native-fs/,
      message: /Critical dependency/,
    },
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: function(modulePath) {
          // Exclude react-native-fs completely
          if (modulePath.includes('node_modules/react-native-fs')) {
            return true;
          }
          // Exclude llama.rn completely
          if (modulePath.includes('node_modules/llama.rn')) {
            return true;
          }
          // Exclude react-native-image-picker
          if (modulePath.includes('node_modules/react-native-image-picker')) {
            return true;
          }
          // Default exclude pattern for other node_modules
          if (modulePath.includes('node_modules') && 
              !modulePath.match(/node_modules\/(react-native-|@react-native|tamagui|@tamagui|react-native-webview)/)) {
            return true;
          }
          return false;
        },
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
      // Exclude llama.rn on web (React Native only)
      'llama.rn': false,
      // Exclude react-native-fs on web (React Native only)
      'react-native-fs': false,
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'web/fonts'),
          to: path.resolve(__dirname, 'web-build/fonts'),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, 'node_modules/react-native-vector-icons/Fonts'),
          to: path.resolve(__dirname, 'web-build/fonts'),
          globOptions: {
            ignore: ['**/FontAwesome5*.ttf', '**/FontAwesome6*.ttf'], // Only copy FontAwesome.ttf (v4) to avoid conflicts
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.platform': JSON.stringify('web'),
      'process.version': JSON.stringify('v16.0.0'),
      'process.browser': JSON.stringify(true),
      '__DEV__': JSON.stringify(mode !== 'production'),
      '__TEST__': JSON.stringify(false),
    }),
    // Ignore React Native-only packages on web builds
    new webpack.IgnorePlugin({
      resourceRegExp: /^(llama\.rn|react-native-fs)$/,
    }),
    // Replace react-native-fs with empty module on web
    new webpack.NormalModuleReplacementPlugin(
      /^react-native-fs$/,
      require.resolve('./web/empty-module.js')
    ),
    // Replace llama.rn with empty module on web
    new webpack.NormalModuleReplacementPlugin(
      /^llama\.rn$/,
      require.resolve('./web/empty-module.js')
    ),
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
