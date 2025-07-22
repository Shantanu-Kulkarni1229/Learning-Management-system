import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialSection = () => {
  return (
    <div className='pb-14 px-4'>
      <div className='max-w-7xl mx-auto'> 
        <h2 className='text-3xl font-semibold text-gray-800'>Testimonials</h2>
        <p className='text-sm md:text-base text-gray-500 mt-3'>
          Hear from our learners and educators about their experience with our courses and services.
        </p>

        <div className='grid grid-cols-auto  gap-8 mt-14'>
          {dummyTestimonial.map((testimonial, index) => (
            <div
              key={index}
              className='text-sm text-left border border-gray-200 rounded-xl bg-white shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]'
            >
              {/* Header: Image + Name + Role */}
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-50'>
                <img
                  className='h-12 w-12 rounded-full object-cover'
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div>
                  <h3 className='text-lg font-medium text-gray-800'>{testimonial.name}</h3>
                  <p className='text-sm text-gray-600'>{testimonial.role}</p>
                </div>
              </div>

              {/* Feedback and Rating */}
              <div className='p-5'>
                <div className='flex gap-0.5'>
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      className='h-5 w-5'
                      src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                      alt="star"
                    />
                  ))}
                </div>
                <p className='text-gray-500 mt-4 leading-relaxed'>
                  {testimonial.feedback}
                </p>
              </div>
              <a className='text-blue-500 underline px-5' href="#">Read More</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
