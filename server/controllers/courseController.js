import Course from "../models/Course.js";

// ✅ Get all Published Courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select("-courseContent -enrolledStudents") // fixed typo: 'couseContent' ➝ 'courseContent'
      .populate("educator");

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Course by ID
export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate("educator");

    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Hide non-preview lecture URLs
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreview) {
          lecture.lectureUrl = ""; // or null if preferred
        }
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
