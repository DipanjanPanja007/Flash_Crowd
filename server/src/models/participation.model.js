import { Schema, model } from "mongoose";

const participationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    events: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Event",
          required: true,
        },
        rating: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

// participationSchema.index({ user: 1 });

const Participation = model("Participation", participationSchema);

export default Participation;
