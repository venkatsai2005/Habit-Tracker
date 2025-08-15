import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Provide a First Name"],
        },
        username: {
            type: String,
            required: [true, "Please Provide a Username"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Please Provide an Email"],
            unique: true,
        },
        otp: {
            type: String,
            default: null,
        },
        otpExpires: {
            type: Date,
            default: null,
        },
        verifyToken: String,
        verifyTokenExpiry: Date,
        profilePic: {
            type: String,
            default: null,
        },
        preferences: {
            tags: {
                type: [String],
                default: [
                    "Health",
                    "Work",
                    "Personal Development",
                    "Social",
                    "Finance",
                    "Household",
                ],
            },
            morningReminderTime: {
                type: String, // Example: "09:00"
                default: "09:00",
            },
            nightAlertTime: {
                type: String, // Example: "21:00"
                default: "21:00",
            },
        },
    },
    { timestamps: true } // Automatically add `createdAt` and `updatedAt`
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
