const VARIABLES = require("../config");
const nodemailer = require("nodemailer");

const transport = {
  service: "Gmail",
  auth: {
    user: VARIABLES.MAIL_USER,
    pass: VARIABLES.MAIL_PASS,
  },
};

const sendVerifyEmail = async (user, token) => {
  const transporter = nodemailer.createTransport(transport);
  const mailOptions = {
    from: VARIABLES.MAIL_USER,
    to: user?.email,
    subject: "Verify Your Email Address",
    html: `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Bakbak+One&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet">
    <style>
        body {
            padding: 0px !important;
            margin: 0px !important;
            box-sizing: border-box;
            font-family: "Bakbak One", "Lato", "Roboto", sans-serif !important;
        }

        .firstSection {
            padding-top: 110px;
            padding-bottom: 59px;
        }

        .bakbakone {
            font-family: "Bakbak One", sans-serif !important;
        }

        .cursor-p {
            cursor: pointer !important;
        }

        .wpsTitle {
            max-width: 693px;
            width: 100%;
            height: 78px;
            border-radius: 10px;
            background: linear-gradient(0deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.70) 100%), lightgray;
            background-image: url('${VARIABLES.SERVER_URL}/uploads/src/assets/images/wpsbtnbg.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            color: #FFFFFF;
            font-size: 30px;
            border: none;
        }

        .titlelgsz25 {
            font-size: 25px;
        }

        .logo {
            width: 144px;
            height: 136px;
            margin: 0 auto;
            display: block;
            border-radius: 10px;
        }

        .tnkTitle {
            text-align: center;
            margin-top: 60px;
            font-family: Roboto;
            color: #111111;
            font-size: 30px;
            font-weight: 400;
        }

        .hiTitle {
            margin-top: 73px;
            font-size: 30px
        }

        .confirmEmail {
            background-color: #0038FF;
            max-width: 381px;
            width: 100%;
            height: 83px;
            border-radius: 10px;
            font-family: Roboto;
            color: white;
            font-weight: 400;
            border: none;
            display: block;
            cursor: pointer;
        }

        .socialBtn {
            margin: 0 8.5px;
            max-width: 28px;
            max-height: 28px;
        }

        @media (max-width: 350px) {
            .firstSection {
                padding-top: 50px;
                padding-bottom: 28px;
            }

            .inner-container {
                padding-top: 16px;
                padding-left: 23px;
                padding-right: 23px;
                padding-bottom: 14px;
            }

            .socialBtn {
                margin: 0 4.5px;
                max-width: 15px !important;
                max-height: 15px !important;
            }

            .wpsTitle {
                height: 48px;
                border-radius: 5px;
                color: #FFFFFF;
                font-size: 18px;
            }

            .titlelgsz25 {
                font-size: 15px;
            }

            .logo {
                width: 100px;
                height: 95px;
            }

            .tnkTitle {
                margin-top: 30px;
                font-size: 15px;
            }

            .hiTitle {
                margin-top: 33px;
                font-size: 18px
            }

            .confirmEmail {
                height: 55px;
                border-radius: 5px;
            }

        }

        @media (min-width: 351px)and (max-width: 600px) {
            .firstSection {
                padding-top: 75px;
                padding-bottom: 35px;
            }

            .inner-container {
                padding-top: 22px;
                padding-left: 35px;
                padding-right: 35px;
                padding-bottom: 21px;
            }


            .socialBtn {
                margin: 5px 8.5px;
                max-width: 18px !important;
                max-height: 18px !important;
            }


            .wpsTitle {
                height: 58px;
                border-radius: 7px;
                color: #FFFFFF;
                font-size: 20px;
            }

            .titlelgsz25 {
                font-size: 18px;
            }

            .logo {
                width: 120px;
                height: 116px;
            }

            .tnkTitle {
                margin-top: 45px;
                font-size: 24px;
            }

            .hiTitle {
                margin-top: 45px;
                font-size: 25px
            }

            .confirmEmail {
                height: 65px;
                border-radius: 7px;
            }
        }

        @media (min-width: 601px) {
            .inner-container {
                padding-top: 45px;
                padding-left: 75px;
                padding-right: 75px;
                padding-bottom: 46px;
            }

            .socialBtn {
                margin: 0 16.5px
            }

        }
    </style>
</head>

<body style="background-color: #EBEBEB;">
    <div style="padding: 0 16px;">
        <div class="firstSection" style="max-width: 844px; width: 100%; margin: 0 auto; ">
            <img class="logo" src="${VARIABLES.SERVER_URL}/uploads/src/assets/images/coverLogo.png" alt="">

            <h1 class="hiTitle" style="text-align: center; font-family: Roboto; color: #111111; font-weight: 400;">
                Hi
                <span style="font-weight: 700;">[${user?.username}]</span>
            </h1>
            <p class="tnkTitle">
                Thank you for registering at The Wallpaper
                Society</p>
            <div
                style="background-color: #FFFFFF; width: 100%; min-height: fit-content; margin-top: 60px; border-radius: 10px;">
                <div class="inner-container">
                    <button class="bakbakone wpsTitle">
                        THE WALLPAPER SOCIETY
                    </button>
                    <p class="titlelgsz25"
                        style="margin-top: 38px; color: #000000; font-family: Roboto; color: #111111; font-weight: 400;">
                        To complete your registration, please confirm your email address by
                        clicking the button below:</p>

                    <div style="width: 100%; border-top: 1px solid #CACACA; margin-top: 43.5px;"></div>

                    <div style="max-width: 616px; width: 100%; margin: 43.5px auto 0 auto;">
                        <p class="titlelgsz25" style="font-family: Roboto; color: #111111;  font-weight: 400;">
                            By confirming your email, you'll be able to:</p>

                        <ul class="titlelgsz25"
                            style="font-family: Roboto; color: #111111; font-weight: 400; margin-left: 10px;">
                            <li>Access your WPS account</li>
                            <li>Customize your profile</li>
                            <li>Enjoy all the features and benefits we offer</li>
                        </ul>
                        <br>
                        <p class="titlelgsz25" style="color: #AAAAAA; font-family: Roboto; font-weight: 400;">
                            If you didn't create an account with us, please ignore this email. Link expires after 48
                            hours.
                        </p>
                        <p class="titlelgsz25"
                            style="color: #AAAAAA; font-family: Roboto; font-weight: 400; text-decoration: none;">
                            If you have any questions or need assistance, feel free to contact our support team at
                            support@thewps.co
                        </p>
                        <p class="titlelgsz25"
                            style="color: #000000; font-family: Roboto; color: #111111; font-weight: 400;">
                            Welcome To The Society</p>
                        <p class="titlelgsz25"
                            style="color: #000000; font-family: Roboto; color: #111111; font-weight: 400;">
                            The WPS Team</p>

                        <a href="${VARIABLES.CLIENT_URL}/verify/${token}" target="_blank" class="cursor-p"
                            style="padding: 0px; margin: 0; width: fit-content; height: fit-content;max-width: 381px; width: 100%; display: block; text-decoration: none; margin: 44px auto 0px auto; "><button
                                class="titlelgsz25 confirmEmail">CONFIRM
                                EMAIL</button></a>
                    </div>
                </div>

            </div>

            <div
                style="background-color: #FFFFFF; width: 100%; max-height: fit-content; margin-top: 49px; border-radius: 10px;">
                <div style="padding: 0px 10px 73px 10px;">
                    <h1
                        style="padding-top: 55px; text-align: center; font-family: Roboto; color: #111111; font-size: 30px; font-weight: 700;">
                        Share the WPS with your friends</h1>
                    <p
                        style="padding-top: 26px; text-align: center; font-family: Roboto; color: #AAAAAA; font-size: 20px; font-weight: 400;">
                        Sharing our site allows us to continue</p>

                    <div style="margin-top: 27px; text-align: center;">
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/twitter.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/facebook.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/whatsup.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/discord.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/email.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                    </div>
                </div>


            </div>
            <h1 class="titlelgsz25"
                style="padding-top: 53px; text-align: center; font-family: Roboto; color: #000000; font-weight: 700;">
                Follow Us</h1>

            <div style="margin-top: 30px; text-align: center;">
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/instagram.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/tiktok.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/discord.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/twitter.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/reddit.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
            </div>


            <div style="margin-top: 30px; text-align: center;">
                <a href="https://Thewallpapersociety.com" target="_blank"
                    style="padding-top: 30px; text-align: center; font-family: Roboto, sans-serif; color: #AAAAAA; font-size: 20px; font-weight: 700; text-decoration: none; display: inline-block;">
                    TheWallpaperSociety.com</a>
            </div>

        </div>
    </div>
</body>

</html>
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

const sendForgotPasswordMail = async (user, token) => {
  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: user?.email,
    subject: "Forgot Password - Reset Your Password",
    html: `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Bakbak+One&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet">
    <style>
        body {
            padding: 0px !important;
            margin: 0px !important;
            box-sizing: border-box;
            font-family: "Bakbak One", "Lato", "Roboto", sans-serif !important;
        }

        .firstSection {
            padding-top: 110px;
            padding-bottom: 59px;
        }

        .threeLine {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            text-align: left !important;
        }

        .bakbakone {
            font-family: "Bakbak One", sans-serif !important;
        }

        .cursor-p {
            cursor: pointer !important;
        }

        .wpsTitle {
            max-width: 693px;
            width: 100%;
            height: 78px;
            border-radius: 10px;
            background: linear-gradient(0deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.70) 100%), lightgray;
            background-image: url('${VARIABLES.SERVER_URL}/uploads/src/assets/images/wpsbtnbg.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            color: #FFFFFF;
            font-size: 30px;
            border: none;
        }

        .titlelgsz25 {
            font-size: 25px;
        }

        .logo {
            width: 144px;
            height: 136px;
            margin: 0 auto;
            display: block;
            border-radius: 10px;
        }

        .tnkTitle {
            text-align: center;
            margin-top: 60px;
            font-family: Roboto;
            color: #111111;
            font-size: 30px;
            font-weight: 400;
        }

        .hiTitle {
            margin-top: 73px;
            font-size: 30px
        }

        .confirmEmail {
            background-color: #0038FF;
            max-width: 381px;
            width: 100%;
            height: 83px;
            border-radius: 10px;
            font-family: Roboto;
            color: white;
            font-weight: 400;
            border: none;
            display: block;
            cursor: pointer;
            text-transform: uppercase;
        }

        .socialBtn {
            margin: 0 8.5px;
            max-width: 28px;
            max-height: 28px;
        }

         .link {
            font-size: 20px !important;
        }

        .link:hover {
            color: #0038FF !important;
        }

        @media (max-width: 350px) {
            .firstSection {
                padding-top: 50px;
                padding-bottom: 28px;
            }

            .inner-container {
                padding-top: 16px;
                padding-left: 23px;
                padding-right: 23px;
                padding-bottom: 14px;
            }

            .socialBtn {
                margin: 0 4.5px;
                max-width: 15px !important;
                max-height: 15px !important;
            }

            .wpsTitle {
                height: 48px;
                border-radius: 5px;
                color: #FFFFFF;
                font-size: 18px;
            }

            .titlelgsz25 {
                font-size: 15px;
            }

            .logo {
                width: 100px;
                height: 95px;
            }

            .tnkTitle {
                margin-top: 30px;
                font-size: 15px;
            }

            .hiTitle {
                margin-top: 33px;
                font-size: 18px
            }

            .confirmEmail {
                height: 55px;
                border-radius: 5px;
            }

            .link {
                font-size: 15px !important;
            }

        }

        @media (min-width: 351px)and (max-width: 600px) {
            .firstSection {
                padding-top: 75px;
                padding-bottom: 35px;
            }

            .inner-container {
                padding-top: 22px;
                padding-left: 35px;
                padding-right: 35px;
                padding-bottom: 21px;
            }


            .socialBtn {
                margin: 5px 8.5px;
                max-width: 18px !important;
                max-height: 18px !important;
            }


            .wpsTitle {
                height: 58px;
                border-radius: 7px;
                color: #FFFFFF;
                font-size: 20px;
            }

            .titlelgsz25 {
                font-size: 18px;
            }

            .logo {
                width: 120px;
                height: 116px;
            }

            .tnkTitle {
                margin-top: 45px;
                font-size: 24px;
            }

            .hiTitle {
                margin-top: 45px;
                font-size: 25px
            }

            .confirmEmail {
                height: 65px;
                border-radius: 7px;
            }

            .link {
                font-size: 17px !important;
            }
        }

        @media (min-width: 601px) {
            .inner-container {
                padding-top: 45px;
                padding-left: 75px;
                padding-right: 75px;
                padding-bottom: 46px;
            }

            .socialBtn {
                margin: 0 16.5px
            }
        }
    </style>
</head>

<body style="background-color: #EBEBEB;">
    <div style="padding: 0 16px;">
        <div class="firstSection" style="max-width: 844px; width: 100%; margin: 0 auto; ">
            <img class="logo" src="${VARIABLES.SERVER_URL}/uploads/src/assets/images/coverLogo.png" alt="">

            <h1 class="hiTitle" style="text-align: center; font-family: Roboto; color: #111111; font-weight: 400;">
                Hi
                <span style="font-weight: 700;">[${user?.username}]</span>
            </h1>
            <p class="tnkTitle">
                You have initiated a password reset request.</p>
            <div
                style="background-color: #FFFFFF; width: 100%; min-height: fit-content; margin-top: 60px; border-radius: 10px;">
                <div class="inner-container">
                    <button class="bakbakone wpsTitle">
                        THE WALLPAPER SOCIETY
                    </button>
                    <p class="titlelgsz25"
                        style="margin-top: 38px; color: #000000; font-family: Roboto; color: #111111; font-weight: 400;">
                        It looks like you requested a password reset. No worries, we’ve got you covered.</p>

                    <div style="width: 100%; border-top: 1px solid #CACACA; margin-top: 43.5px;"></div>

                    <div style="max-width: 616px; width: 100%; margin: 43.5px auto 0 auto;">
                        <p class="titlelgsz25" style="font-family: Roboto; color: #111111;  font-weight: 400;">
                            To reset your password, please click the button below</p>
                        <p class="titlelgsz25" style="font-family: Roboto; color: #111111;  font-weight: 400;">
                            If the button doesn't work, you can also copy and paste the following link into your
                            browser:</p>
                        <a href="${VARIABLES.CLIENT_URL}/change-password/${token}" target="_blank" class="cursor-p link titlelgsz25"
                            style="font-family: Roboto; color: #AAAAAA;  font-weight: 400; text-decoration: none;">
                            [LINK]</a>

                        <p class="titlelgsz25"
                            style="color: #000000; font-family: Roboto; color: #111111; font-weight: 400; text-decoration: none;">
                            For security reasons, this link will expire in 24 hours. If you did not request a password
                            reset, please ignore this email or contact our support team at support@thewps.co
                        </p>
                        <p class="titlelgsz25"
                            style="color: #000000; font-family: Roboto; color: #111111; font-weight: 400;">
                            Stay secure, The WPS Team</p>


                        <a href="${VARIABLES.CLIENT_URL}/change-password/${token}" target="_blank" class="cursor-p"
                            style="padding: 0px; margin: 0; width: fit-content; height: fit-content;max-width: 381px; width: 100%; display: block; text-decoration: none; margin: 44px auto 0px auto; "><button
                                class="titlelgsz25 confirmEmail">Reset password</button></a>
                    </div>
                </div>

            </div>

            <div
                style="background-color: #FFFFFF; width: 100%; max-height: fit-content; margin-top: 49px; border-radius: 10px;">
                <div style="padding: 0px 10px 73px 10px;">
                    <h1
                        style="padding-top: 55px; text-align: center; font-family: Roboto; color: #111111; font-size: 30px; font-weight: 700;">
                        Share the WPS with your friends</h1>
                    <p
                        style="padding-top: 26px; text-align: center; font-family: Roboto; color: #AAAAAA; font-size: 20px; font-weight: 400;">
                        Sharing our site allows us to continue</p>

                    <div style="margin-top: 27px; text-align: center;">
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/twitter.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/facebook.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/whatsup.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/discord.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                        <a href="" target="_blank" class="socialBtn"
                            style="display: inline-block; border-radius: 5px; background: rgba(0, 0, 0, 0.80); vertical-align: middle;padding: 10px;">
                            <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/email.png"
                                style="width: 100%; height: 100%;" alt="">
                        </a>
                    </div>
                </div>


            </div>
            <h1 class="titlelgsz25"
                style="padding-top: 53px; text-align: center; font-family: Roboto; color: #000000; font-weight: 700;">
                Follow Us</h1>

            <div style="margin-top: 30px; text-align: center;">
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/instagram.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/tiktok.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/discord.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/twitter.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
                <a href="" target="_blank"
                    style="display: inline-block; width: 30px; height: 30px; vertical-align: middle; margin: 0 25px 25px 0;">
                    <img src="${VARIABLES.SERVER_URL}/uploads/src/assets/icons/fu/reddit.png"
                        style="width: 30px; height: 30px;" alt="">
                </a>
            </div>


            <div style="margin-top: 30px; text-align: center;">
                <a href="https://Thewallpapersociety.com" target="_blank"
                    style="padding-top: 30px; text-align: center; font-family: Roboto, sans-serif; color: #AAAAAA; font-size: 20px; font-weight: 700; text-decoration: none; display: inline-block;">
                    TheWallpaperSociety.com</a>
            </div>

        </div>
    </div>
</body>

</html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(error, info);
    if (error) {
      console.log(error);
    } else {
      return true;
    }
  });
};

