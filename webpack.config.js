const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry file
  output: {
    filename: 'bundle.js', // Name of the output bundle
    path: path.resolve(__dirname, 'dist'), // Absolute path to the output location
    clean: true, // Clean the output directory before building
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Path to static files
    },
    compress: true, // Enable gzip compression
    port: 9000,
    hot: true, // Hot Module Replacement
    watchFiles: ['src/**/*'], // Change detection
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/,
        // Use 'style-loader', 'css-loader', and 'sass-loader' to process SCSS files.
        // 'sass-loader' compiles SCSS to CSS, 'css-loader' resolves CSS imports,
        // and 'style-loader' injects CSS into the DOM.
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      { test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.pug$/,
        use: ['@webdiscus/pug-loader'],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Path to the HTML file in root
    }),
  ],
};
