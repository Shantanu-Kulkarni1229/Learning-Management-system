import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import CourseProgress from "../models/courseProgress.js";

// ✅ Get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId; // 🔁 Fixed: was incorrectly using res.auth instead of req.auth
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    }); // 🔁 Fixed: was using req.json instead of res.json

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get user’s enrolled courses with lecture access
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const userData = await User.findById(userId).populate({
      path: "enrolledCourses",
      populate: {
        path: "courseContent.chapterContent",
        select: "lectureTitle lectureUrl isPreview", // Optional: Limit lecture fields
      },
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.status(404).json({
        success: false,
        message: "User or course not found",
      });
    }

    // Calculate discounted amount
    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    // Save purchase record
    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
    });

    // Stripe Setup
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(amount * 100), // Convert to smallest currency unit (paise)
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}`,
      line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      session_url: session.url,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Uodate User Course Progress

export const updateUserCourseProgress = async (req , res) => {
    try {
        const userId = req.auth.userId;
        const {courseId , lectureId} = req.body ;
        const progressData = await CourseProgress.findOne({userId , courseId});

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId))
            {
                progressData.lectureCompleted.push(lectureId);
                await progressData.save();
            }
            else{
                await CourseProgress.create({
                    userId, courseId , lectureCompleted : [lectureId]
                })
            }
            res.json({success : true , message : "Progress Updated Successfully"})
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

//  Get User Course Progress

export const getUserCourseProgress = async (req , res) => {
    try {
        const userId = req.auth.userId;
        const {courseId} = req.body;
        const progressData = await CourseProgress.findOne({userId , courseId});

        res.json({
            success : true,
            progressData
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


//  Add User Rating To course

export const addUserRating = async (req , res) => {
    const userId = req.auth.userId;
    const {courseId , rating} = req.body;

    if(!courseId || !rating || !userId || rating < 1 || rating > 5)
    {
        return res.json({
            success : false,
            message : "Invalid Details"
        })
    }

    try {
        const course = await Course.findById(courseId);
        if(!course){
            return res.json({
                success : false,
                message : "Course Not Found"
            })
        }
        const user = await User.findById(userId);
        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({
                success : false,
                message : "User Not Found"
            })
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if(existingRatingIndex > -1)
        {
            course.courseRatings[existingRatingIndex].rating = rating;

        }
        else{
course.courseRatings.push({
    userId,
    rating
})


        }
        await course.save();
        res.json({
            success : true,
            message : "Rating Added Successfully"
        })

       
    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}