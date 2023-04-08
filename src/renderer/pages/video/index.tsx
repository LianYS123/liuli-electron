import { File } from "@src/common/interfaces/file.interface";
import { Video } from "../../components/video";
import React from "react";
import { useLocation } from "react-router-dom";

export function VideoPage() {
  const { state } = useLocation();
  const file: File = state;

  return <Video file={file} />;
}
