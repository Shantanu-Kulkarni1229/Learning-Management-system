import { clerkClient } from "@clerk/express";

//  Middleware( Protext Educator Routes)

export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const response = await clerkClient.users.getUser(userId);
        if(response.publicMetadata.role !== "educator") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "General server error",
        });
    }
};