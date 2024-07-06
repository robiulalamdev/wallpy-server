const Analytics = require("./analytics.model");

const trackingVisitor = async (visitorIp) => {
  const currentDate = new Date();

  // Define the start and end of today
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1
  );

  try {
    await Analytics.updateOne(
      {
        createdAt: { $gte: startDate, $lt: endDate },
      },
      {
        $addToSet: { visitors: visitorIp },
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  trackingVisitor,
};
