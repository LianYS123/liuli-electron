import { BrowserWindow } from 'electron';

class WindowManager {
  mainWindow: BrowserWindow | null = null;
  createMainWindow = () => {
    // Create the browser window.
    this.mainWindow = new BrowserWindow({
      height: 750,
      width: 1200,
      fullscreen: false,
      fullscreenable: true,
      // icon: path.join(__dirname, "../../../icons/icon.png"),
      webPreferences: {
        // preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        webSecurity: false,
        sandbox: false,
        contextIsolation: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        webviewTag: true,
      },
    });

    // and load the index.html of the app.
    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools();
    }
    return this.mainWindow;
  };

  getMainWindow() {
    if (!this.mainWindow) {
      throw new Error('主窗口不存在');
    }
    return this.mainWindow;
  }
}

export const windowManager = new WindowManager();
