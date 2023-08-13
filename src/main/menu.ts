import { Menu, app, shell } from "electron";
import { DB_PATH } from "./config";
// import { windowManager } from "./window";

const isMac = process.platform === "darwin";

export const menu = Menu.buildFromTemplate([
  {
    label: '控制台',
    role: 'toggleDevTools'
  },
  {
    label: '应用',
    submenu: [
      {
        label: '日志',
        click: () => {
          shell.showItemInFolder(app.getPath('logs'))
        }
      },
      {
        label: '数据库',
        click: () => {
          shell.showItemInFolder(DB_PATH)
        }
      }
    ],
  }
]);


export const initApplicationMenu = () => {
  if (isMac) {
    Menu.setApplicationMenu(menu);
  } else {
    Menu.setApplicationMenu(null)
  }

};
