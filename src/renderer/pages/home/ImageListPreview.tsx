import React, { useRef, useState } from "react";
import { Image } from "antd";
import { useQuery } from "react-query";

export const ImageListPreview: React.FC<{
  dir: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible, dir }) => {
  const [images, setImages] = useState([]);
  const remainImagesRef = useRef<string[]>();
  const { data: allImages = [] } = useQuery(
    ["getAllFilesFromDir", dir],
    () => window.myAPI.getAllFilesFromDir(dir, "image"),
    {
      enabled: !!dir,
      onSuccess: (data) => {
        const images = data.slice(0, 10);
        setImages(images);
        remainImagesRef.current = data.slice(images.length);
      }
    }
  );
  const [current, setCurrent] = useState(0);
  return (
    <>
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{
            current,
            visible,
            onVisibleChange: (vis) => setVisible(vis),
            // countRender(current) {
            //   return `${current} / ${images.length}`;
            // },
            onChange(current) {
              setCurrent(current);
              if (
                images.length - current < 5 &&
                remainImagesRef.current.length
              ) {
                setImages([...images, ...remainImagesRef.current.slice(0, 5)]);
                remainImagesRef.current = remainImagesRef.current.slice(5);
              }
            }
          }}
        >
          {images.map((src) => {
            return <Image key={src} src={`file://${src}`} />;
          })}
        </Image.PreviewGroup>
      </div>
    </>
  );
};
