import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FiCheck } from 'react-icons/fi';
import { useEffect } from 'react';
import { handleUpdate } from '../api/user.js';

const interestsOptions = [
    "Football", "Cricket", "Badminton", "Basketball", "Volleyball",
    "Photography", "Quiz", "Chess", "Dance", "Poetry", "Art", "Yoga"
];

const formSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    bio: z.string().min(20, 'Bio must be at least 20 characters'),
    interests: z.array(z.string()).min(1, 'Select at least one interest')
});

const UserProfileForm = () => {
    const user = useSelector(state => state.authReducer.auth);
    useEffect(() => {
        console.log(user);
    }, [user]);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isDirty },
        watch,
        reset
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: user?.fullName || '',
            bio: user?.bio || '',
            interests: user?.interests || []
        }
    });

    const bioLength = watch('bio')?.length || 0;

    const onSubmit = async (data) => {
        const { fullName, bio, interests } = data;
        const updatedUser = { fullName, bio, interests };

        const res = await handleUpdate(updatedUser);

        if (res.status === 200) {
            toast.success('Profile updated successfully!', {
                duration: 3000,
                position: 'top-right',
                style: {
                    background: '#4CAF50',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '12px'
                }
            });
            reset(data); // Reset dirty state after successful update
        } else {
            toast.error('Update failed', {
                position: 'top-right',
                style: {
                    background: '#EF4444',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '12px'
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Profile Picture Section */}
                        <div className="lg:w-1/4 flex flex-col items-center">
                            <div className="relative group">
                                <img
                                    className="w-40 h-40 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
                                    src={user?.avatar || "https://res.cloudinary.com/du4bs9xd2/image/upload/v1750344689/profile_image_srdpjg.png"}
                                    alt="User Avatar"
                                />
                            </div>
                            <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.fullName || 'Your Name'}</h2>
                            <p className="text-gray-500 text-sm">
                                {user?.bio ? bioLength > 50 ? `${user.bio.substring(0, 50)}...` : user.bio : 'Tell us about yourself'}
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="lg:w-3/4 space-y-6">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="fullName"
                                        {...register('fullName')}
                                        className={`w-full px-4 py-3 outline-none bg-gray-50 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.fullName ? 'border-red-300' : 'border-gray-200'}`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="bio"
                                        {...register('bio')}
                                        rows={5}
                                        className={`w-full max-h-[300px] min-h-[100px] outline-none px-4 py-3 bg-gray-50 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${errors.bio ? 'border-red-300' : 'border-gray-200'}`}
                                        placeholder="Tell us about yourself (at least 20 characters)"
                                    />
                                    <div className="flex justify-between mt-2">
                                        {errors.bio ? (
                                            <p className="text-sm text-red-500">{errors.bio.message}</p>
                                        ) : (
                                            <p className="text-sm text-gray-500">Minimum 20 characters</p>
                                        )}
                                        <p className={`text-sm ${bioLength < 20 ? 'text-gray-500' : 'text-green-500'}`}>
                                            {bioLength}/20
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Interests */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Your Interests <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="interests"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {interestsOptions.map((interest) => (
                                                <div key={interest} className="relative">
                                                    <input
                                                        type="checkbox"
                                                        id={`interest-${interest}`}
                                                        checked={field.value.includes(interest)}
                                                        onChange={(e) => {
                                                            const newInterests = e.target.checked
                                                                ? [...field.value, interest]
                                                                : field.value.filter(item => item !== interest);
                                                            field.onChange(newInterests);
                                                        }}
                                                        className="absolute opacity-0 h-0 w-0"
                                                    />
                                                    <label
                                                        htmlFor={`interest-${interest}`}
                                                        className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${field.value.includes(interest)
                                                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                                                    >
                                                        <span className={`flex items-center justify-center w-5 h-5 border rounded mr-3 transition-all ${field.value.includes(interest)
                                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                                            : 'bg-white border-gray-300'}`}>
                                                            {field.value.includes(interest) && <FiCheck size={14} />}
                                                        </span>
                                                        {interest}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                                {errors.interests && (
                                    <p className="mt-1 text-sm text-red-500">Please select at least one interest</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save Changes Button */}
                    {isDirty && (
                        <div className="flex items-center space-x-4 w-full justify-end mt-5">
                            <button
                                onClick={handleSubmit(onSubmit)}
                                className="px-6 py-2 bg-indigo-600 hover:cursor-pointer self-end hover:bg-indigo-700 text-white font-medium rounded-full flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <FiCheck size={18} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileForm;
