const wallpapersMake = async (files, userId) => {
  const wallpapers = [];
  for (let i = 0; i < files.length; i++) {
    wallpapers.push({ user: userId, wallpaper: files[i]?.path });
  }
  return wallpapers;
};

module.exports = {
  wallpapersMake,
};
