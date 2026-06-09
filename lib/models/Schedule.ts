import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISchedule extends Document {
  school_id: mongoose.Types.ObjectId;
  class_id?: mongoose.Types.ObjectId;
  type: "Class" | "Exam" | "Event" | "Break";
  title?: string;
  start_time: string; // e.g. "09:30 AM"
  end_time: string;   // e.g. "10:30 AM"
  day_of_week?: string; // e.g. "Monday"
  is_active: boolean;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    school_id:   { type: mongoose.Schema.Types.ObjectId, ref: "School",  required: true, index: true },
    class_id:    { type: mongoose.Schema.Types.ObjectId, ref: "Class",   default: null  },
    type:        { type: String, enum: ["Class", "Exam", "Event", "Break"], default: "Class" },
    title:       { type: String, trim: true, default: "" },
    start_time:  { type: String, required: true, trim: true },
    end_time:    { type: String, required: true, trim: true },
    day_of_week: { type: String, trim: true, default: "" },
    is_active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

scheduleSchema.index({ school_id: 1, is_active: 1 });

const Schedule: Model<ISchedule> =
  mongoose.models.Schedule || mongoose.model<ISchedule>("Schedule", scheduleSchema);

export default Schedule;
