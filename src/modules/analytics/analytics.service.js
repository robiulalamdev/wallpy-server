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
    if (visitorIp) {
      const analyticsDoc = await Analytics.findOne({
        createdAt: { $gte: startDate, $lt: endDate },
        visitors: visitorIp,
      });

      if (!analyticsDoc) {
        await Analytics.updateOne(
          {
            createdAt: { $gte: startDate, $lt: endDate },
          },
          {
            $push: { visitors: visitorIp },
          },
          { upsert: true }
        );
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  trackingVisitor,
};
