import React, { useEffect, useRef, useState } from "react";
import { Image } from "antd";
import { useQuery } from "react-query";
import { ImageList, ImageListItem } from "@mui/material";
import { useDebounceFn, useEventListener } from "ahooks";
import { useLocation } from "react-router-dom";
import { fileAPI } from "@src/common/api/file";

const ImageListPreview: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  previewImages: string[];
}> = ({ visible, setVisible, previewImages }) => {
  const [images, setImages] = useState([]);
  const remainImagesRef = useRef<string[]>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const images = previewImages.slice(0, 5);
    setImages(images);
    remainImagesRef.current = previewImages.slice(images.length);
  }, [previewImages]);

  return (
    <>
      <div style={{ display: "none" }}>
        <Image.PreviewGroup
          preview={{
            current,
            visible,
            onVisibleChange: (vis) => setVisible(vis),
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

export const ImagePreview: React.FC = () => {
  // const { dir } = useParams();
  const { search } = useLocation();
  const dir = new URLSearchParams(search).get("dir");
  const [images, setImages] = useState<string[]>([]);
  const remainImagesRef = useRef<string[]>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useQuery(
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

  // const handleScroll = (event: React.UIEvent<HTMLElement>) => {
  //   const container = event.currentTarget;
  //   if (
  //     container.scrollTop + container.clientHeight >=
  //     container.scrollHeight - 100
  //   ) {
  //     getMoreImages();
  //   }
  // };
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 页面滚动到底部
      getMoreImages();
    }
  };
  useEventListener("scroll", handleScroll, { target: window });

  return (
    <>
      <ImageList
        // onScroll={handleScroll}
        sx={{
          width: "80%",
          // height: "100%",
          // maxHeight: "100vh",
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
              style={{ width: "100%", cursor: "pointer" }}
              onClick={() => {
                setPreviewImages(
                  images.slice(index).concat(remainImagesRef.current)
                );
              }}
              src={`file://${src}`}
            />
          </ImageListItem>
        ))}
      </ImageList>
      {previewImages.length ? (
        <ImageListPreview
          previewImages={previewImages}
          visible={!!previewImages.length}
          setVisible={() => setPreviewImages([])}
        />
      ) : null}
    </>
  );
};
