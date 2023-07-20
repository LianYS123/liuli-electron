import React, { useEffect, useRef, useState } from "react";
import { Image, Space } from "antd";
import Icon, {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from "@ant-design/icons";
import { useQuery } from "react-query";
import { ImageList, ImageListItem } from "@mui/material";
import { useDebounceFn } from "ahooks";
import { useLocation } from "react-router-dom";
import { fileAPI } from "@src/common/api/file";
import { useDispatch } from "react-redux";
import { appSlice } from "@src/renderer/models/app";
import MemoWalpaper from "./Walpaper";

const ImageListPreview: React.FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  previewImages: string[];
}> = ({ visible, setVisible, previewImages }) => {
  const [images, setImages] = useState([]);
  const remainImagesRef = useRef<string[]>();
  const [current, setCurrent] = useState(0);

  const dispatch = useDispatch();

  const handleSetWallpaper = (src: string) => {
    dispatch(appSlice.actions.setWallpaper(src));
  };

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
            },

            toolbarRender: (
              _,
              {
                transform: { scale },
                actions: {
                  onFlipX,
                  onFlipY,
                  onRotateLeft,
                  onRotateRight,
                  onZoomIn,
                  onZoomOut
                }
              }
            ) => (
              <Space
                style={{ fontSize: 20 }}
                size={16}
                className="toolbar-wrapper"
              >
                <Icon
                  component={MemoWalpaper}
                  onClick={() => {
                    handleSetWallpaper(`file://${images[current]}`);
                  }}
                />
                <SwapOutlined rotate={90} onClick={onFlipY} />
                <SwapOutlined onClick={onFlipX} />
                <RotateLeftOutlined onClick={onRotateLeft} />
                <RotateRightOutlined onClick={onRotateRight} />
                <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
              </Space>
            )
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

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (ev) => {
    const { scrollTop, clientHeight, scrollHeight } = ev.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // 页面滚动到底部
      getMoreImages();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "auto"
      }}
      onScroll={handleScroll}
    >
      <ImageList
        sx={{
          width: "80%",
          // maxHeight: "100vh",
          margin: "auto"
          // background: (d) => d.palette.background.default
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
    </div>
  );
};
