import mongoose, { Document, Model, Schema } from "mongoose";

export interface IStudent extends Document {
  school_id: mongoose.Types.ObjectId;
  user_id?: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  name: string;
  roll_no?: string;
  gender?: "male" | "female" | "other";
  dob?: Date;
  blood_group?: string;
  photo_url?: string;
  address?: string;
  phone?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_relation?: string;
  guardian_email?: string;
  admission_date: Date;
  admission_no?: string;
  academic_year?: string;
  is_active: boolean;
}

const studentSchema = new Schema<IStudent>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    name: { type: String, required: true, trim: true },
    roll_no: { type: String, trim: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: { type: Date },
    blood_group: { type: String, trim: true },
    photo_url: { type: String, default: null },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    guardian_name: { type: String, trim: true },
    guardian_phone: { type: String, trim: true },
    guardian_relation: { type: String, trim: true },
    guardian_email: { type: String, lowercase: true, trim: true },
    admission_date: { type: Date, default: Date.now },
    admission_no: { type: String, trim: true },
    academic_year: { type: String },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

studentSchema.index({ school_id: 1, class_id: 1, roll_no: 1 }, { unique: true, sparse: true });

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);

export default Student;
