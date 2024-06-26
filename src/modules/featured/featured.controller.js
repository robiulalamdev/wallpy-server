const Featured = require("./featured.model");

const addFeatured = async (req, res) => {
  try {
    await Featured.deleteMany({ type: "Contact" });
    const result = await Featured.insertMany(req.body?.items);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Featured Created Successfully",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: true,
      message: "Featured add unSuccessfully",
    });
  }
};

const getContactFeatured = async (req, res) => {
  try {
    const result = await Featured.find({
      type: "Contact",
      targetType: "Wallpaper",
    })
      .limit(6)
      .sort({ _id: -1 })
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug",
            });
            return {
              ...currentItem.toObject(),
              wallpaper: currentItem?.targetId?.wallpaper,
              slug: currentItem?.targetId?.slug,
              targetId: currentItem?.targetId?._id,
            };
          })
        );
        return populatedFeatured;
      });

    res.status(201).json({
      success: true,
      message: "Featured Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured Retrieve Failed",
      error_message: error.message,
    });
  }
};

module.exports = {
  addFeatured,
  getContactFeatured,
};
