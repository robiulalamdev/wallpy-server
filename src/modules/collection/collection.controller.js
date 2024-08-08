const { getUserById } = require("../user/user.service");
const Collection = require("./collection.model");

const createCollection = async (req, res) => {
  try {
    const newCollection = new Collection({
      user: req.user?._id,
      name: req.body.name,
    });
    const result = await newCollection.save();
    res.status(200).json({
      status: 200,
      success: true,
      message: "collection Create Success!",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error_message: error.message,
    });
  }
};

const getMyCollections = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.user._id);
    if (isExistUser) {
      const result = await Collection.find({
        user: isExistUser?._id?.toString(),
      })
        .populate("wallpapers")
        .sort({ _id: -1 });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Collections Retrieve Success",
        data: result,
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error_message: error.message,
    });
  }
};

const getCollectionsList = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.params.userId);
    if (isExistUser) {
      let result = await Collection.find({
        user: isExistUser?._id?.toString(),
        status: true,
      })
        .sort({ _id: -1 })
        .select("name wallpapers");

      let isExist = false;
      for (let i = 0; i < result.length; i++) {
        const isIndex = await result[i]?.wallpapers?.findIndex(
          (nItem) => nItem?.toString() === req.params?.wallpaperId
        );
        if (isIndex !== -1) {
          result[i] = { ...result[i].toObject(), added: true };
          isExist = true;
        }
      }
      res.status(200).json({
        status: 200,
        success: true,
        message: "Collections Retrieve Success",
        data: { isExist: isExist, data: result },
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error_message: error.message,
    });
  }
};

const getMyProfileCollections = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 18;
    const skip = (page - 1) * limit;

    const isExistUser = await getUserById(req.params.userId);
    if (isExistUser) {
      const result = await Collection.find({
        user: isExistUser?._id?.toString(),
        status: true,
        $expr: { $gt: [{ $size: "$wallpapers" }, 0] },
      })
        .populate({ path: "wallpapers" })
        // .populate({ path: "wallpapers", options: { limit: 4 } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Collection.countDocuments({
        user: isExistUser?._id?.toString(),
        status: true,
        $expr: { $gt: [{ $size: "$wallpapers" }, 0] },
      });

      res.status(200).json({
        status: 200,
        success: true,
        message: "Collections Retrieve Success",
        data: result,
        meta: {
          total: total,
          page: page,
          limit: limit,
        },
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error_message: error.message,
    });
  }
};

const removeMyCollections = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.user._id);
    if (isExistUser) {
      const result = await Collection.deleteMany({
        _id: { $in: req.body.ids },
        user: req.user._id,
      });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Collections Removed Success",
        data: result,
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error_message: error.message,
    });
  }
};

const updateMyCollections = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.user._id);
    if (isExistUser) {
      const result = await Collection.updateMany(
        {
          _id: { $in: req.body.ids },
          user: req.user._id,
        },
        { $set: req.body?.updateData }
      );
      res.status(200).json({
        status: 200,
        success: true,
        message: "Collections Update Success",
        data: result,
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error_message: error.message,
    });
  }
};

const addRemoveCollectionItem = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.user._id);
    if (isExistUser) {
      const existingDocument = await Collection.findOne({
        _id: req.params?.collectionId,
        wallpapers: req.body.wallpaperId,
      });
      if (existingDocument) {
        const result = await Collection.findByIdAndUpdate(
          { _id: req.params?.collectionId },
          {
            $pull: { wallpapers: req.body.wallpaperId },
          },
          { new: false }
        );
        res.status(200).json({
          status: 200,
          success: true,
          message: "Collections Update Success",
          data: result,
        });
      } else {
        const result = await Collection.findByIdAndUpdate(
          { _id: req.params?.collectionId },
          {
            $push: {
              wallpapers: {
                $each: [req.body.wallpaperId],
                $position: 0,
              },
            },
          },
          { new: false }
        );
        res.status(200).json({
          status: 200,
          success: true,
          message: "Collections Update Success",
          data: result,
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error_message: error.message,
    });
  }
};

module.exports = {
  createCollection,
  getMyCollections,
  getMyProfileCollections,
  removeMyCollections,
  updateMyCollections,
  getCollectionsList,
  addRemoveCollectionItem,
};
