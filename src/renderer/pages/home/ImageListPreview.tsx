import React, { useRef, useState } from "react";
import { Image } from "antd";
import { useQuery } from "react-query";
import { ImageList, ImageListItem, Modal } from "@mui/material";
import { useDebounceFn } from "ahooks";
import { fileAPI } from "@src/common/api/file";

export const ImageListPreview: React.FC<{
  dir: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible, dir }) => {
  const [images, setImages] = useState([]);
  const remainImagesRef = useRef<string[]>();
  const { data: allImages = [] } = useQuery(
    ["getAllFilesFromDir", dir],
    () => fileAPI.getAllFilesFromDir(dir, "image"),
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

export const ImageListPreviewV2: React.FC<{
  dir: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible, dir }) => {
  const [images, setImages] = useState<string[]>([]);
  const remainImagesRef = useRef<string[]>();
  const { data: allImages = [] } = useQuery(
    ["getAllFilesFromDir", dir],
    () => fileAPI.getAllFilesFromDir(dir, "image"),
    {
      enabled: !!dir,
      onSuccess: (data) => {
        const images = data.slice(0, 30);
        setImages(images);
        remainImagesRef.current = data.slice(images.length);
      }
    }
  );

  // const pageNoRef = useRef(1);

  const { run: getMoreImages } = useDebounceFn(
    () => {
      setImages([...images, ...remainImagesRef.current.slice(0, 30)]);
      remainImagesRef.current = remainImagesRef.current.slice(30);
    },
    { wait: 200 }
  );

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const container = event.currentTarget;
    // console.log(
    //   container.scrollTop + container.clientHeight,
    //   container.scrollHeight
    // );
    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 100
    ) {
      // 元素滚动到底部
      // console.log('滚动到底部');
      getMoreImages();
    }
  };

  return (
    <>
      <Modal
        sx={{
          width: "100%",
          height: "100vh"
        }}
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ImageList
          onScroll={handleScroll}
          sx={{
            width: "80%",
            height: "100%",
            margin: "auto",
            background: (d) => d.palette.background.default
          }}
          variant="woven"
          cols={3}
          gap={8}
        >
          {images.map((src, index) => (
            <ImageListItem key={src}>
              <img
                style={{ width: "100%" }}
                src={`file://${src}`}
                // srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
                // alt={item.title}
                // loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Modal>
    </>
  );
};
