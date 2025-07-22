import { createContext } from "react";
import { dummyCourses } from "../assets/assets";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)

    // Fetch All courses

    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    }

    // Function to calculate average rating of course

    const calculateRating = (course) => {
if (course.courseRatings.length === 0) return 0;
        
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }

    useEffect(() => {

        fetchAllCourses()

        return () => {

        }
    }, [])


    const value = {
        currency, allCourses , navigate , calculateRating , isEducator , setIsEducator
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}