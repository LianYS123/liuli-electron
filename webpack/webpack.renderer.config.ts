import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }]
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
