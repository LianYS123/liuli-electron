export const chooseImages = async () => {
  const { filePaths } = await window.myAPI.showOpenDialog({
    properties: ["openFile", "dontAddToRecent", "multiSelections"],
    filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }]
  });
  return filePaths;
};

export const chooseVideos = async () => {
  const { filePaths } = await window.myAPI.showOpenDialog({
    properties: ["openFile", "dontAddToRecent", "multiSelections"],
    filters: [{ name: "Videos", extensions: ["mkv", "avi", "mp4"] }]
  });
  return filePaths;
};
