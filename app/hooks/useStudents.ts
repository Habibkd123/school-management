"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthHeaders } from "@/lib/utils/session";

// ─── Types ────────────────────────────────────────────────────────
export interface ApiStudent {
  _id: string;
  name: string;
  roll_no?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  blood_group?: string;
  address?: string;
  phone?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_relation?: string;
  guardian_email?: string;
  admission_date: string;
  admission_no?: string;
  academic_year?: string;
  is_active: boolean;
  photo_url?: string;
  class_id: { _id: string; name: string; section?: string } | string;
  school_id: string;
  createdAt: string;
}

export interface StudentFilters {
  search?: string;
  class_id?: string;
  is_active?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── useStudents — list + CRUD ────────────────────────────────────
export function useStudents(initialFilters: StudentFilters = {}) {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentFilters>({ page: 1, limit: 20, ...initialFilters });

  // ─── Fetch students ───────────────────────────────────────────
  const fetchStudents = useCallback(async (f: StudentFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f.search) params.set("search", f.search);
      if (f.class_id) params.set("class_id", f.class_id);
      if (f.is_active !== undefined && f.is_active !== "") params.set("is_active", f.is_active);
      params.set("page", String(f.page || 1));
      params.set("limit", String(f.limit || 20));

      const res = await fetch(`/api/students?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load students");
        return;
      }

      setStudents(data.data.students);
      setPagination(data.data.pagination);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStudents(filters);
  }, [filters]);

  // ─── Add student ──────────────────────────────────────────────
  const addStudent = async (studentData: Partial<ApiStudent>): Promise<{ success: boolean; message: string; student?: ApiStudent }> => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(studentData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to add student" };

      // Refresh list
      await fetchStudents(filters);
      return { success: true, message: data.message, student: data.data.student };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Update student ───────────────────────────────────────────
  const updateStudent = async (id: string, updates: Partial<ApiStudent>): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to update student" };

      // Update locally
      setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, ...data.data.student } : s)));
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Delete (soft) student ────────────────────────────────────
  const deleteStudent = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to delete student" };

      // Remove from list
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Update filters (triggers refetch) ───────────────────────
  const updateFilters = (newFilters: Partial<StudentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
  };

  return {
    students,
    pagination,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch: () => fetchStudents(filters),
    addStudent,
    updateStudent,
    deleteStudent,
  };
}
