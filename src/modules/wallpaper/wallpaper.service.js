const wallpapersMake = async (files, userId) => {
  const wallpapers = [];
  for (let i = 0; i < files.length; i++) {
    const url = files[i]?.path;
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
          });
        } else if (url.substring(0, lastDotIndex).split("//")?.length > 2) {
          const newSplit = url.substring(0, lastDotIndex).split("//");
          const slug = newSplit[newSplit.length - 1];
          wallpapers.push({
            user: userId,
            wallpaper: files[i]?.path,
            slug: slug,
          });
        } else {
          const newSplit = url.substring(0, lastDotIndex).split("/");
          const slug = newSplit[newSplit.length - 1];
          wallpapers.push({
            user: userId,
            wallpaper: files[i]?.path,
            slug: slug,
          });
        }
      }
    }
  }
  return wallpapers;
};

// const wallpapersMake = async (files, userId) => {
//   const wallpapers = [];
//   for (let i = 0; i < files.length; i++) {
//     const url = files[i]?.path;
//     if (url) {
//       let lastDotIndex = url.lastIndexOf(".");
//       if (lastDotIndex !== -1) {
//         let urlWithoutExtension = url.substring(0, lastDotIndex).split("\\");
//         const slug = urlWithoutExtension[urlWithoutExtension.length - 1];
//         wallpapers.push({
//           user: userId,
//           wallpaper: files[i]?.path,
//           slug: slug,
//         });
//       }
//     }
//   }
//   return wallpapers;
// };

module.exports = {
  wallpapersMake,
};
