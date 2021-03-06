const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/content/content.ts',
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/manifest.json',
            to: path.join(__dirname, 'dist'),
            force: true,
            transform: function (content, path) {
              // generates the manifest file using the package.json informations
              return Buffer.from(
                JSON.stringify({
                  description: process.env.npm_package_description,
                  version: process.env.npm_package_version,
                  ...JSON.parse(content.toString()),
                })
              );
            },
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/icons',
            to: path.join(__dirname, 'dist', 'icons'),
            force: true,
          },
        ],
      }),
    ]
};