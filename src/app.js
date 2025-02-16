const express = require("express");
const cors = require("cors");
const VARIABLES = require("./config");
const { routers } = require("./routes");
const app = express();
const path = require("path");
const http = require("http");
const { getResizeImage } = require("./modules/helper/helper.controller");
const requestIp = require("request-ip");
const { initializeSocket } = require("./config/socket/socketServer");
const cron = require("node-cron");
const {
  generateTrendingWallpapers,
} = require("./modules/trending/trending.service");

// middleware
// app.use(
//   cors({
//     origin: [VARIABLES.CLIENT_URL, VARIABLES.LOCAL_URL],
//     credentials: true,
//   })
// );
app.use(requestIp.mw());
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({ limit: "500mb", extended: true, parameterLimit: 500000 })
);

const Server = http.createServer(app);
// Initialize Socket.IO
initializeSocket(Server);

app.use("/api/v1", routers);
// static file serving
app.use("/api/v1/uploads", express.static(path.join(__dirname, "../")));

// resize image when loading image
app.get("/api/v1/assets", getResizeImage);

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/dist", "index.html"));
// });

// Schedule the task to run every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  setTimeout(async () => {
    console.log("Running daily trending wallpapers update at 00:01...");
    await generateTrendingWallpapers();
  }, 60 * 1000); // 1-minute delay
});

// Run every **1 minute** for testing
// cron.schedule("*/1 * * * *", async () => {
// });

module.exports = { app, Server };
