import { Video } from "../../components/video";
import React from "react";
import { useLocation } from "react-router-dom";
import { IFile } from "../../services/file";

export function VideoPage() {
  const { state } = useLocation();
  const file: IFile = state;

  return <Video file={file} />;
}
