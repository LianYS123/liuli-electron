// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";
import { myAPI } from "./myAPI";

console.log(myAPI);

contextBridge.exposeInMainWorld("myAPI", myAPI);
