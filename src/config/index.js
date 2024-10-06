const path = require("path");
require("dotenv").config({ path: path.join(process.cwd(), ".env") });

const VARIABLES = {
  // Server
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SERVER_URL: process.env.SERVER_URL,

  // Database
  DATABASE_URL: process.env.DATABASE_URL,

  // Secret
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,

  // Client
  CLIENT_URL: process.env.CLIENT_URL,
  LOCAL_URL: process.env.LOCAL_URL,

  // Mail User
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,

  SENDRID_MAIL: process.env.SENDGRID_MAIL,
  CONTACT_MAIL: process.env.CONTACT_MAIL,
  SENDGRID_KEY: process.env.SENDGRID_KEY,
};

module.exports = VARIABLES;
