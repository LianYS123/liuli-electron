import { AppBar, Tab, Tabs } from "@mui/material";
import React from "react";

export enum SettingActionEnum {
  Wallpaper,
}

const actions: { key: SettingActionEnum; label: string }[] = [
  {
    key: SettingActionEnum.Wallpaper,
    label: "壁纸",
  },
];

interface ActionListProps {
  currentAction: SettingActionEnum;
  setCurrentAction: (action: SettingActionEnum) => void;
}

export function ActionList({
  currentAction,
  setCurrentAction,
}: ActionListProps) {
  return (
    <AppBar
      color="default"
      sx={{
        position: "sticky",
      }}
    >
      <Tabs
        value={currentAction}
        onChange={(ev, action) => {
          setCurrentAction(action);
        }}
      >
        {actions.map(({ key, label }) => {
          return <Tab key={key} value={key} label={label} />;
        })}
      </Tabs>
    </AppBar>
  );
}
