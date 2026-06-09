import mongoose, { Document, Model, Schema } from "mongoose";

// ─── Subject ──────────────────────────────────────────────────────
export interface ISubject extends Document {
  school_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  name: string;
  code?: string;
  type: "theory" | "practical" | "both";
  full_marks: number;
  pass_marks: number;
}

const subjectSchema = new Schema<ISubject>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true },
    type: { type: String, enum: ["theory", "practical", "both"], default: "theory" },
    full_marks: { type: Number, default: 100 },
    pass_marks: { type: Number, default: 33 },
  },
  { timestamps: true }
);

subjectSchema.index({ school_id: 1, class_id: 1, name: 1 }, { unique: true });

// ─── Timetable ────────────────────────────────────────────────────
export interface ITimetable extends Document {
  school_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  subject_id: mongoose.Types.ObjectId;
  teacher_id: mongoose.Types.ObjectId;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
  start_time: string;
  end_time: string;
  period_no?: number;
  room?: string;
  academic_year?: string;
}

const timetableSchema = new Schema<ITimetable>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    day: { type: String, enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    period_no: { type: Number },
    room: { type: String, trim: true },
    academic_year: { type: String },
  },
  { timestamps: true }
);

// ─── Attendance ───────────────────────────────────────────────────
const attendanceRecordSchema = new Schema(
  {
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    status: { type: String, enum: ["present", "absent", "late", "half_day", "holiday"], required: true },
    note: { type: String, trim: true, default: null },
  },
  { _id: false }
);

export interface IAttendance extends Document {
  school_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  marked_by: mongoose.Types.ObjectId;
  date: Date;
  type: "student" | "teacher";
  records: Array<{ student_id: mongoose.Types.ObjectId; status: string; note?: string }>;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    marked_by: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["student", "teacher"], default: "student" },
    records: [attendanceRecordSchema],
  },
  { timestamps: true }
);

attendanceSchema.index({ school_id: 1, class_id: 1, date: 1, type: 1 }, { unique: true });

// ─── Homework ─────────────────────────────────────────────────────
export interface IHomework extends Document {
  school_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  subject_id: mongoose.Types.ObjectId;
  teacher_id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assigned_date: Date;
  due_date: Date;
  attachment_url?: string;
}

const homeworkSchema = new Schema<IHomework>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    assigned_date: { type: Date, default: Date.now },
    due_date: { type: Date, required: true },
    attachment_url: { type: String, default: null },
  },
  { timestamps: true }
);

// ─── Notice ───────────────────────────────────────────────────────
export interface INotice extends Document {
  school_id: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
  title: string;
  content: string;
  target_audience: "all" | "students" | "teachers" | "parents" | "staff";
  target_classes?: mongoose.Types.ObjectId[];
  is_published: boolean;
  publish_date: Date;
  expiry_date?: Date;
  attachment_url?: string;
}

const noticeSchema = new Schema<INotice>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    target_audience: { type: String, enum: ["all", "students", "teachers", "parents", "staff"], default: "all" },
    target_classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    is_published: { type: Boolean, default: true },
    publish_date: { type: Date, default: Date.now },
    expiry_date: { type: Date, default: null },
    attachment_url: { type: String, default: null },
  },
  { timestamps: true }
);

// ─── Fees ─────────────────────────────────────────────────────────
export interface IFeesStructure extends Document {
  school_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "half_yearly" | "annually" | "one_time";
  due_day: number;
  late_fee: number;
  academic_year: string;
  is_active: boolean;
}

