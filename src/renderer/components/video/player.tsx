import Player from "xgplayer/dist/core_player";
import play from "xgplayer/dist/controls/play";
import fullscreen from "xgplayer/dist/controls/fullscreen";
import progress from "xgplayer/dist/controls/progress";
import volume from "xgplayer/dist/controls/volume";
import pip from "xgplayer/dist/controls/pip";
import flex from "xgplayer/dist/controls/flex";
import { IFile } from "../../services/file";
import React, { useEffect } from "react";

export const XGPlayer: React.FC<{ file: IFile }> = ({ file }) => {
  useEffect(() => {
    let player = new Player({
      id: "vs",
      url: file.url,
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
