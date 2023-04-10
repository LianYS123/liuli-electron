import Player from "xgplayer/dist/core_player";
import play from "xgplayer/dist/controls/play";
import fullscreen from "xgplayer/dist/controls/fullscreen";
import progress from "xgplayer/dist/controls/progress";
import volume from "xgplayer/dist/controls/volume";
import pip from "xgplayer/dist/controls/pip";
import flex from "xgplayer/dist/controls/flex";
import React, { useEffect } from "react";
import { File } from "@src/common/interfaces/file.interface";

export const XGPlayer: React.FC<{ file: File }> = ({ file }) => {
  useEffect(() => {
    const player = new Player({
      id: "vs",
      url: file.filePath,
      controlPlugins: [play, fullscreen, progress, volume, pip, flex],
      pip: true, //打开画中画功能
      autoplay: true
    });
    return () => {
      player.destroy();
    };
  }, [file]);
  return <div id="vs"></div>;
};
