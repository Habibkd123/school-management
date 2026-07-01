import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Class from "@/lib/models/Class";
import Teacher from "@/lib/models/Teacher";
import { requireAuth } from "@/lib/utils/auth";

export async function POST(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  try {
    await connectDB();
    const { rows } = await req.json();

    if (!Array.isArray(rows)) {
      return NextResponse.json({ success: false, message: "Invalid payload format. Expected rows array." }, { status: 400 });
    }

    // Load all classes for class name resolving
    const allClasses = await Class.find({ school_id: schoolId }).lean();

    // Load existing employee ids to detect duplicates in DB
    const existingTeachers = await Teacher.find({ school_id: schoolId, employee_id: { $ne: "" } }).select("employee_id").lean();
    const dbEmployeeIds = new Set(existingTeachers.map(t => String(t.employee_id).trim().toLowerCase()));

    const seenEmployeeIds = new Set<string>();
    const validatedRows: any[] = [];

    const getVal = (row: any, keys: string[]) => {
      for (const k of keys) {
        const foundKey = Object.keys(row).find(x => x.toLowerCase().trim() === k.toLowerCase().trim());
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
          return String(row[foundKey]).trim();
        }
      }
      return "";
    };

    const normalizeClassName = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/^class/, "")
        .replace(/^grade/, "")
        .trim();
    };

    const normalizeSectionName = (sec: string): string => {
      return sec
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/^section/, "")
        .trim();
    };

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const errors: string[] = [];

      // Extract values
      const employeeId = getVal(row, ["employee id", "employee_id", "emp id", "id"]);
      const name = getVal(row, ["name", "full name", "teacher name"]);
      const genderRaw = getVal(row, ["gender", "sex"]).toLowerCase();
      const dobRaw = getVal(row, ["dob", "date of birth", "birth date"]);
      const phone = getVal(row, ["phone", "mobile", "primary phone"]);
      const email = getVal(row, ["email", "teacher email"]);
      const address = getVal(row, ["address", "current address"]);
      const subjectSpecialization = getVal(row, ["subject specialization", "subject", "specialization", "subject_specialization"]);
      const qualification = getVal(row, ["qualification", "degree"]);
      const experienceYearsRaw = getVal(row, ["experience years", "experience", "experience_years"]);
      const joinDateRaw = getVal(row, ["join date", "joining date", "join_date"]);
      const assignedClassesRaw = getVal(row, ["assigned classes", "classes", "assigned_classes"]);

      // Field Validations
      if (!name) errors.push("Teacher name is required.");
      if (!employeeId) errors.push("Employee ID is required.");
      if (!subjectSpecialization) errors.push("Subject specialization is required.");

      // Gender Validation
      let resolvedGender: string | undefined = undefined;
      if (genderRaw) {
        if (genderRaw.startsWith("m")) resolvedGender = "male";
        else if (genderRaw.startsWith("f")) resolvedGender = "female";
        else if (genderRaw.startsWith("o")) resolvedGender = "other";
        else errors.push("Gender must be Male, Female, or Other.");
      }

      // DOB & Join Date Validation
      let resolvedDob: string | undefined = undefined;
      if (dobRaw) {
        const d = new Date(dobRaw);
        if (isNaN(d.getTime())) {
          errors.push("Invalid date of birth format (Expected YYYY-MM-DD).");
        } else {
          resolvedDob = d.toISOString().split("T")[0];
        }
      }

      let resolvedJoinDate: string | undefined = undefined;
      if (joinDateRaw) {
        const d = new Date(joinDateRaw);
        if (isNaN(d.getTime())) {
          errors.push("Invalid join date format (Expected YYYY-MM-DD).");
        } else {
          resolvedJoinDate = d.toISOString().split("T")[0];
        }
      }

      // Email Format check
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Invalid email format.");
      }

      // Experience Years check
      let resolvedExpYears = 0;
      if (experienceYearsRaw) {
        const parsed = parseInt(experienceYearsRaw);
        if (isNaN(parsed) || parsed < 0) {
          errors.push("Experience years must be a positive integer number.");
        } else {
          resolvedExpYears = parsed;
        }
      }

      // Unique Employee ID check
      if (employeeId) {
        const normalizedEmp = employeeId.toLowerCase();
        if (dbEmployeeIds.has(normalizedEmp)) {
          errors.push(`Employee ID '${employeeId}' already exists in database.`);
        }
        if (seenEmployeeIds.has(normalizedEmp)) {
          errors.push(`Duplicate Employee ID '${employeeId}' in import file.`);
        } else {
          seenEmployeeIds.add(normalizedEmp);
        }
      }

      // Resolve Assigned Classes (comma-separated, e.g. "Class 10 - A, Class 9 - B")
      const resolvedClassIds: string[] = [];
      const classNamesParsed: string[] = [];
      if (assignedClassesRaw) {
        const parts = assignedClassesRaw.split(",").map((x: string) => x.trim()).filter(Boolean);
        for (const part of parts) {
          const subParts = part.split("-").map((x: string) => x.trim());
          const cName = subParts[0];
          const sName = subParts[1] || "";
          
          const normClassInput = normalizeClassName(cName);
          const normSectionInput = normalizeSectionName(sName);

          const matchedClass = allClasses.find(c => 
            normalizeClassName(c.name) === normClassInput &&
            normalizeSectionName(c.section || "") === normSectionInput
          );

          if (matchedClass) {
            resolvedClassIds.push(String(matchedClass._id));
            classNamesParsed.push(matchedClass.section ? `${matchedClass.name} - ${matchedClass.section}` : matchedClass.name);
          } else {
            const availableList = allClasses
              .map(c => `\n- ${c.name}${c.section ? ` - ${c.section}` : ""}`)
              .join("");
            errors.push(`Assigned class '${part}' not found. Available Classes:${availableList || "\n- None registered yet"}`);
          }
        }
      }

      validatedRows.push({
        index,
        data: {
          employee_id: employeeId,
          name,
          gender: resolvedGender,
          dob: resolvedDob,
          phone: phone || undefined,
          email: email || undefined,
          address: address || undefined,
          subject_specialization: subjectSpecialization,
          qualification: qualification || undefined,
          experience_years: resolvedExpYears,
          join_date: resolvedJoinDate,
          class_ids: resolvedClassIds,
          classNameStr: classNamesParsed.join(", ") || "None",
        },
        errors,
        isValid: errors.length === 0,
      });
    }

    return NextResponse.json({ success: true, data: validatedRows });
  } catch (err: any) {
    console.error("[POST /api/teachers/import/validate]", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to validate records" }, { status: 500 });
  }
}
