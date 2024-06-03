const express = require("express");
const cors = require("cors");
const VARIABLES = require("./config");
const { routers } = require("./routes");
const app = express();
const path = require("path");
const { getResizeImage } = require("./modules/helper/helper.controller");

// middleware
// app.use(
//   cors({
//     origin: [VARIABLES.CLIENT_URL, VARIABLES.LOCAL_URL],
//     credentials: true,
//   })
// );
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({ limit: "500mb", extended: true, parameterLimit: 500000 })
);

app.use("/api/v1", routers);
// static file serving
app.use("/api/v1/uploads", express.static(path.join(__dirname, "../")));

// resize image when loading image
app.get("/api/v1/assets", getResizeImage);

module.exports = app;
