import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";

import {v2 as cloudinary} from 'cloudinary'
// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//  Add New Course 
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const auth = await req.auth();
    const educatorId = auth.userId;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload a course image",
      });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    const newCourse = await Course.create(parsedCourseData);

    return res.status(200).json({
      success: true,
      message: "Course added successfully",
      
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating course",
    });
  }
};

//  gET eDUCATOR coURSESE
export const getEducatorCourses = async (req , res)=>
{
  try {
      const educator = req.auth.userId;
      const courses = await Course.find({ educator });
      return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        data: courses,
      });
  } catch (error) {
    res.json({success:false , message:error.message})
  }
}


//  Get Educator Dashboard Data

export const educatorDashboardData = async (req, res) => {
  try {
    const auth = await req.auth();
    const educator = auth.userId;

    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    // Get all completed purchases for these courses
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    // Fetch enrolled students with course title
    const enrolledStudentsData = await Promise.all(
      courses.map(async (course) => {
        const students = await User.find(
          { _id: { $in: course.enrolledStudents } },
          "name imageUrl"
        );

        return students.map(student => ({
          courseTitle: course.courseTitle,
          student
        }));
      })
    );

    // Flatten the array of arrays
    const flatEnrolledStudentsData = enrolledStudentsData.flat();

    res.status(200).json({
      success: true,
      dashboardData: {
        totalEarnings,
        totalCourses,
        enrolledStudentsData: flatEnrolledStudentsData
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Get Enrolled Students Data with Purchase Data

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const auth = await req.auth(); // Use req.auth() as per latest Clerk deprecation notice
    const educator = auth.userId;

    // Fetch courses created by the educator
    const courses = await Course.find({ educator }).select("_id");
    const courseIds = courses.map(course => course._id);

    // Fetch completed purchases, populate user and course info
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    // Extract enrolled student info
    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));

    res.status(200).json({
      success: true,
      enrolledStudents
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
