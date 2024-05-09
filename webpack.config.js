const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = {
  entry: "./src/js/index.ts",
  output: {
    filename: "./bundle.js",
  },
  mode: "production",
  devtool: "source-map",
  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: "/(node_modules)/",
        use: [
          {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WorkboxWebpackPlugin.GenerateSW({
      swDest: "sw.js",
    }),
  ],
  optimization: {
    minimize: true,
  },
};
