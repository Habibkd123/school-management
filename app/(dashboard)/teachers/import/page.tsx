"use client";

import React from "react";
import BulkImport from "@/app/components/BulkImport";

const sampleHeaders = [
  "Employee ID*",
  "Full Name*",
  "Gender",
  "DOB",
  "Phone",
  "Email",
  "Address",
  "Subject Specialization*",
  "Qualification",
  "Experience Years",
  "Join Date",
  "Assigned Classes"
];

const sampleData = [
  [
    "EMP001", "Karan Malhotra", "Male", "1985-04-10", "9876543230",
    "karan.malhotra@gmail.com", "789 Pine Ave, Bangalore", "Mathematics", "M.Sc, B.Ed",
    "8", "2018-06-01", "Class 10 - A, Class 9 - B"
  ],
  [
    "EMP002", "Priya Sen", "Female", "1990-12-15", "9876543240",
    "priya.sen@gmail.com", "321 Elm Rd, Kolkata", "Science", "B.Tech, M.Ed",
    "5", "2020-09-10", "Class 10 - B"
  ]
];

export default function TeacherImportPage() {
  return (
    <BulkImport
      module="teachers"
      title="Bulk Import Faculty"
      sampleHeaders={sampleHeaders}
      sampleData={sampleData}
      validateUrl="/api/teachers/import/validate"
      importUrl="/api/teachers/import"
      backUrl="/teachers"
    />
  );
}
