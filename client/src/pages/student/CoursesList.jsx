import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';

const CoursesList = () => {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
    <div className="relative md:px-36 px-6 pt-20 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between w-full">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
          <p className="text-gray-500">
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate('/')}
            >
              Home
            </span>{' '}
            / Course List
          </p>
        </div>
        <SearchBar data={input} />
      </div>

      {/* Search Tag */}
      {input && (
        <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 text-gray-600">
          <p>{input}</p>
          <img
            src={assets.cross_icon}
            alt=""
            className="cursor-pointer"
            onClick={() => navigate('/course-list')}
          />
        </div>
      )}

      {/* Courses Grid or Fallback */}
      {filteredCourse.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-20 text-gray-500 text-lg">
          <p>No courses found for "<span className="font-semibold">{input}</span>".</p>
          <p className="mt-2">We're working to bring more courses soon!</p>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default CoursesList;
