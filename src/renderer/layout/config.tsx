import { Home, VideoFile } from "@mui/icons-material";
import React from "react";
import { routers } from "@src/renderer/config";

export const APP_MENUS = [
  {
    to: routers.HOME,
    text: "首页",
    icon: <Home />
  },
  {
    to: routers.FILES,
    text: "文件中心",
    icon: <VideoFile />
  }
];
