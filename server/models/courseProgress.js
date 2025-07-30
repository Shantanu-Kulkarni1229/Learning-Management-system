import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: { type: String, required: true },

    completed: { type: Number, default: false },
    lectureCompleted: []


}, {minimized: false});

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
export default CourseProgress