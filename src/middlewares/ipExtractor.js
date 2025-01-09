// middleware/ipExtractor.js

const ipExtractor = (req, res, next) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";

  req.ipAddress = ip; // Attach the extracted IP to req object

  next(); // Pass control to the next middleware or route handler
};

module.exports = {
  ipExtractor,
};
