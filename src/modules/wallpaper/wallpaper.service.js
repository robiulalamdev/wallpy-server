const path = require("path");
const sharp = require("sharp");
const Wallpaper = require("./wallpaper.model");
const shortid = require("shortid");
const Sponsor = require("../sponsor/sponsor.model");

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
        name: files[i]?.name,
        dimensions: imageMetadata,
        size: files[i]?.size,
      });
    }
  }
  return wallpapers;
};

const singleWallpaperMake = async (file, userId) => {
  const url = file?.path;
  const imageMetadata = await getImageMetadata(url);
  if (url) {
    const slug = await generateShorten();
    const data = {
      user: userId,
      wallpaper: file?.path,
      slug: slug,
      name: file?.name,
      dimensions: imageMetadata,
      size: file?.size,
    };
    return data;
  } else {
    return null;
  }
};

const getSingleSponsorWallpaper = async (page) => {
  try {
    let sponsor = null;

    if (page === 1) {
      const sponsorItems = await Sponsor.aggregate([
        {
          $match: {
            type: "Trending",
            targetType: "Wallpaper",
          },
        },
        { $sample: { size: 1 } },
      ]);

      if (sponsorItems?.length > 0) {
        let populatedItem = await Wallpaper.findById({
          _id: sponsorItems[0]?.targetId,
        });

        if (populatedItem) {
          sponsor = populatedItem;
        }
      }
    }

    return sponsor;
  } catch (error) {
    return null;
  }
};

module.exports = {
  wallpapersMake,
  singleWallpaperMake,
  getSingleSponsorWallpaper,
};
