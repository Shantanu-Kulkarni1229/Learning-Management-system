import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    setCourses(allCourses);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  return courses ? (
    <div className="flex flex-col gap-6 md:p-8 p-4 pt-8">
      {/* Section: My Courses Table */}
      <div className="w-full">
        <h2 className="pb-4 text-lg font-semibold text-gray-800">My Courses</h2>

        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700 font-medium border-b border-gray-300">
              <tr>
                <th className="text-left px-4 py-3">Course</th>
                <th className="text-left px-4 py-3">Earnings</th>
                <th className="text-left px-4 py-3">Students</th>
                <th className="text-left px-4 py-3">Published On</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 flex items-center gap-4">
                    <img
                      src={course.courseThumbnail}
                      alt={course.courseTitle}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <span>{course.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3">
                    {currency}{' '}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice - (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3">{course.enrolledStudents.length}</td>
                  <td className="px-4 py-3">{new Date(course.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
