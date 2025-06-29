import { FiUser, FiStar, FiUsers, FiAward } from 'react-icons/fi';
import { useCallback, useEffect, useState } from 'react';
import { handleGetUser } from '../api/user.js';
import { UserPlus, UserMinus, XCircle } from 'lucide-react';
import { toast } from "react-hot-toast";
import { handleAcceptRequest, handleDeleteRequest, handleRemoveRequest, handleSendFriendRequest } from '../api/friend.js';

const OtherProfile = ({ id }) => {

    const [user, setUser] = useState(null);
    const [hostedEvents, setHostedEvents] = useState(0);
    const [joinedEvents, setJoinedEvents] = useState(0);
    const [isFriend, setIsFriend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getUser = useCallback(async () => {

        const response = await handleGetUser(id);

        setHostedEvents(response?.data?.eventCount);
        setJoinedEvents(response?.data?.participationCount?.events);

        if (response?.data?.success) {
            setUser(response.data.user);
        }
        else {
            console.error("Failed to fetch user data:", response?.data?.message || "Unknown error");
        }

    }, [id])

    const getUserStatus = useCallback(async () => {
        if (!id) return;
        try {
            const response = await handleGetUser(id);
            if (response?.data?.success) {
                setIsFriend(response.data.success);
            } else {
                console.error("Failed to fetch user status:", response?.data?.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error fetching user status:", error);
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getUserStatus();
        }
    }, [id, getUserStatus]);

    useEffect(() => {
        getUser();
    }, [getUser])

    const sendRequest = async () => {
        setIsLoading(true);
        const response = await handleSendFriendRequest({ receiverId: id });
        if (response?.data?.success) {
            toast.success("Friend request sent successfully!");
        } else {
            toast.error("Failed to send friend request");
        }
        setIsLoading(false);
    }

    const deleteRequest = async () => {
        setIsLoading(true);
        const response = await handleDeleteRequest({ receiverId: id });
        if (response?.data?.success) {
            toast.success("Friend request deleted successfully!");
        } else {
            toast.error("Failed to delete friend request");
        }
        setIsLoading(false);
    }
    const removeFriend = async () => {
        setIsLoading(true);
        const response = await handleRemoveRequest({ friendId: id });
        console.log(response);

        if (response?.data?.success) {
            toast.success("Friend removed successfully!");
        } else {
            toast.error("Failed to remove friend");
        }
        setIsLoading(false);
    }
    const acceptRequest = async () => {
        setIsLoading(true);
        const response = await handleAcceptRequest({ senderId: id });
        if (response?.data?.success) {
            toast.success("Friend request accepted successfully!");
        } else {
            toast.error("Failed to accept friend request");
        }
        setIsLoading(false);
    }


    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading user profile...</div>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Profile Picture Section */}
                        <div className="lg:w-1/4 flex flex-col items-center">
                            <div className="relative">
                                <img
                                    className="w-40 h-40 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                                    src={user?.avatar || "https://res.cloudinary.com/du4bs9xd2/image/upload/v1750344689/profile_image_srdpjg.png"}
                                    alt="User Avatar"
                                />
                            </div>
                            <h2 className="mt-4 text-2xl font-bold text-gray-900">{user?.fullName || 'Anonymous User'}</h2>
                            <p className="text-gray-500 text-center mt-2">{user?.bio || 'Hey there! I\'m using FlashCrowd.'}</p>

                            {/* <div className="flex gap-3">
                                {
                                    isFriend ?

                                        <button disabled={isLoading}
                                            onClick={removeFriend}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition duration-200"
                                        >
                                            <UserMinus className="w-5 h-5" />
                                            <span>Remove Friend</span>
                                        </button>
                                        :
                                        <>

                                            <button disabled={isLoading}
                                                onClick={deleteRequest}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition duration-200"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                <span>Delete Request</span>
                                            </button>
                                            <button disabled={isLoading}
                                                className="inline-flex hover:cursor-pointer items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                                                onClick={sendRequest}
                                            >
                                                <UserPlus className="w-5 h-5 mr-2" />
                                                Add Friend
                                            </button>
                                        </>
                                }
                            </div> */}

                            {/* Stats Section */}
                            <div className="mt-6 w-full space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <FiUsers className="text-indigo-600" />
                                        <span className="text-gray-900">Friends</span>
                                        <span className="font-medium text-black">{user?.friendCount || 0}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <FiStar className="text-yellow-500" />
                                        <span className="text-gray-900">Rating</span>
                                        <span className="font-medium text-black">{user?.rating?.toFixed(1) || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <FiAward className="text-purple-600" />
                                        <span className="text-gray-900">Karma</span>
                                        <span className="font-medium text-black">{user?.karma || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="lg:w-3/4">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">About Me</h3>

                            {/* Interests */}
                            <div className="mb-8">
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Interests</h4>
                                <div className="flex flex-wrap gap-3">
                                    {user?.interests?.length > 0 ? (
                                        user.interests.map((interest) => (
                                            <span
                                                key={interest}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                                            >
                                                {interest}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No interests added yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Activity Stats (example) */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">FlashCrowd Stats</h4>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-indigo-600">{hostedEvents?.length || 0}</p>
                                        <p className="text-gray-500 text-sm">Events Hosted</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-indigo-600">{joinedEvents?.length || 0}</p>
                                        <p className="text-gray-500 text-sm">Events Joined</p>
                                    </div>
                                    {/* <div className="bg-gray-50 p-4 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-indigo-600">89%</p>
                                        <p className="text-gray-500 text-sm">Reliability</p>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default OtherProfile;