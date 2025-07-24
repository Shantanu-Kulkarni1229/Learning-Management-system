import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {Line} from 'rc-progress';
import Footer from '../../components/student/Footer';
const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration , navigate} = useContext(AppContext);

  const [progressArray, setProgressArray ] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 3, totalLectures: 10 },
    { lectureCompleted: 7, totalLectures: 8 },
    { lectureCompleted: 0, totalLectures: 5 },
    { lectureCompleted: 10, totalLectures: 12 },
    { lectureCompleted: 5, totalLectures: 5 },
    { lectureCompleted: 1, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 9 },
    { lectureCompleted: 8, totalLectures: 10 },
    { lectureCompleted: 6, totalLectures: 6 },
  ]);

  return (
    <>
    <div className="px-4 md:px-36 pt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Enrollments</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full table-auto min-w-[600px] border">
          <thead className="text-sm font-medium text-gray-700 border-b border-gray-300 max-sm:hidden">
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left">Course</th>
              <th className="px-6 py-4 text-left">Duration Completed</th>
              <th className="px-6 py-4 text-left">Completed</th>
              <th className="px-6 py-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-all">
                <td className="px-4 py-4 flex items-center space-x-4">
                  <img
                    src={course.courseThumbnail}
                    alt="courseThumbnail"
                    className="w-14 h-14 object-cover rounded-md shadow-sm"
                  />
                  <div className='flex-1'>
                    <p className="font-medium text-sm sm:text-base">{course.courseTitle}</p>
                    <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted / progressArray[index].totalLectures) * 100 : 0} className='bg-gray-300 rounded-full' />
                  </div>
                </td>

                <td className="px-4 py-4 max-sm:hidden">
                  <p className="text-sm text-gray-600">{calculateCourseDuration(course)}</p>
                </td>

                <td className="px-4 py-4 max-sm:hidden">
                  <p className="text-sm text-gray-600">{progressArray[index] && `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`}</p>
                </td>

                <td className="px-4 py-4 text-right sm:text-left">
                  <button
                    className={`text-xs font-semibold px-3 py-1 rounded-full 
      ${progressArray[index] &&
                        progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1
                        ? 'text-white bg-green-600' // Style for completed
                        : 'text-yellow-800 bg-yellow-100' // Style for ongoing
                      }` }
                    onClick={() => navigate('/player/'+course._id)}
                  >
                    {
                      progressArray[index] &&
                        progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1
                        ? 'Completed'
                        : 'On Going'
                    }
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
    </>
    
  );
};

export default MyEnrollments;
