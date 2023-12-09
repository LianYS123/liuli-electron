import { Menu, app, shell } from 'electron';
import { DB_PATH } from './config';
// import { windowManager } from "./window";

const isMac = process.platform === 'darwin';

export const contextMenu = Menu.buildFromTemplate([
  {
    label: '控制台',
    role: 'toggleDevTools',
  },
  {
    label: '应用',
    submenu: [
      {
        label: '日志',
        click: () => {
          shell.showItemInFolder(app.getPath('logs'));
        },
      },
      {
        label: '数据库',
        click: () => {
          shell.showItemInFolder(DB_PATH);
        },
      },
    ],
  },
]);

export const macMenu = Menu.buildFromTemplate([
  // { role: 'appMenu' }
  {
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { role: 'selectAll' },
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
      },
    ],
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
      { type: 'separator' },
      { role: 'window' },
    ],
  },
]);

export const initApplicationMenu = () => {
  if (isMac) {
    Menu.setApplicationMenu(macMenu);
  } else {
    Menu.setApplicationMenu(null);
  }
};
