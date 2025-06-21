import { useState } from 'react';
import { Link } from 'react-router';
import { User, Users, ChevronDown, LogOut, CalendarDays } from 'lucide-react';
import { useUser } from '@civic/auth/react';
import { useSelector } from 'react-redux';

export default function ProfileDropdown() {

    const { signOut } = useUser();
    const { auth } = useSelector(state => state.authReducer)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return <div className="relative">
        <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 cursor-pointer bg-transparent border-none"
        >
            <div className='flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full overflow-hidden'>
                <img src={auth?.avatar} className='w-full h-full object-center' alt="" />
            </div>
            <ChevronDown size={16} />
        </button>

        {isDropdownOpen && (
            <div className="absolute right-0 mt-5 w-50 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <Link
                    to={`/profile/${auth?._id}`}
                    className="flex items-center gap-2 px-5 py-3 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                >
                    <User size={23} /> Profile
                </Link>
                <Link
                    to={`/profile/${auth?._id}`}
                    className="flex items-center gap-2 px-5 py-3 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                >
                    <Users size={23} /> Connections
                </Link>
                <Link
                    to={"/events/ongoing"}
                    className="flex items-center gap-2 px-5 py-3 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                >
                    <CalendarDays size={21} /> Events
                </Link>
                <button
                    className="flex items-center gap-2 px-5 py-3 w-full hover:cursor-pointer text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                        setIsDropdownOpen(false);
                        signOut();
                    }}
                >
                    <LogOut size={21} />
                    <span>Log out</span>
                </button>
            </div>
        )}
    </div>
}