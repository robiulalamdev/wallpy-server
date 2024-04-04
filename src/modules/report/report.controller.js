const Report = require("./report.model");

const sendReport = async (req, res) => {
  try {
    const newReport = new Report({
      sender: req.user?._id,
      receiver: req.body.receiver,
      message: req.body.message,
    });
    const result = await newReport.save();
    res.status(200).json({
      status: 200,
      success: true,
      message: "Wallpaper Retrieve Successfully",
      data: result,
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

module.exports = {
  sendReport,
};
