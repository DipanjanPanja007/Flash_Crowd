import AsyncHandler from "../utils/AsyncHandler.js";
import notificationSchema from "../models/notification.model.js";
import friendSchema from "../models/friend.model.js";

const createFriendRequestNoti = AsyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({
      success: false,
      message: "Receiver ID is required",
    });
  }

  const notification = await notificationSchema.create({
    receiver: receiverId,
    seen: false,
    sender: senderId,
    types: "friend",
  });

  res.status(201).json({
    success: true,
    message: "Friend request notification created",
    data: notification,
  });
});

const createEventNoti = AsyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const senderId = req.user._id;

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "Event ID is required",
    });
  }

  // Get all accepted friendships where the user is either sender or receiver
  const friends = await friendSchema.find({
    status: "accepted",
    $or: [{ sender: senderId }, { receiver: senderId }],
  });

  if (!friends.length) {
    return res.status(200).json({
      success: true,
      message: "No friends found to notify",
    });
  }

  // Get all friend user IDs (excluding self)
  const friendIds = friends.map((f) =>
    f.sender.toString() === senderId.toString() ? f.receiver : f.sender
  );

  // Create notifications for each friend
  const notifications = await notificationSchema.insertMany(
    friendIds.map((friendId) => ({
      receiver: friendId,
      sender: senderId,
      event: eventId,
      seen: false,
      types: "play",
    }))
  );

  res.status(201).json({
    success: true,
    message: "Event notifications sent to friends",
  });
});

export { createFriendRequestNoti, createEventNoti };
