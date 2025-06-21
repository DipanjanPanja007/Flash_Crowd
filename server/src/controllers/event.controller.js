import eventSchema from "../models/event.model.js";
import ParticipationSchema from "../models/participation.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";


function convertTimeToDate(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0); // h, m, s, ms
  return date;
}

const createEvent = AsyncHandler(async (req, res) => {
  let {
    title,
    description,
    category,
    location,
    maxLimit,
    startTime,
    endTime,
  } = req.body;

  console.log(req.body);

  // Validate required fields
  if (
    [title, description, category, location, endTime].some(
      (field) => field === undefined || field === null || field === ""
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required...",
    });
  }

  startTime = convertTimeToDate(startTime);
  endTime = convertTimeToDate(endTime);

  const event = await eventSchema.create({
    title,
    description,
    category,
    location,
    host: req.user._id,
    maxLimit: maxLimit || 1,
    startTime,
    endTime,
    participants: [req.user._id],
  });

  await ParticipationSchema.create({
    user: req.user._id,
    events: [{ id: event._id }],
  })

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event,
  });
});

const getHostedEvents = AsyncHandler(async (req, res) => {
  const events = await eventSchema
    .find({ host: req.user._id })
    .populate("participants", "-password -refreshToken");

  if (!events || events.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No hosted events found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Hosted events retrieved successfully",
    events,
  });
});

const getParticipatedEvents = AsyncHandler(async (req, res) => {
  const participation = await ParticipationSchema.findOne({
    user: req.user._id,
  })
    .populate("events.id", "-participants")
    .select("events");

  if (
    !participation ||
    !participation.events ||
    participation.events.length === 0
  ) {
    return res.status(404).json({
      success: false,
      message: "No participated events found",
    });
  }

  const events = participation.events.map((e) => e.id);
  return res.status(200).json({
    success: true,
    message: "Participated events retrieved successfully",
    events,
  });
});

const addParticipant = AsyncHandler(async (req, res) => {
  const { eventId, participantId } = req.body;
  if (!eventId || !participantId) {
    return res.status(400).json({
      success: false,
      message: "Event ID and Participant ID are required",
    });
  }
  const event = await eventSchema.findById(eventId);
  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }
  if (event.participants.includes(participantId)) {
    return res.status(400).json({
      success: false,
      message: "Participant already added to the event",
    });
  }
  if (event.participants.length >= event.maxLimit) {
    return res.status(400).json({
      success: false,
      message: "Event is full, cannot add more participants",
    });
  }
  event.participants.push(participantId);
  await event.save();

  return res.status(200).json({
    success: true,
    message: "Participant added successfully",
    event,
  });
});

const getOngoingEvents = AsyncHandler(async (req, res) => {
  const now = new Date();

  const events = await eventSchema.find({
    startTime: { $lte: now },
    endTime: { $gte: now },
  }).populate("host", "_id name email avatar");

  res.status(200).json({
    success: true,
    events,
  });
});

const getUpcomingEvents = AsyncHandler(async (req, res) => {
  const now = new Date();

  const events = await eventSchema.find({ startTime: { $gt: now } })
    .populate("host", "fullName avatar")
    .sort({ startTime: 1 }); // sort by soonest first

  res.status(200).json({
    success: true,
    count: events.length,
    events,
  });
});

export {
  createEvent,
  getHostedEvents,
  getParticipatedEvents,
  addParticipant,
  getOngoingEvents,
  getUpcomingEvents,
};
