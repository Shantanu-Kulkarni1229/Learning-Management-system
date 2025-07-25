import React, { useState, useEffect } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    // Simulate async fetch
    setEnrolledStudents(dummyStudentEnrolled);
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  return enrolledStudents ? (
    <div className='min-h-screen w-full px-4 md:px-8 pt-6 pb-10 flex flex-col items-center'>
      <h2 className="text-xl font-semibold mb-4 w-full text-left">Students Enrolled</h2>
      <div className="w-full max-w-6xl overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className='w-full text-left'>
          <thead className='bg-gray-100 border-b border-gray-300 text-gray-700'>
            <tr>
              <th className='px-4 py-3 hidden sm:table-cell'>#</th>
              <th className='px-4 py-3'>Student</th>
              <th className='px-4 py-3'>Course Title</th>
              <th className='px-4 py-3 hidden sm:table-cell'>Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b hover:bg-gray-50 transition'>
                <td className='px-4 py-3 hidden sm:table-cell text-center'>{index + 1}</td>
                <td className='px-4 py-3 flex items-center gap-3'>
                  <img src={item.student.imageUrl} alt="student" className='w-9 h-9 rounded-full object-cover' />
                  <span>{item.student.name}</span>
                </td>
                <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                <td className='px-4 py-3 hidden sm:table-cell'>
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
