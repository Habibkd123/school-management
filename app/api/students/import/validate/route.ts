import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Class from "@/lib/models/Class";
import Student from "@/lib/models/Student";
import { requireAuth } from "@/lib/utils/auth";

export async function POST(req: NextRequest) {
  const { schoolId, error } = requireAuth(req, ["school_admin", "super_admin"]);
  if (error) return error;

  try {
    await connectDB();
    const { rows } = await req.json();

    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload format. Expected rows array." },
        { status: 400 }
      );
    }

    // Load all classes for in-memory lookup
    const allClasses = await Class.find({ school_id: schoolId }).lean();

    // Load existing admission numbers to detect duplicates in DB
    const existingStudents = await Student.find(
      { school_id: schoolId, admission_no: { $ne: "" } }
    ).select("admission_no").lean();
    const dbAdmissionNos = new Set(
      existingStudents.map(s => String(s.admission_no).trim().toLowerCase())
    );

    const seenAdmissionNos = new Set<string>();
    const validatedRows: any[] = [];

    // ── Helper: extract a value using multiple key aliases ──────────
    const getVal = (row: any, keys: string[]) => {
      for (const k of keys) {
        const foundKey = Object.keys(row).find(
          x => x.toLowerCase().trim() === k.toLowerCase().trim()
        );
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
          return String(row[foundKey]).trim();
        }
      }
      return "";
    };

    // ── Normalisers ──────────────────────────────────────────────────
    /**
     * Strip common prefixes ("class", "grade") and whitespace so that
     * "Class 10", "Grade 10", "10" and "class10" all collapse to "10".
     */
    const normalizeClassName = (name: string): string =>
      name
        .toLowerCase()
        .replace(/\s+/g, "")          // collapse all whitespace
        .replace(/^class/, "")         // remove leading "class"
        .replace(/^grade/, "")         // remove leading "grade"
        .trim();

    /**
     * Strip common prefix ("section") and whitespace so that
     * "Section A", "A" and "a" all collapse to "a".
     */
    const normalizeSectionName = (sec: string): string =>
      sec
        .toLowerCase()
        .replace(/\s+/g, "")          // collapse all whitespace
        .replace(/^section/, "")       // remove leading "section"
        .trim();

    // Pre-compute normalised DB class names once for performance
    const normalisedDbClasses = allClasses.map(c => ({
      _id: c._id,
      name: c.name,
      section: c.section || "",
      normName: normalizeClassName(c.name),
      normSection: normalizeSectionName(c.section || ""),
    }));

    // Human-readable list of available classes (for error messages)
    const availableClassList = allClasses
      .map(c => `  • ${c.name}${c.section ? ` (Section ${c.section})` : ""}`)
      .join("\n") || "  • No classes registered yet";

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const errors: string[] = [];

      // ── Extract values ─────────────────────────────────────────────
      let name = getVal(row, ["name", "full name", "student name"]);
      const firstName = getVal(row, ["first name", "firstname"]);
      const lastName = getVal(row, ["last name", "lastname"]);
      if (!name && firstName) name = `${firstName} ${lastName}`.trim();

      const admissionNo  = getVal(row, ["admission no", "admission number", "admission_no", "adm no"]);
      const rollNo       = getVal(row, ["roll no", "roll number", "roll_no", "roll"]);
      const className    = getVal(row, ["class", "grade"]);
      const section      = getVal(row, ["section"]);
      const genderRaw    = getVal(row, ["gender", "sex"]).toLowerCase();
      const dobRaw       = getVal(row, ["dob", "date of birth", "birth date"]);
      const phone        = getVal(row, ["phone", "mobile", "primary phone", "student phone"]);
      const email        = getVal(row, ["email", "student email"]);
      const address      = getVal(row, ["address", "current address"]);
      const guardianName = getVal(row, ["guardian name", "parent name", "guardian_name"]);
      const guardianPhone= getVal(row, ["guardian phone", "parent phone", "guardian_phone"]);
      const guardianEmail= getVal(row, ["guardian email", "parent email", "guardian_email"]);
      const guardianRelation = getVal(row, ["guardian relation", "parent relation", "guardian_relation"]);
      const academicYear = getVal(row, ["academic year", "academic_year", "year"]);
      const aadhaarNo    = getVal(row, ["aadhaar", "aadhaar no", "aadhaar number", "aadhaar_no"]);

      // ── Required field checks ──────────────────────────────────────
      if (!name)            errors.push("Student name is required.");
      if (!admissionNo)     errors.push("Admission number is required.");
      if (!className)       errors.push("Class name is required.");
      if (!guardianName)    errors.push("Guardian name is required.");
      if (!guardianPhone)   errors.push("Guardian phone number is required.");
      if (!guardianRelation)errors.push("Guardian relation is required.");
      if (!academicYear)    errors.push("Academic year is required.");

      // ── Gender ─────────────────────────────────────────────────────
      let resolvedGender: string | undefined;
      if (genderRaw) {
        if (genderRaw.startsWith("m"))      resolvedGender = "male";
        else if (genderRaw.startsWith("f")) resolvedGender = "female";
        else if (genderRaw.startsWith("o")) resolvedGender = "other";
        else errors.push("Gender must be Male, Female, or Other.");
      }

      // ── DOB ────────────────────────────────────────────────────────
      let resolvedDob: string | undefined;
      if (dobRaw) {
        const d = new Date(dobRaw);
        if (isNaN(d.getTime())) {
          errors.push("Invalid date of birth format (Expected YYYY-MM-DD).");
        } else {
          resolvedDob = d.toISOString().split("T")[0];
        }
      }

      // ── Email format ───────────────────────────────────────────────
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.push("Invalid student email format.");
      if (guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardianEmail))
        errors.push("Invalid guardian email format.");

      // ── Admission number uniqueness ────────────────────────────────
      if (admissionNo) {
        const normalizedAdm = admissionNo.toLowerCase();
        if (dbAdmissionNos.has(normalizedAdm))
          errors.push(`Admission number '${admissionNo}' already exists in database.`);
        if (seenAdmissionNos.has(normalizedAdm))
          errors.push(`Duplicate admission number '${admissionNo}' in import file.`);
        else
          seenAdmissionNos.add(normalizedAdm);
      }

      // ── Class + Section resolution ─────────────────────────────────
      let resolvedClassId = "";
      if (className) {
        const normClassInput   = normalizeClassName(className);
        const normSectionInput = normalizeSectionName(section);

        // Try full match (class name + section)
        const matched = normalisedDbClasses.find(
          c => c.normName === normClassInput && c.normSection === normSectionInput
        );

        if (matched) {
          resolvedClassId = String(matched._id);
        } else {
          // Check whether any DB class matches the name alone
          const classNameMatches = normalisedDbClasses.filter(
            c => c.normName === normClassInput
          );

          if (classNameMatches.length > 0 && section) {
            // Name matched but section didn't
            const availableSections = classNameMatches
              .map(c => `  • ${c.name}${c.section ? ` — Section ${c.section}` : " (no section)"}`)
              .join("\n");
            errors.push(
              `Class '${className}' found, but Section '${section}' does not match. ` +
              `Available sections for this class:\n${availableSections}`
            );
          } else if (classNameMatches.length > 0 && !section) {
            // Name matched but the DB has sectioned entries and user gave no section
            const availableSections = classNameMatches
              .map(c => `  • ${c.section || "(no section)"}`)
              .join("\n");
            errors.push(
              `Class '${className}' requires a Section because sections are configured. ` +
              `Available sections:\n${availableSections}`
            );
          } else {
            // Class name not found at all
            errors.push(
              `Class '${className}'${section ? ` with Section '${section}'` : ""} not found in system.\n` +
              `Available classes:\n${availableClassList}`
            );
          }
        }
      }

      validatedRows.push({
        index,
        data: {
          name,
          admission_no: admissionNo,
          roll_no: rollNo || undefined,
          class_id: resolvedClassId || undefined,
          classNameStr: section ? `${className} — ${section}` : className,
          gender: resolvedGender,
          dob: resolvedDob,
          phone: phone || undefined,
          email: email || undefined,
          address: address || undefined,
          guardian_name: guardianName,
          guardian_phone: guardianPhone,
          guardian_email: guardianEmail || undefined,
          guardian_relation: guardianRelation,
          academic_year: academicYear,
          aadhaar_no: aadhaarNo || undefined,
        },
        errors,
        isValid: errors.length === 0,
      });
    }

    return NextResponse.json({ success: true, data: validatedRows });
  } catch (err: any) {
    console.error("[POST /api/students/import/validate]", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to validate records" },
      { status: 500 }
    );
  }
}
