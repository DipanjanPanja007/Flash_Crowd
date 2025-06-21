import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    friend: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    types: {
      type: Schema.Types.ObjectId,
      enum: ["play", "friend"],
    },
  },
  { timestamps: true }
);

notificationSchema.index({ receiver: 1 });

const Notification = model("Notification", notificationSchema);

export default Notification;
