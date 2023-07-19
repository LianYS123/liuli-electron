import { dialog } from "electron";

export const chooseFiles = async (extensions: string[]) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "dontAddToRecent", "multiSelections"],
    filters: [{ name: "File", extensions }]
  });
  return filePaths;
};

export const chooseImages = () => {
  return chooseFiles(["png", "jpg", "jpeg"]);
};

export const chooseVideos = () => {
  return chooseFiles(["mkv", "avi", "mp4"]);
};

export const chooseMedia = () => {
  return chooseFiles(["png", "jpg", "jpeg", "mkv", "avi", "mp4"]);
};

export function isScrolledToBottom(gap = 0) {
  // Get the height of the entire document
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );

  // Get the current scroll position
  const scrollPosition = window.innerHeight + window.pageYOffset;

  // Determine if scrolled to the bottom
  return scrollPosition >= documentHeight - gap;
}
