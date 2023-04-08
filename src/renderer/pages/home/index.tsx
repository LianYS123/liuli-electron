import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { TagFilter } from "./TagFilter";
import { useHistoryState } from "./useHistoryState";
import { ArticleItemProps, IArticle } from "../../services/types";
import { ConnectDialog } from "./ConnectDialog";
import { CrawOptions } from "./CrawOptions";
import { useArticles } from "./useArticles";
import { ConnectFilesDialog } from "./ConnectFilesDialog";
import { ArticleList } from "./ArticleList";
import { XGPlayer } from "@src/renderer/components/video/player";
import { Close } from "@mui/icons-material";
import { File } from "@src/common/interfaces/file.interface";

const Home = () => {
  const {
    state: { selectedTags = [] },
    setState
  } = useHistoryState();
  const pageSize = 18;

  const [connectVisible, setConnectVisible] = useState(false);
  const [connectFilesVisible, setFilesVisible] = useState(false);
  const [file, setFile] = useState<File>(null);
  const [article, setArticle] = useState<IArticle>();
  const videoBoxRef = useRef<HTMLDivElement>(null);

  const openConnectDialog = (article: IArticle) => {
    setArticle(article);
    setConnectVisible(true);
  };

  const openConnectFilesDialog = (article: IArticle) => {
    setArticle(article);
    setFilesVisible(true);
  };

  // useEffect(() => {
  //   if (file) {
  //     setTimeout(() => {
  //       videoBoxRef.current.scrollIntoView({ behavior: "smooth" });
  //     }, 0);
  //   }
  // }, [file]);

  const {
    data: { data },
    refetch,
    isFetching,
    isLoading
  } = useArticles({ pageSize });

  // 点击标签
  const handleTagClick = (tag: string) => {
    // 如果标签已选中，则取消选中，否则选中该标签
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((it) => it !== tag)
      : [...selectedTags, tag];
    setState({ selectedTags: newTags, pageNo: 1 });
  };

  const itemProps: Omit<ArticleItemProps, "article"> = {
    handleTagClick,
    refetch,
    openConnectDialog,
    openConnectFilesDialog,
    setFile
  };

  return (
    <Box>
      <TagFilter />

      <CrawOptions refetch={refetch} isFetching={isFetching} />

      {file ? (
        <Box
          ref={videoBoxRef}
          sx={{
            maxWidth: 500,
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            top: 50,
            right: 20,
            backgroundColor: "black"
          }}
        >
          <XGPlayer file={file} />
          <Box
            sx={{
              position: "absolute",
              top: 30,
              right: 0
            }}
          >
            <Box sx={{ width: "100%", textAlign: "right" }}>
              <IconButton
                onClick={() => {
                  setFile(null);
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
        </Box>
      ) : null}

      <ArticleList
        data={data}
        itemProps={itemProps}
        isLoading={isLoading}
        pageSize={pageSize}
      />

      <ConnectDialog
        onSuccess={() => {
          refetch();
        }}
        visible={connectVisible}
        close={() => {
          setConnectVisible(false);
        }}
        article={article}
      />
      <ConnectFilesDialog
        onSuccess={() => {
          refetch();
        }}
        visible={connectFilesVisible}
        close={() => {
          setFilesVisible(false);
        }}
        article={article}
      />
    </Box>
  );
};

export default Home;
