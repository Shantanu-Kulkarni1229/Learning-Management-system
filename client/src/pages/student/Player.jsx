import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
      }
    });
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses]);

  return (
    <>
      <div className="p-4 sm:p-10 md:px-36 grid md:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold mb-4">Course Structure</h2>
          <div className="space-y-4">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg bg-white"
                >
                  {/* Chapter Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="Arrow Icon"
                        className={`transition-transform duration-300 ${
                          openSection[index] ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                      <p className="font-medium text-sm md:text-base">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 whitespace-nowrap">
                      {chapter.chapterContent.length} Lectures •{' '}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Lecture List */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSection[index] ? 'max-h-[1000px] py-2' : 'max-h-0'
                    }`}
                  >
                    <ul className="divide-y divide-gray-100 px-4">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 py-2 text-sm"
                        >
                          <img
                            src={
                              false
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt="Play"
                            className="w-4 h-4 mt-1"
                          />
                          <div>
                            <p className="font-medium">{lecture.lectureTitle}</p>
                            <div className="flex gap-3 text-xs text-gray-500 mt-1">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-green-600 font-semibold cursor-pointer hover:underline"
                                >
                                  Watch
                                </p>
                              )}
                              <span>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  {
                                    units: ['h', 'm', 's'],
                                    round: true,
                                  }
                                )}
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

          <div className='flex items-center gap-2 py-3 mt-20'>
            <h1 className='text-xl font-bold '>Rate This Course</h1>
            <Rating initialRating={0} />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full">
          {playerData ? (
            <div className="space-y-4">
              <YouTube
                videoId={playerData.lectureUrl.split('/').pop()}
                iframeClassName="w-full aspect-video rounded-lg shadow-lg"
              />
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="font-medium text-gray-700 mb-2">
                  {playerData.chapter}.{playerData.lecture} -{' '}
                  {playerData.lectureTitle}
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                  {false ? 'completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>
          ) : (
            courseData && (
              <img
                src={courseData.courseThumbnail}
                alt="Course Thumbnail"
                className="rounded-lg shadow-md"
              />
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
