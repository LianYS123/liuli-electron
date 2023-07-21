import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack/webpack.main.config";
import { rendererConfig } from "./webpack/webpack.renderer.config";

const config: ForgeConfig = {
  rebuildConfig: {},
  makers: [
    new MakerDMG({
      format: "ULFO"
    })
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy:
        "default-src 'self' 'unsafe-inline' data:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' data:; img-src * file: data: unsafe-inline",
      devServer: { liveReload: false },
      renderer: {
        config: rendererConfig,
        nodeIntegration: true,
        entryPoints: [
          {
            html: "./src/renderer/index.html",
            js: "./src/renderer/index.ts",
            name: "main_window"
          }
        ]
      }
    })
  ]
};

export default config;
