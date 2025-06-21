import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    category: {
      type: String,
      required: true,
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
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      }
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    maxLimit: {
      type: Number,
      required: true,
      default: 1,
    },
    startTime: {
      type: Date,
      requied: true,
    },
    endTime: {
      type: Date,
      requied: true,
    },
  },
  { timestamps: true }
);

const Event = model("Event", eventSchema);

export default Event;
