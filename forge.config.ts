import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack/webpack.main.config";
import { rendererConfig } from "./webpack/webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    icon: "icons/icon",
  },
  rebuildConfig: {},
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "liam",
          name: "ruri",
        },
        draft: true
      },
    },
  ],

  makers: [
    new MakerDMG({
      format: "ULFO",
      icon: "icons/icon.icns",
    }),
    new MakerSquirrel({
      setupIcon: "icons/icon.ico",
    }),
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
            name: "main_window",
          },
        ],
      },
    }),
  ],
};

export default config;
