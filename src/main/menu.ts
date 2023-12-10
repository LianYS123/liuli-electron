import { Menu, app, shell } from 'electron';
import { DB_PATH } from './config';
import { windowManager } from './window';
// import { windowManager } from "./window";

const isMac = process.platform === 'darwin';

const zoomMenu = Menu.buildFromTemplate([
  {
    label: 'View',
    submenu: [
      {
        label: 'Zoom In',
        accelerator: 'CmdOrCtrl+Plus', // 适当设置快捷键
        click() {
          const win = windowManager.getMainWindow();
          const factor = win?.webContents.getZoomFactor();
          win?.webContents.setZoomFactor(factor + 0.1);
        },
      },
      {
        label: 'Zoom Out',
        accelerator: 'CmdOrCtrl+-', // 适当设置快捷键
        click() {
          const win = windowManager.getMainWindow();
          const factor = win?.webContents.getZoomFactor();
          win?.webContents.setZoomFactor(factor - 0.1);
        },
      },
      {
        label: 'Reset Zoom',
        accelerator: 'CmdOrCtrl+0',
        click() {
          const win = windowManager.getMainWindow();
          win.webContents.setZoomFactor(1); // 重置为默认缩放
        },
      },
    ],
  },
]);

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
  {
    label: '视图',
    submenu: [{ role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }],
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
