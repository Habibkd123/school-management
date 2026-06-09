import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITeacher extends Document {
  school_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  name: string;
  employee_id?: string;
  gender?: "male" | "female" | "other";
  dob?: Date;
  phone?: string;
  email?: string;
  address?: string;
  photo_url?: string;
  blood_group?: string;
  qualification?: string;
  subject_specialization?: string;
  experience_years: number;
  join_date: Date;
  is_active: boolean;
}

const teacherSchema = new Schema<ITeacher>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    employee_id: { type: String, trim: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: { type: Date },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: { type: String, trim: true },
    photo_url: { type: String, default: null },
    blood_group: { type: String, trim: true },
    qualification: { type: String, trim: true },
    subject_specialization: { type: String, trim: true },
    experience_years: { type: Number, default: 0 },
    join_date: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teacherSchema.index({ school_id: 1, employee_id: 1 }, { unique: true, sparse: true });

const Teacher: Model<ITeacher> =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", teacherSchema);

export default Teacher;
