const { default: axios } = require("axios");
const requestIp = require("request-ip");
const VARIABLES = require("../config");

const getLocation = async (ip) => {
  // Fetch location data from ip-api.com
  let clientIp = ip;

  // Use a sample IP for testing in development
  if (
    VARIABLES.NODE_ENV === "development" &&
    (clientIp === "::1" || clientIp === "127.0.0.1")
  ) {
    clientIp = "8.8.8.8";
  }
  try {
    const response = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const location = response.data;
    console.log(location);
    // if (location.status === "fail") {
    //   res.status(500).json({ error: "Unable to fetch location" });
    // } else {
    //   res.json(location);
    // }
  } catch (error) {
    console.error("Error fetching location:", error);
  }
};

module.exports = {
  getLocation,
};
