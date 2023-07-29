import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const postcssConfig = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: [
        [
          "postcss-preset-env",
          {
            // Options
          }
        ],
        ["postcss-nesting"]
      ]
    }
  }
};

rules.push({
  test: /\.css$/,
  exclude: /\.module.css/,
  use: [
    { loader: "style-loader" },
    {
      loader: "css-loader",
      options: {
        modules: false
      }
    },
    postcssConfig
  ]
});
rules.push({
  test: /\.module.css$/,
  exclude: /node_modules/,
  use: [
    { loader: "style-loader" },
    {
      loader: "css-loader",
      options: {
        modules: true
        // scope: 'global'
      }
    },
    postcssConfig
  ]
});

export const rendererConfig: Configuration = {
  // devtool: 'eval',
  devtool: false,
  module: {
    rules
  },
  output: {
    publicPath: "../"
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.json" })]
  }
};
