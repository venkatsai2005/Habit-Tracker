import mongoose from "mongoose";
import User from "./userModel";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Habit name is required"],
      maxlength: 100,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      validate: {
        validator: async function (value) {
          const user = await User.findById(this.userId);
          if (user && user.preferences.tags.includes(value)) {
            return true;
          }
          return false;
        },
        message: "Invalid category. Ensure the category matches your preferences.",
      },
    },
    recurrence: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      default: "Daily",
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    streakMaintained: {
      type: Boolean,
      default: false,
    },
    progressUpdatedDate: {
      type: Date,
      default: null,
    },
    updateTime: {
      type: Date,
      default: null,
    },
    resetTime: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

function calculateTimes(recurrence) {
  const now = new Date();
  const updateTime = new Date();
  const resetTime = new Date();

  switch (recurrence) {
    case "Daily":
      updateTime.setDate(now.getDate() + 1);
      resetTime.setDate(now.getDate() + 1);
      resetTime.setHours(23, 59, 59, 999); // End of the next day
      break;
    case "Weekly":
      updateTime.setDate(now.getDate() + 7);
      resetTime.setDate(now.getDate() + 7);
      resetTime.setHours(23, 59, 59, 999);
      break;
    case "Monthly":
      updateTime.setMonth(now.getMonth() + 1);
      resetTime.setMonth(now.getMonth() + 1);
      resetTime.setDate(new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate()); // Last day of next month
      resetTime.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error("Invalid recurrence type");
  }

  return { updateTime, resetTime };
}


habitSchema.methods.updateProgress = function () {
  const now = new Date();

  if (this.isCompleted) {
    throw new Error("Cannot update a completed habit.");
  }

  if (this.progressUpdatedDate) {
    const lastUpdateDate = this.progressUpdatedDate;
    if (
      now.getDate() === lastUpdateDate.getDate() &&
      now.getMonth() === lastUpdateDate.getMonth() &&
      now.getFullYear() === lastUpdateDate.getFullYear()
    ) {
      throw new Error("Progress can only be updated on the next day.");
    }
  }

  this.streakCount += 1;
  this.streakMaintained = true;
  this.progressUpdatedDate = now;

  const times = calculateTimes(this.recurrence);
  this.updateTime = times.updateTime;
  this.resetTime = times.resetTime;
};


habitSchema.methods.completeHabit = function () {
  this.isCompleted = true;
  this.endDate = new Date();
};

const Habit = mongoose.models.Habit || mongoose.model("Habit", habitSchema);
export default Habit;
