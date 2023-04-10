import { File } from "@src/common/interfaces/file.interface";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import React from "react";

export const Video: React.FC<{ file: File }> = ({ file }) => {
  console.log(file.mimetype);
  return file && file.filePath ? (
    <Plyr
      source={{
        type: "video",
        sources: [
          {
            src: file.filePath,
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
