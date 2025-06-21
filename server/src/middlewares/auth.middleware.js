import jwt from "jsonwebtoken";
import userSchema from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { _env } from "../constant.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized request !!! ",
      });
    }

    const decodedToken = jwt.verify(token, _env.ACCESS_TOKEN_SECRET);

    const user = await userSchema
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid access Token ",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong while verifying JWT",
    });
  }
});

export { verifyJWT };
