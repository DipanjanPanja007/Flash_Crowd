import AsyncHandler from "../utils/AsyncHandler.js";
import eventSchema from "../models/event.model.js";
import ParticipationSchema from "../models/participation.model.js";
import userSchema from "../models/user.model.js";
import friendSchema from "../models/friend.model.js";

const searchUsers = AsyncHandler(async (req, res) => {
  const query = req.query.search;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search query is required.",
    });
  }
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }
    : {};

  const users = await userSchema
    .find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password -refreshToken");

  return res.status(200).json({
    users,
    message: "users found successfully",
  });
});

const searchFriends = AsyncHandler(async (req, res) => {
  const { query } = req.query.search;

  if (!query || query.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search query is required.",
    });
  }

  const userId = req.user._id;

  const friendships = await friendSchema.find({
    status: "accepted",
    $or: [{ sender: userId }, { receiver: userId }],
  });

  const friendIds = friendships.map((f) =>
    f.sender.toString() === userId.toString() ? f.receiver : f.sender
  );

  const matchedFriends = await friendSchema
    .find({
      _id: { $in: friendIds },
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
    .select("-password -refreshToken");

  res.status(200).json({
    success: true,
    friends: matchedFriends,
  });
});

const updateUserInfo = AsyncHandler(async (req, res) => {
  const { fullName, bio, avatar, interests } = req.body;

  const updates = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (bio !== undefined) updates.bio = bio;
  if (avatar !== undefined) updates.avatar = avatar;
  if (interests !== undefined) updates.interests = interests;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid fields provided for update.",
    });
  }

  const updatedUser = await userSchema.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true, select: "-password -refreshToken" }
  );

  res.status(200).json({
    success: true,
    message: "User profile updated successfully.",
    user: updatedUser,
  });
});

const getUserInfo = AsyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
    });
  }
  const user = await userSchema.findById(userId).select("-password -refreshToken");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const eventCount = await eventSchema.find({ host: userId });
  const participationCount = await ParticipationSchema.findOne({
    user: userId,
  });

  return res
    .status(200)
    .json({ success: true, message: "User found successfully.", user, eventCount, participationCount });
});

export { searchUsers, searchFriends, updateUserInfo, getUserInfo };
