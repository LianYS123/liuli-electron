import { Box } from "@mui/material";
import React, { useState } from "react";
import { ActionList, SettingActionEnum } from "./ActionList";
import { WallpaperSetting } from "./WallpaperSetting";

export const Settings: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [currentAction, setCurrentAction] = useState<SettingActionEnum>(
    SettingActionEnum.Wallpaper
  );

  const renderContent = () => {
    switch (currentAction) {
      case SettingActionEnum.Wallpaper:
        return <WallpaperSetting enabled={enabled} />;

      default:
        return <></>;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 450,
        minWidth: 450,
        padding: 2,
      }}
    >
      <ActionList
        currentAction={currentAction}
        setCurrentAction={setCurrentAction}
      />
      <Box sx={{ height: 30 }} />
      {renderContent()}
    </Box>
  );
};
