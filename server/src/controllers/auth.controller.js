import { cookieOptions } from "../constant.js";
import userSchema from "../models/user.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await userSchema.findById(userId);

  // generate Access and Refresh Token,
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Update refresh Token into db
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // return Access and Refresh Token
  return { accessToken, refreshToken };
};

const handleLogin = AsyncHandler(async (req, res) => {
  const { name, email, picture } = req.body;

  if (!name || !email)
    return res.status(400).json({
      message: "Please provide all required fields",
    });

  let user = await userSchema.findOne({ email });

  if (!user)
    user = await userSchema.create({
      fullName: name,
      email,
      avatar: picture,
      isOAuthUser: true,
    });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  user = await userSchema
    .findById(user._id)
    .select("-password -refreshToken")
    .lean();

  res.setHeader("Authorization", `Bearer ${accessToken}`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      success: true,
      message: "Successfully logged in",
      user,
    });
});

const handleLogout = AsyncHandler(async (req, res) => {
  const { user } = req.user;

  await userSchema.findByIdAndUpdate(
    user._id,
    { refreshToken: null },
    { new: true }
  );

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({
      success: true,
      message: "Successfully logged out",
    });
});

export { handleLogin, handleLogout };
