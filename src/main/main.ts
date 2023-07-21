import { app, BrowserWindow, dialog, protocol } from "electron";
import { DataSource } from "typeorm";
import { dbConnection } from "./databases";
import { logger } from "./utils/logger";
import url from "url";
import { windowManager } from "./window";
import { initApplicationMenu } from "./menu";
import { handleService } from "./utils/handleService";
import { articleService } from "./services/article.service";
import { fileService } from "./services/file.service";
import { store } from "./store";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

logger.info("APP Start...");
logger.info(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY);
logger.info(MAIN_WINDOW_WEBPACK_ENTRY);
logger.info(app.getPath("appData"));

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  windowManager.createMainWindow();
  // 注册协议

  protocol.registerFileProtocol("file", (request, callback) => {
    const filePath = url.fileURLToPath(
      "file://" + request.url.slice("file://".length)
    );
    callback(filePath);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    windowManager.createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

new DataSource(dbConnection).initialize();
// initChannelHandlers();

const storeService: Pick<typeof store, "get" | "set" | "delete"> = {
  get: (key: string) => {
    return store.get(key);
  },
  set: (key: any, value?: any) => store.set(key, value),
  delete: (key: string) => store.get(key)
};

handleService({ ...articleService }, { prefix: "ArticleService" });
handleService({ ...fileService }, { prefix: "FileService" });
handleService({ ...dialog }, { prefix: "Dialog" });
handleService(storeService, { prefix: "Store" });
initApplicationMenu();
