const path = require("path");
const webpack = require("webpack");
const WriteFilePlugin = require("write-file-webpack-plugin");
const AutoDllPlugin = require("autodll-webpack-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const nib = require("nib");

module.exports = {
  mode: "development",
  name: "client",
  target: "web",
  devtool: "cheap-module-source-map",
  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false",
    "react-hot-loader/patch",
    path.resolve(__dirname, "../src/index.tsx")
  ],
  output: {
    filename: "[name].js",
    chunkFilename: "[name].js",
    path: path.resolve(__dirname, "../buildClient"),
    publicPath: "/static/"
  },
  serve: {
    publicPath: "/static/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: "ts-loader"
      },
      {
        test: /\.styl$/,
        use: [
          ExtractCssChunks.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]__[local]--[hash:base64:5]"
            }
          },
          {
            loader: "stylus-loader",
            options: {
              use: [nib()],
              import: ["~nib/lib/nib/index.styl"],
              preferPathResolver: "webpack"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".styl"],
    alias: {
      components: path.resolve(__dirname, "../src/components"),
      containers: path.resolve(__dirname, "../src/containers"),
      routes: path.resolve(__dirname, "../src/routes"),
      manifests: path.resolve(__dirname, "../src/manifests"),
      images: path.resolve(__dirname, "../src/images"),
      actions: path.resolve(__dirname, "../src/actions"),
      reducers: path.resolve(__dirname, "../src/reducers"),
      selectors: path.resolve(__dirname, "../src/selectors")
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /bootstrap/,
          priority: -10
        },
        default: {
          minChunks: Infinity,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new WriteFilePlugin(), // used so you can see what chunks are produced in dev
    new ExtractCssChunks(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin([
      "NODE_ENV",
      "CRAFTING_CONTENT",
      "CRAFTING_FORMSPREE_ID"
    ]),
    new AutoDllPlugin({
      context: path.join(__dirname, ".."),
      filename: "[name].js",
      entry: {
        vendor: [
          "react",
          "react-dom",
          "react-redux",
          "redux",
          "history/createBrowserHistory",
          "transition-group",
          "redux-first-router",
          "redux-first-router-link",
          "redux-devtools-extension"
        ]
      }
    })
  ]
};
