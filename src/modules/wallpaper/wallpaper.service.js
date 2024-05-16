const path = require("path");
const sharp = require("sharp");

const getImageMetadata = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    return null;
  }
};

const wallpapersMake = async (files, userId) => {
  const wallpapers = [];
  for (let i = 0; i < files.length; i++) {
    const url = files[i]?.path;
    const imageMetadata = await getImageMetadata(url);
    if (url) {
      let lastDotIndex = url.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        let firstSplit = url.substring(0, lastDotIndex).split("\\");
        if (firstSplit?.length > 1) {
          const slug = firstSplit[firstSplit.length - 1];
          wallpapers.push({
            user: userId,
            wallpaper: files[i]?.path,
            slug: slug,
            dimensions: imageMetadata,
            size: files[i]?.size,
          });
        } else if (url.substring(0, lastDotIndex).split("//")?.length > 2) {
          const newSplit = url.substring(0, lastDotIndex).split("//");
          const slug = newSplit[newSplit.length - 1];
          wallpapers.push({
            user: userId,
            wallpaper: files[i]?.path,
            slug: slug,
            dimensions: imageMetadata,
            size: files[i]?.size,
          });
        } else {
          const newSplit = url.substring(0, lastDotIndex).split("/");
          const slug = newSplit[newSplit.length - 1];
          wallpapers.push({
            user: userId,
            wallpaper: files[i]?.path,
            slug: slug,
            dimensions: imageMetadata,
            size: files[i]?.size,
          });
        }
      }
    }
  }
  return wallpapers;
};

module.exports = {
  wallpapersMake,
};
