const VARIABLES = require("../config");
const nodemailer = require("nodemailer");

const sendVerifyEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: VARIABLES.MAIL_USER,
      pass: VARIABLES.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: VARIABLES.MAIL_USER,
    to: user?.email,
    subject: "Verify Your Email Address",
    html: `
      <div
      style="max-width: 600px; width: 100%; margin: 0 auto; font-family: 'Cabin',sans-serif; text-align:center; background-color: #ffff;">
      <div style="width: 100%; background-color: #037d41; align-items: center; padding:30px 0px">
          <p style=" color:#ffff; font-weight: 700;">T H A N K S <span style="margin-left: 10px;">F O R</span> <span
                  style="margin-left: 10px;">REGISTERING
                  !</span></p>
          <p style=" color:#ffff; margin: 0px;     line-height: 39.2px;
      font-size: 28px;">Verify Your E-mail Address</p>
      </div>
  
      <div style="text-align: center; padding:10px">
          <p style="font-size: 22px;
      line-height: 35.2px;">Hi,</p>
          <small style="color: #636465;">Please click then verify button to complete the registration process</small>
      </div>
      <a href="${VARIABLES.CLIENT_URL}/verify/${token}" target="_blank" style="width: fit-content;cursor:pointer"  >
      <button
          style="
  text-align:center; width: fit-content;min-width: 100px; display: block; cursor:pointer;
  padding: 14px 44px 13px;
  line-height: 120%; margin: 30px auto; background-color: #037d41 ; color:#ffff; border:none;border-radius: 5px;">Verify</button>
      </a>
  
  
  <div
  style="background-color: #d9eee4; padding:10px; font-size:14px;color:#003399;line-height:160%;text-align:center;word-wrap:break-word">
  <p style="font-size:14px;line-height:160%"><span style="font-size:20px;line-height:32px"><strong>Get in
              touch</strong></span></p>
  <p style="font-size:14px;line-height:160%"><span style="font-size:16px;line-height:25.6px;color:#000000"><a
              href="mailto:support@wps.com"
              target="_blank">support@wps.com</a></span>
  </p>
  </div>
  <div style="color:#ffff; background-color: #037d41; padding: 1px;">
  <p style="font-size:14px;line-height:180% ; color:#ffff">Copyrights © WPS
      All
      Rights Reserved</p>
  </div>
  </div>
      `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      return true;
    }
  });
};

module.exports = {
  sendVerifyEmail,
};
