





const FriendPreview = ({ _id, fullName, email, avatar }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-4 w-full max-w-sm mx-auto">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
                <img
                    src={avatar || "https://via.placeholder.com/100"}
                    alt={`${fullName}'s avatar`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                />
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{fullName}</h2>
                    <p className="text-sm text-gray-500">{email}</p>
                </div>
            </div>

            {/* ID Display (Optional - You can remove this if not needed visually) */}
            <div className="mt-4 text-xs text-gray-400 break-words">
                <span className="font-medium text-gray-600">User ID:</span> {_id}
            </div>
        </div>
    );
};

export default FriendPreview;
