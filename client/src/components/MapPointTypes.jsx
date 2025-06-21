const eventOptions = [
    { value: "Football", label: "⚽ Football", color: "bg-green-100 text-green-800" },
    { value: "Cricket", label: "🏏 Cricket", color: "bg-green-100 text-green-800" },
    { value: "Badminton", label: "🏸 Badminton", color: "bg-green-100 text-green-800" },
    { value: "Basketball", label: "🏀 Basketball", color: "bg-green-100 text-green-800" },
    { value: "Vollyball", label: "🏐 Vollyball", color: "bg-green-100 text-green-800" },

    { value: "Photography", label: "📷 Photography", color: "bg-yellow-100 text-yellow-800" },
    { value: "Quiz", label: "❓ Quiz", color: "bg-blue-100 text-blue-800" },
    { value: "Chess", label: "♟️ Chess", color: "bg-gray-100 text-gray-800" },

    { value: "Dance", label: "💃 Dance", color: "bg-pink-100 text-pink-800" },
    { value: "Poetry", label: "📝 Poetry", color: "bg-red-100 text-red-800" },
    { value: "Art", label: "🎨 Art", color: "bg-purple-100 text-purple-800" },
    { value: "Yoga", label: "🧘 Yoga", color: "bg-teal-100 text-teal-800" },
    { value: "Singing", label: "🎤 Singing", color: "bg-indigo-100 text-indigo-800" },
];


function MapPointTypes({ setForm, form }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {eventOptions.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, type: option.value })}
                    className={`rounded-xl hover:cursor-pointer h-10 py-2 px-3 text-sm font-medium transition duration-200 ${form.type === option.value
                        ? `${option.color} ring-2 ring-offset-2 ring-indigo-500`
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}

export default MapPointTypes