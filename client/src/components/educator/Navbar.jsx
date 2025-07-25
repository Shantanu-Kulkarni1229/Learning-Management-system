import React from 'react';
import { assets, dummyEducatorData } from "../../assets/assets";
import { Link } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const educator = dummyEducatorData;
  const { user } = useUser();

  return (
    <div className="flex justify-between items-center px-4 py-2 shadow-md bg-white">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <p className="text-gray-800 font-medium">
          Hi {user ? user.firstName : 'Developer'},
        </p>

        {user ? (
          <UserButton />
        ) : (
          <img
            src={assets.profile_img}
            alt="User icon"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
