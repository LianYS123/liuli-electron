import { Menu, app } from "electron";
import { windowManager } from "./window";

export const initApplicationMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          label: "Restart",
          click() {
            app.quit();
            app.relaunch();
          }
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Open DevTools",
          click() {
            // Open the DevTools.
            windowManager.mainWindow.webContents.openDevTools();
          }
        },
        {
          label: "Reload",
          role: "reload"
        },
        {
          label: "Force Reload",
          role: "forceReload"
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
};
