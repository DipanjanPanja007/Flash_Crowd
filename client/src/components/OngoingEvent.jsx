import { useEffect, useState } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import Map from "./Map.jsx";

const OngoingEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // let isDisabled = false;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get(`/event/currEvent`);

        // console.log("Fetched events:", response?.data?.events?.[0]?.host?.avatar);

        // Normalize events data to handle location objects
        const normalizedEvents = response?.data?.events
        // ?.map(event => ({
        //   ...event,
        //   // Handle location whether it's a string or object
        //   location: typeof event.location === 'string' 
        //     ? event.location 
        //     : event.location?.address || 
        //       (event.location?.lat && event.location?.lng 
        //         ? `${event.location.lat}, ${event.location.lng}` 
        //         : 'Location not specified')
        // })) || [];
        // console.log("Normalized events:", normalizedEvents);
        setEvents(normalizedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDateTime = (isoString) => {
    try {
      const date = parseISO(isoString);
      return {
        date: format(date, "MMMM do, yyyy"),
        time: format(date, "h:mm a"),
      };
    } catch {
      return {
        date: "Date not specified",
        time: "Time not specified"
      };
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex space-x-4 pt-4">
                <div className="h-8 bg-gray-200 rounded-full w-8"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upcoming Events</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upcoming Events</h1>
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          No upcoming events found.
        </div>
      </div>
    );
  }

  const handleJoinEvent = async (eventId) => {
    try {
      const response = await axiosInstance.post(`/event/add-participant`, {
        eventId,
      });
      console.log(response);

      if (response.data.success) {
        toast.success("Successfully joined the event!");

        // Optionally, you can refresh the events list or update the state
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, participants: [...(event.participants || []), response.data.user] }
              : event
          )
        );
      } else {
        toast.error(response.data.message || "Failed to join the event.");
        //alert("Failed to join the event. Please try again.");
      }
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error(error.response?.data?.message || "An error occurred while joining the event.");
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Upcoming Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => {
          console.log(event);
          event.position = event.location;

          const start = formatDateTime(event.startTime);
          const end = formatDateTime(event.endTime);
          const participantsCount = event.participants?.length || 0;
          const spotsLeft = event.maxLimit - participantsCount;
          const progressPercentage = Math.min(
            (participantsCount / event.maxLimit) * 100,
            100
          );

          return (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Event Image */}
              <div className="h-48">
                {<Map events={[event]} className="" />}
              </div>

              {/* Event Content */}
              <div className="p-6">
                {/* Title and Category */}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {event.title || "Untitled Event"}
                  </h2>
                  {event.category && (
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description || "No description provided."}
                </p>

                {/* Host */}
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 rounded-full mr-3">
                    {/* <FaUser className="text-gray-600" /> */}
                    <img
                      className="w-10 h-10 rounded-full"
                      src={event?.host?.avatar}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hosted by</p>
                    <p className="font-medium">
                      {event?.host?.fullName || "Anonymous"}
                    </p>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-gray-400 mr-3" />
                    <span className="text-gray-700">{start.date}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      {start.time} - {end.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                    <span className="text-gray-700">
                      {"Location not specified"}
                    </span>
                  </div>
                </div>

                {/* Participants Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{participantsCount} joined</span>
                    <span>{spotsLeft > 0 ? `${spotsLeft} spots left` : "Event full"}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  className={`w-full ${spotsLeft > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
                  disabled={spotsLeft <= 0}
                  onClick={() => handleJoinEvent(event._id)}
                >
                  <FaUsers className="mr-2" />
                  {spotsLeft > 0 ? "Join Event" : "Event Full"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OngoingEvent;