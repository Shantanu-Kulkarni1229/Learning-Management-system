import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t py-4">
      <div className="flex items-center gap-4">
        <img src={assets.logo} alt="Logo" className="hidden md:block h-7" />
        <div className="hidden md:block h-7 w-px bg-gray-500/60" />
        <p className="text-xs md:text-sm text-gray-500">
          © 2025 Shantanu Kulkarni. All rights reserved.
        </p>
      </div>

      <div className="flex items-center gap-3 mt-4 md:mt-0">
        <a href="#" aria-label="Facebook">
          <img src={assets.facebook_icon} alt="Facebook" />
        </a>
        <a href="#" aria-label="Twitter">
          <img src={assets.twitter_icon} alt="Twitter" />
        </a>
        <a href="#" aria-label="Instagram">
          <img src={assets.instagram_icon} alt="Instagram" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
