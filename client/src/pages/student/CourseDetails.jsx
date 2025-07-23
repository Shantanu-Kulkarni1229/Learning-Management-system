import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import humanizeDuration from 'humanize-duration';
import { assets } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNumberOfLectures,
    currency,
  } = useContext(AppContext);

  useEffect(() => {
    const fetchCourseData = () => {
      const findCourse = allCourses.find(course => course._id === id);
      setCourseData(findCourse);
    };

    fetchCourseData();
  }, [allCourses, id]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      <div className='relative md:px-36 px-6 pt-20 pb-12 text-left bg-gradient-to-b from-cyan-100/60'>
        {/* Background Gradient */}
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-cyan-100/60 to-white'></div>

        {/* Main Content */}
        <div className='flex flex-col-reverse md:flex-row gap-10 z-10'>
          {/* Left Side */}
          <div className='flex-1 text-gray-700'>
            <h1 className='text-3xl md:text-4xl font-semibold text-gray-800'>
              {courseData.courseTitle}
            </h1>

            <p
              className="mt-4 text-sm md:text-base"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription.slice(0, 200),
              }}
            ></p>

            {/* Ratings & Info */}
            <div className='flex items-center flex-wrap gap-4 mt-4 text-sm'>
              <p className='font-medium'>{calculateRating(courseData).toFixed(1)}</p>
              <div className='flex space-x-0.5'>
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                    alt='star'
                    className='w-4 h-4'
                  />
                ))}
              </div>
              <p className='text-blue-600'>
                {courseData.courseRatings.length} Rating{courseData.courseRatings.length !== 1 && 's'}
              </p>
              <p>
                {courseData.enrolledStudents.length} Student{courseData.enrolledStudents.length !== 1 && 's'}
              </p>
            </div>

            <p className='mt-2 text-sm'>
              Course by <span className='text-blue-600 underline'>Shantanu Kulkarni</span>
            </p>

            {/* Course Structure */}
            <div className='mt-10'>
              <h2 className='text-xl font-semibold mb-4'>Course Structure</h2>

              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-200 rounded-lg bg-white mb-4'>
                  {/* Chapter Header */}
                  <div
                    className='flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer'
                    onClick={() => toggleSection(index)}
                  >
                    <div className='flex items-center gap-2'>
                      <img
                        src={assets.down_arrow_icon}
                        alt="Arrow Icon"
                        className={`transform transition-transform ${openSection[index] ? 'rotate-180' : 'rotate-0'}`}
                      />
                      <p className='font-medium text-sm md:text-base'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-xs text-gray-600'>
                      {chapter.chapterContent.length} Lectures • {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Lecture List */}
                  <div
                    className='overflow-hidden transition-all duration-300 ease-in-out cursor-pointer'
                    style={{ maxHeight: openSection[index] ? '1000px' : '0px' }}
                  >
                    <ul className='divide-y divide-gray-100 px-4 py-2'>
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className='flex items-start gap-3 py-2'>
                          <img src={assets.play_icon} alt="Play" className='w-4 h-4 mt-1' />
                          <div className='text-sm'>
                            <p className='font-medium'>{lecture.lectureTitle}</p>
                            <div className='flex gap-3 text-xs text-gray-500 mt-1'>
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() => setPlayerData({
                                    videoId: lecture.lectureUrl.split('/').pop(),
                                  })}
                                  className='text-green-600 font-semibold'
                                >
                                  Preview
                                </p>
                              )}
                              <span>
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                  units: ['h', 'm', 's'],
                                  round: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Description */}
            <div className='py-20 text-sm md:text-default'>
              <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
              <p
                className="pt-3 rich-text"
                dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
              ></p>
            </div>
          </div>

          {/* Right Side */}
          <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
            {playerData ? (
              <YouTube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName='w-full aspect-video'
              />
            ) : (
              <img src={courseData.courseThumbnail} alt="courseThumbnail" />
            )}

            <div className="p-5">
              <div className='flex items-center gap-2'>
                <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock icon" />
                <p><span className='text-red-500'>5 days</span> left at this price</p>
              </div>

              <div className='flex gap-3 items-center pt-2'>
                <p className='text-gray-800 md:text4xl text-2xl font-semibold'>
                  {currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
                </p>
                <p className='md:text-lg text-gray-500 line-through'>
                  {currency}{courseData.coursePrice.toFixed(2)}
                </p>
                <p className='md:text-lg text-green-600'>{courseData.discount}% off</p>
              </div>

              <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
                <div className='flex items-center gap-1'>
                  <img src={assets.star} alt="" />
                  <p>{calculateRating(courseData)}</p>
                </div>
                <div className='h-4 w-px bg-gray-500/40'></div>
                <div className='flex items-center gap-1'>
                  <img src={assets.time_clock_icon} alt="" />
                  <p>{calculateCourseDuration(courseData)}</p>
                </div>
                <div className='h-4 w-px bg-gray-500/40'></div>
                <div className='flex items-center gap-1'>
                  <img src={assets.lesson_icon} alt="" />
                  <p>{calculateNumberOfLectures(courseData)} lessons</p>
                </div>
              </div>

              <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>
                {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
              </button>

              <div className='pt-6'>
                <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the Course?</p>
                <ul className='ml-4 pt-2 text-sm md:text-default text-gray-600 list-disc'>
                  <li>Lifetime access with free updates.</li>
                  <li>Step-by-step, hands-on project guidance.</li>
                  <li>Downloadable resources and source code.</li>
                  <li>Quizzes to test your knowledge.</li>
                  <li>Certificate of completion.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
