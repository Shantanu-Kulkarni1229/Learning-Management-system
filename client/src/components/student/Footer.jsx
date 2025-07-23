import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className='bg-gray-900 w-full mt-10 text-left'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-start px-6 md:px-10 justify-between gap-10 py-12 border-b border-white/20'>
        
        {/* Logo & Description */}
        <div className='flex flex-col md:items-start items-center w-full md:w-1/3'>
          <img src={assets.logo_dark} alt="Logo" className='h-10' />
          <p className='mt-6 text-center md:text-left text-sm text-white/80 leading-relaxed'>
            Join our community of learners and educators to explore, learn, and grow together.
          </p>
        </div>

        {/* Company Links */}
        <div className='flex flex-col md:items-start items-center w-full md:w-1/4'>
          <h2 className='font-semibold text-white mb-5 text-base'>Company</h2>
          <ul className='flex flex-wrap md:flex-col justify-center md:justify-start gap-3 text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className='hidden md:flex flex-col w-full md:w-1/3'>
          <h2 className='font-semibold text-white mb-5 text-base'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80 leading-relaxed'>
            Stay updated with the latest courses, news, and offers. Enter your email below to subscribe.
          </p>
          <div className='flex items-center gap-3 pt-4'>
            <input
              type="email"
              placeholder='Enter your email'
              className='px-3 py-2 rounded-md w-full border border-white/30 bg-gray-800 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700'>
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Note */}
      <p className='py-5 text-center text-xs md:text-sm text-white/60'>
        © 2025 SK — All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
