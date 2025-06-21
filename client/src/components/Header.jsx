import {
    Bell,
} from 'lucide-react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import {
    SignInButton,
} from '@civic/auth/react';

import ProfileDropdown from './ProfileDropdown.jsx';

const Header = () => {

    const { auth } = useSelector(state => state.authReducer);


    return (
        <header className="flex justify-between items-center p-3 px-4 bg-gray-50 border-b border-gray-200">
            {/* Left side - Logo/Location */}
            <div className="flex items-center">
                <Link to={'/'} className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    FlashCrowd
                </Link>
            </div>

            {/* Right side - Navigation and Profile */}
            <div className="flex items-center gap-5">
                {auth ? (
                    <>
                        {/* Navigation Links */}
                        <nav className="flex gap-4 items-center">

                            <Link to="#" className="flex flex-col text-sm items-center gap-1 text-gray-800 hover:text-black">
                                <Bell size={25} />
                            </Link>
                        </nav>

                        {/* Profile Dropdown */}
                        <ProfileDropdown />
                    </>
                ) : (
                    <SignInButton className="hover:cursor-pointer" />
                )}

            </div>
        </header>
    );
};



export default Header;
