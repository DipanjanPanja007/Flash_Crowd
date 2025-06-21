import { useState } from "react";
import { useSelector } from "react-redux";
import L from "leaflet";
import toast from "react-hot-toast";
import Map from "../components/Map";
import MapButton from "../components/MapButton.jsx";
import MapPointTypes from "../components/MapPointTypes.jsx";
import { handleCreateEvent } from "../api/event.js";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const AddEvent = () => {
    const events = useSelector((state) => state.eventReducer.events);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "music",
        startTime: "",
        endTime: "",
        maxLimit: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };

                const data = {
                    title: form.title,
                    description: form.description,
                    location: coords,
                    category: form.type,
                    startTime: form.startTime,
                    endTime: form.endTime,
                    maxLimit: form.maxLimit,
                }
                console.log(data);
                const response = await handleCreateEvent(data);
                console.log(response);

                // dispatch(
                //     addEvent(data)
                // );
                toast.success("Event added successfully!", {
                    position: "bottom-center",
                    style: {
                        background: "#4BB543",
                        color: "#fff",
                    },
                });
                setForm({ title: "", description: "", type: "music", startTime: "", endTime: "", maxLimit: 1 });
                setIsSubmitting(false);
            },
            (err) => {
                toast.error("Failed to get your location. Please allow location access.", {
                    position: "bottom-center",
                });
                console.error(err);
                setIsSubmitting(false);
            }
        );
    };

    return (
        <div className="min-h-full bg-gradient-to-br px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Create a New Event</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Fill in the details below to add your event to the map
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 items-stretch h-full">
                    {/* Map Section */}
                    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-xl border-2 border-white bg-white flex">
                        <div className="h-full w-full relative">
                            <Map events={events} />
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="w-full h-full flex">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl text-sm shadow-xl p-8 space-y-4 border-2 border-white h-full w-full flex flex-col"
                        >
                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700">Event Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Summer Music Festival"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700">Event Description</label>
                                <textarea
                                    placeholder="Tell people what to expect at your event..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full border border-gray-200 max-h-[100px] rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">Start Time</label>
                                    <input
                                        type="time"
                                        value={form.startTime}
                                        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                        className="w-full outline-none border border-gray-300 p-2 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium">End Time</label>
                                    <input
                                        type="time"
                                        value={form.endTime}
                                        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                        className="w-full outline-none border border-gray-300 p-2 rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium">Maximum participants</label>
                                <input
                                    min={1}
                                    type="number"
                                    value={form.maxLimit}
                                    onChange={(e) => setForm({ ...form, maxLimit: e.target.value })}
                                    className="w-full outline-none border border-gray-300 p-2 rounded"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-semibold text-gray-700">Event Type</label>
                                <MapPointTypes setForm={setForm} form={form} />
                            </div>

                            <div className="pt-4 mt-auto">
                                <MapButton isSubmitting={isSubmitting} />
                                <div className="text-center pt-2">
                                    <p className="text-xs text-gray-500">
                                        By submitting, you agree to place a marker at your current location
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};



export default AddEvent;