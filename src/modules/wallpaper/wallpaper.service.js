const path = require("path");
const sharp = require("sharp");
const Wallpaper = require("./wallpaper.model");
const shortid = require("shortid");

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

const generateShorten = async () => {
  let slug = shortid.generate();
  const existing = await Wallpaper.findOne({ slug });
  if (existing) {
    let counter = 1;
    while (true) {
      const newSlug = `${slug}${counter}`;
      const slugExists = await Wallpaper.findOne({ slug: newSlug });
      if (!slugExists) {
        slug = newSlug;
        break;
      }
      counter++;
    }
  }
  return slug;
};

const wallpapersMake = async (files, userId) => {
  const wallpapers = [];
  for (let i = 0; i < files.length; i++) {
    const url = files[i]?.path;
    const imageMetadata = await getImageMetadata(url);
    if (url) {
      const slug = await generateShorten();
      wallpapers.push({
        user: userId,
        wallpaper: files[i]?.path,
        slug: slug,
        dimensions: imageMetadata,
        size: files[i]?.size,
      });
    }
  }
  return wallpapers;
};

module.exports = {
  wallpapersMake,
};
