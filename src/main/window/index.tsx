import { BrowserWindow } from "electron";

class WindowManager {
  mainWindow: BrowserWindow;
  createMainWindow = () => {
    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      height: 750,
      width: 1200,
      webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        webSecurity: false,
        sandbox: false
      }
    });

    // and load the index.html of the app.
    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (process.env.NODE_ENV === "development") {
      this.mainWindow.webContents.openDevTools();
    }
  };
}

export const windowManager = new WindowManager();
