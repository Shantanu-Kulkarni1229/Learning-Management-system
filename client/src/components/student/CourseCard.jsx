import React from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {
const {currency , calculateRating} = useContext(AppContext)

  return (
    <Link to={'/course/' + course._id} onClick={() => scrollTo(0, 0)} className='border border-neutral-200 pb-6 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md'>
  <img className='w-full' src={course.courseThumbnail} alt={course.courseTitle} />
  <div className='p-3 text-left'>
    <h3 className='text-base font-semibold truncate'>{course.courseTitle}</h3>
    <p className='text-gray-500'>{course.educator.name}</p>
    <div className='flex items-center space-x-2 mt-1'>
      <p>{calculateRating(course)}</p>
      <div className='flex space-x-0.5'>
        {[...Array(5)].map((_, i) => (
          <img key={i} src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt="star" className='w-3.5 h-3.5' />
        ))}
      </div>
      <p className='text-gray-500'>{course.courseRatings.length}</p>
    </div>
    <div className="flex items-center space-x-2 mt-1">
      <p className='text-base font-semibold text-gray-800'>
        {currency}{(course.coursePrice - course.discount*course.coursePrice / 100).toFixed(2)}
      </p>
      <p className='text-sm line-through text-gray-500'>
        {currency}{course.coursePrice.toFixed(2)}
      </p>
    </div>
  </div>
</Link>

  )
}

export default CourseCard