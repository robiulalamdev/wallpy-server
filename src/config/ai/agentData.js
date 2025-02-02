const { USER_STATUS, ROLE_DATA } = require("../../modules/user/user.constants");
const {
  WALLPAPER_ENUMS,
} = require("../../modules/wallpaper/wallpaper.constant");

const modelsForAiAgent = `
    => User model: 

    {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    role: {
      type: String,
      enum: [${ROLE_DATA.USER}, ${ROLE_DATA.ADMIN}, ${ROLE_DATA.MOD}, ${ROLE_DATA.BRAND}],
      default: "User",
      required: true,
    },
    verification_status: {
      // this verification status for brand and artist
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    status: {
      type: String,
      enum: [${USER_STATUS.ACTIVE}, ${USER_STATUS.SUSPENDED}, ${USER_STATUS.BANNED}],
      default: ${USER_STATUS.ACTIVE},
      required: true,
    },
    reason: {
      type: Object,
      message: {
        type: String,
        required: false,
      },
      time: {
        type: String,
        required: false,
      },
      required: false,
    },
    verified: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: true,
    },
    provider: {
      type: String,
      enum: ["Manual", "Google", "Facebook", "Apple"],
      default: "Manual",
      required: true,
    },
    reset_password: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    reset_email: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    warnings: {
      type: String,
      required: false,
    },
    totalReports: {
      type: Number,
      default: 0,
      required: false,
    },
    lastActive: {
      type: Date,
      required: false,
    },


    => Profile Model: 

    {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profile_image: {
      type: String,
      default: "src/assets/images/profile/profile.png",
      required: false,
    },
    banner: {
      type: String,
      default: "src/assets/images/profile/banner.png",
      required: false,
    },
    official_banner: {
      type: String,
      default: "src/assets/images/profile/banner.png",
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    links: {
      type: [String],
      required: false,
    },
    proof_of_identity: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    countryCode: {
      type: String,
      required: false,
    },
    flag: {
      type: String,
      required: false,
    },
    ip: {
      type: String,
      default: "0.0.0.0",
      required: false,
    },
    zip: {
      type: Number,
      required: false,
    },
    socials: {
      type: socialSchema,
      default: {
        twitter: "",
        behance: "",
        dribbble: "",
        instagram: "",
        discord: "",
        threads: "",
        reddit: "",
        twitch: "",
      },
      required: false,
    },
  },


    => Wallpaper Model: 

    {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ${WALLPAPER_ENUMS.STATUS},
      default: ${WALLPAPER_ENUMS.STATUS[0]},
      required: true,
    },
    wallpaper: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
      type: String,
      enum: ${WALLPAPER_ENUMS.TYPES},
      required: false,
    },
    isFeatured: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    classification: {
      type: String,
      enum: ${WALLPAPER_ENUMS.CLASSIFICATION},
      required: false,
    },
    screen_type: {
      type: String,
      enum: ${WALLPAPER_ENUMS.SCREEN_TYPE},
      required: false,
    },
    dimensions: {
      type: Object,
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    view: {
      type: Number,
      default: 0,
      required: true,
    },
    totalReports: {
      type: Number,
      default: 0,
      required: false,
    },
    downloads: {
      type: [Date],
      required: false,
    },
    tags: {
      type: [String],
      index: true,
      required: false,
    },
    source: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
    }
  }
    
`;

module.exports = {
  agent_data: {
    modelsForAiAgent,
  },
};
