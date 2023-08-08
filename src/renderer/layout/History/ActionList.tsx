import { AppBar, Button, ButtonGroup, Tab, Tabs } from "@mui/material";
import { ActionEnum } from "@src/common/constants";
import React from "react";

const actions: Record<ActionEnum, { text: string }> = {
  [ActionEnum.OpenDownload]: {
    text: "磁力下载"
  },
  [ActionEnum.OpenFile]: {
    text: "打开文件"
  },
  [ActionEnum.Detail]: {
    text: "查看详情"
  },
  [ActionEnum.WatchLater]: {
    text: "稍后观看"
  },
  [ActionEnum.SetWallpaper]: {
    text: "设置壁纸"
  }
};

interface ActionListProps {
  currentAction: ActionEnum;
  setCurrentAction: (action: ActionEnum) => void;
}

export function ActionList({
  currentAction,
  setCurrentAction
}: ActionListProps) {
  return (
    <AppBar
      color="default"
      sx={{
        position: "sticky",
        // left: 0,
        // right: 0,
        // top: 0,
        // display: "flex",
        // justifyContent: "center",
        // zIndex: 9999
        // background: (theme) => theme.palette.background.default
      }}
    >
      <Tabs value={currentAction} onChange={(ev, action) => {
        setCurrentAction(action)
      }}>
        {Object.entries(actions).map(([action, { text }]) => {
          return (
            <Tab value={action} label={text} />
          )
        })}
      </Tabs>
    </AppBar>
  );
}
