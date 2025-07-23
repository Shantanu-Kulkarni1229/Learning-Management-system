import { createContext } from "react";
import { dummyCourses } from "../assets/assets";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

// Creating a global context to share data across components without prop drilling
export const AppContext = createContext();

// AppContextProvider will wrap the app and provide shared state and functions
export const AppContextProvider = (props) => {
  // Accessing currency value from Vite environment variables
  const currency = import.meta.env.VITE_CURRENCY;

  // Hook to programmatically navigate within the application
  const navigate = useNavigate();

  // State to hold all course data
  const [allCourses, setAllCourses] = useState([]);

  // State to track whether the current user is an educator or not
  const [isEducator, setIsEducator] = useState(true);

  // Function to fetch all courses
  // Currently uses dummy data; can be replaced with API fetch logic
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Calculates the average rating for a given course
  const calculateRating = (course) => {
    // If no ratings, return 0
    if (course.courseRatings.length === 0) return 0;

    let totalRating = 0;
    // Sum all rating values
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    // Return average
    return totalRating / course.courseRatings.length;
  };

  // Fucntion to calculate course chapter time

  const calculateChapterTime = (chapter) => {
  let time = 0;
  chapter.chapterContent.map((lecture) => {
    time += lecture.lectureDuration;
  });

  return humanizeDuration(time * 1000, { units: ['h', 'm', 's'], round: true });
};


    // Fucntion to calculate course Duration time

    const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) => chapter.chapterContent.map(
        (lecture) => time +=lecture.lectureDuration
    ))
     return humanizeDuration(time * 1000, {units: ['h', 'm', 's'], round: true});
    }
    // Fucntion to calculate Number of lectures

    const calculateNumberOfLectures = (course) => {
        let totalLectures = 0;

        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        })

        return totalLectures;
    }



  // useEffect runs once on component mount to fetch course data
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Values to be shared with all components that consume this context
  const value = {
    currency,            // Shared currency symbol/value
    allCourses,          // List of all available courses
    navigate,            // Navigation hook for programmatic route changes
    calculateRating,     // Function to get average course rating
    isEducator,          // Boolean flag for user type
    setIsEducator  ,      // Function to toggle user type
    calculateChapterTime, // Function to calculate chapter time
    calculateCourseDuration, // Function to calculate course duration
    calculateNumberOfLectures

  };

  // Wrapping child components with context provider
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
