require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const VARIABLES = require("./config");
const PORT = VARIABLES.PORT || 8000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongodb connection success!");
  } catch (err) {
    console.log("mongodb connection failed", err.message);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Server is Running PORT: ${PORT}`);
});
