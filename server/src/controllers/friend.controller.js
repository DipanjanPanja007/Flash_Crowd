import friendSchema from "../models/friend.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const getMyFriends = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const friends = await friendSchema
    .find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    })
    .populate({
      path: "sender receiver",
      select: "fullName email avatar _id",
    });

  const friendList = friends.map((f) => {
    const isSender = f.sender._id.toString() === userId.toString();
    return isSender ? f.receiver : f.sender;
  });

  res.status(200).json({
    success: true,
    count: friendList.length,
    friends: friendList,
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

const sendFriendRequest = AsyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID is required",
    });
  }

  if (senderId.toString() === receiverId.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cannot send a friend request to yourself",
    });
  }

  // Check if a request or friendship already exists
  const existing = await friendSchema.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: `Friend request already exists with status: ${existing.status}`,
    });
  }

  // Create new friend request
  const friendRequest = await friendSchema.create({
    sender: senderId,
    receiver: receiverId,
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "Friend request sent successfully",
    data: friendRequest,
  });
});

const deleteFriendRequest = AsyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.body;

  const deleted = await friendSchema.findOneAndDelete({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
    status: "pending",
  });

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "No pending friend request found to cancel",
    });
  }

  res.status(200).json({
    success: true,
    message: "Friend request canceled successfully",
  });
});

const acceptFriendRequest = AsyncHandler(async (req, res) => {
  const receiverId = req.user._id;
  const { senderId } = req.body;

  if (!senderId) {
    return res.status(400).json({
      success: false,
      message: "Sender ID is required",
    });
  }

  const request = await friendSchema.findOneAndUpdate(
    {
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    },
    { status: "accepted" },
    { new: true }
  );

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "No pending friend request found from this user",
    });
  }

  res.status(200).json({
    success: true,
    message: "Friend request accepted successfully",
    data: request,
  });
});

const removeFriend = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { friendId } = req.body;

  if (!friendId) {
    return res.status(400).json({
      success: false,
      message: "Friend ID is required",
    });
  }

  const removed = await friendSchema.findOneAndDelete({
    $or: [
      { sender: userId, receiver: friendId },
      { sender: friendId, receiver: userId },
    ],
    status: "accepted",
  });

  if (!removed) {
    return res.status(404).json({
      success: false,
      message: "No friendship found to remove",
    });
  }

  res.status(200).json({
    success: true,
    message: "Friend removed successfully",
  });
});

const friendStatus = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { friendId } = req.body;

  if (!friendId) {
    return res.status(400).json({
      success: false,
      message: "Friend ID is required",
    });
  }

  const friendship = await friendSchema.findOne({
    $or: [
      { sender: userId, receiver: friendId },
      { sender: friendId, receiver: userId },
    ],
  });

  if (!friendship) {
    return res.status(404).json({
      success: false,
      message: "No friendship found",
    });
  }

  res.status(200).json({
    success: true,
    status: friendship.status,
  });
});

export {
  getMyFriends,
  searchFriends,
  sendFriendRequest,
  deleteFriendRequest,
  acceptFriendRequest,
  removeFriend,
  friendStatus
};