const sendContactMessage = async (data) => {
  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: `New Contact Us Form Submission`,
    html: `
        <body style="background-color: #f4f4f4; margin: 0; padding: 0;">
        <div
            style="max-width: 600px; width: 100%; margin: 0 auto; font-family: 'Cabin',sans-serif; text-align:center; background-color: #ffff;">
            <div style="width: 100%; background-color: #037d41; align-items: center; padding:30px 0px">
                <small style=" color:#ffff;">Your Verified Seller Status on WPS </small>
                <p style=" color:#ffff; margin: 0px;     line-height: 39.2px;
        font-size: 28px;">Welcome to WPS</p>
            </div>

            <div style="padding: 20px; margin-top: 20px; text-align: left; line-break: auto;">
                <p style="color: #636465;font-size:14px;line-height:180% ; "><strong>Name:</strong> ${data?.name}</p>
                <p style="color: #636465;font-size:14px;line-height:180% ; "><strong>Email:</strong> ${data?.email}</p>
                <p style="color: #636465;font-size:14px;line-height:180% ; "><strong>Subject:</strong> ${data?.subject}</p>

                <p style="color: #636465;font-size:14px;line-height:180% ; ">Message</p>
                <div style="margin-left: 15px; margin-top: 0;">
                    <p style="color: #636465;font-size:14px;line-height:180% ; ">
                        ${data?.message}
                    </p>
                </div>

            </div>

            <div
                style="background-color: #d9eee4; padding:10px; font-size:14px;color:#003399;line-height:160%;text-align:center;word-wrap:break-word">
                <p style="font-size:14px;line-height:160%"><span style="font-size:20px;line-height:32px"><strong>Get in
                            touch</strong></span></p>
                <p style="font-size:14px;line-height:160%"><span style="font-size:16px;line-height:25.6px;color:#000000"><a
                            href="mailto:support@WPS.com"
                            target="_blank">support@WPS.com</a></span>
                </p>
            </div>
            <div style="color:#ffff; background-color: #037d41; padding: 1px;">
                <p style="font-size:14px;line-height:180% ; color:#ffff">Copyrights © WPS AB
                    All
                    Rights Reserved</p>
            </div>
        </div>
    </body>
      `,
  };

  let status = true;
  transporter.sendMail(mailOptions, (error, info) => {
    if (info) {
      status = true;
    }
    if (error) {
      status = false;
    }
  });
  return status;
};

module.exports = {
  sendVerifyEmail,
  sendForgotPasswordMail,
  sendContactMessage,
};
