export const chooseFiles = async (extensions: string[]) => {
  const { filePaths } = await window.myAPI.showOpenDialog({
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
