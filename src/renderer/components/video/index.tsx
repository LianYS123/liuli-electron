import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import React from "react";
import { IFile } from "../../services/file";

export const Video: React.FC<{ file: IFile }> = ({ file }) => {
  console.log(file.mimetype);
  return file && file.url ? (
    <Plyr
      source={{
        type: "video",
        sources: [
          {
            src: file.url,
            type: "video/mp4",
            // type: file.mimetype,
            size: file.size
          }
        ]
      }}
    />
  ) : (
    <div>no source</div>
  );
};
