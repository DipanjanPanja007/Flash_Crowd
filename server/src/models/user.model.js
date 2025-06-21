import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: function () {
        return !this.isOAuthUser;
      },
    },
    isOAuthUser: {
      type: Boolean,
      required: true,
      default: false,
    },
    bio: {
      type: String,
      default: "Hey there! I'm using FlashCrowd.",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/du4bs9xd2/image/upload/v1750344689/profile_image_srdpjg.png",
    },
    location: {
      type: {
        type: String, // Always 'Point'
        enum: ["Point"],
        // required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // required: true,
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [10, "Rating must be at most 10"],
    },
    friendCount: {
      type: Number,
      default: 0,
    },
    karma: {
      //similar to game score
      type: Number,
      default: 0,
    },
    interests:[
      {
        type: String,
        enum: [
          "Football",
          "Cricket",
          "Badminton",
          "Basketball",
          "Vollyball",
          "Photography",
          "Quiz",
          "Chess",
          "Dance",
          "Poetry",
          "Art",
          "Yoga",
          "Singing",
        ],
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

userSchema.methods.generateAccessToken = function () {
  // jwt.sign(payload, secret, expiry(optional))
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = model("User", userSchema);

export default User;