const feesStructureSchema = new Schema<IFeesStructure>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ["monthly", "quarterly", "half_yearly", "annually", "one_time"], default: "monthly" },
    due_day: { type: Number, min: 1, max: 31, default: 10 },
    late_fee: { type: Number, default: 0 },
    academic_year: { type: String, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export interface IFeePayment extends Document {
  school_id: mongoose.Types.ObjectId;
  student_id: mongoose.Types.ObjectId;
  fee_structure_id: mongoose.Types.ObjectId;
  amount_paid: number;
  discount: number;
  late_fee_charged: number;
  total_amount: number;
  payment_date: Date;
  payment_method: "cash" | "cheque" | "online" | "upi" | "bank_transfer";
  receipt_no: string;
  month?: string;
  status: "paid" | "partial" | "pending" | "overdue";
  collected_by?: mongoose.Types.ObjectId;
  note?: string;
}

const feePaymentSchema = new Schema<IFeePayment>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    fee_structure_id: { type: mongoose.Schema.Types.ObjectId, ref: "FeesStructure", required: true },
    amount_paid: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    late_fee_charged: { type: Number, default: 0 },
    total_amount: { type: Number, required: true },
    payment_date: { type: Date, default: Date.now },
    payment_method: { type: String, enum: ["cash", "cheque", "online", "upi", "bank_transfer"], default: "cash" },
    receipt_no: { type: String, unique: true, trim: true },
    month: { type: String },
    status: { type: String, enum: ["paid", "partial", "pending", "overdue"], default: "paid" },
    collected_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

feePaymentSchema.index({ school_id: 1, student_id: 1, month: 1 });

// ─── Exam & Result ────────────────────────────────────────────────
export interface IExam extends Document {
  school_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  name: string;
  type: "unit_test" | "mid_term" | "pre_board" | "annual" | "other";
  academic_year: string;
  start_date?: Date;
  end_date?: Date;
  is_published: boolean;
}

const examSchema = new Schema<IExam>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["unit_test", "mid_term", "pre_board", "annual", "other"], default: "other" },
    academic_year: { type: String, required: true },
    start_date: { type: Date },
    end_date: { type: Date },
    is_published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export interface IResult extends Document {
  school_id: mongoose.Types.ObjectId;
  exam_id: mongoose.Types.ObjectId;
  student_id: mongoose.Types.ObjectId;
  subject_id: mongoose.Types.ObjectId;
  marks_obtained: number;
  total_marks: number;
  passing_marks?: number;
  grade?: string;
  is_pass?: boolean;
  remarks?: string;
  entered_by?: mongoose.Types.ObjectId;
}

const resultSchema = new Schema<IResult>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    exam_id: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    marks_obtained: { type: Number, required: true, min: 0 },
    total_marks: { type: Number, required: true },
    passing_marks: { type: Number },
    grade: { type: String, trim: true },
    is_pass: { type: Boolean },
    remarks: { type: String, trim: true },
    entered_by: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

resultSchema.index({ school_id: 1, exam_id: 1, student_id: 1, subject_id: 1 }, { unique: true });

// ─── Leave Request ────────────────────────────────────────────────
export interface ILeaveRequest extends Document {
  school_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  leave_type: "sick" | "casual" | "emergency" | "other";
  from_date: Date;
  to_date: Date;
  total_days?: number;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  approved_by?: mongoose.Types.ObjectId;
  approved_at?: Date;
  admin_note?: string;
}

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    leave_type: { type: String, enum: ["sick", "casual", "emergency", "other"], required: true },
    from_date: { type: Date, required: true },
    to_date: { type: Date, required: true },
    total_days: { type: Number },
    reason: { type: String, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approved_at: { type: Date, default: null },
    admin_note: { type: String, trim: true },
  },
  { timestamps: true }
);

// ─── Export all models (with cache check for Next.js hot reload) ──
export const Subject: Model<ISubject> = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
export const Timetable: Model<ITimetable> = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);
export const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
export const Homework: Model<IHomework> = mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);
export const Notice: Model<INotice> = mongoose.models.Notice || mongoose.model("Notice", noticeSchema);
export const FeesStructure: Model<IFeesStructure> = mongoose.models.FeesStructure || mongoose.model("FeesStructure", feesStructureSchema);
export const FeePayment: Model<IFeePayment> = mongoose.models.FeePayment || mongoose.model("FeePayment", feePaymentSchema);
export const Exam: Model<IExam> = mongoose.models.Exam || mongoose.model("Exam", examSchema);
export const Result: Model<IResult> = mongoose.models.Result || mongoose.model("Result", resultSchema);
export const LeaveRequest: Model<ILeaveRequest> = mongoose.models.LeaveRequest || mongoose.model("LeaveRequest", leaveRequestSchema);
