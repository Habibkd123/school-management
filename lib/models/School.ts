import mongoose, { Document, Model, Schema } from "mongoose";

// ─── School Interface ──────────────────────────────────────────────
export interface ISchool extends Document {
  name: string;
  slug: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  email?: string;
  timezone: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: [true, "School name is required"], trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo_url: { type: String, default: null },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    timezone: { type: String, default: "Asia/Kolkata" },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const School: Model<ISchool> =
  mongoose.models.School || mongoose.model<ISchool>("School", schoolSchema);

export default School;
