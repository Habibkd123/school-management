"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthHeaders } from "@/lib/utils/session";

// ─── Types ────────────────────────────────────────────────────────
export interface ApiClass {
  _id: string;
  school_id: string;
  name: string;
  section: string;
  academic_year: string;
  class_teacher_id?: { _id: string; name: string; employee_id?: string } | null;
  capacity: number;
  createdAt?: string;
}

export interface CreateClassInput {
  name: string;
  section?: string;
  academic_year: string;
  class_teacher_id?: string;
  capacity?: number;
}

export interface FetchClassesParams {
  search?: string;
  academic_year?: string;
  section?: string;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useClasses() {
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Fetch all classes ──────────────────────────────────────────
  const fetchClasses = useCallback(async (params: FetchClassesParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (params.search)        qs.set("search", params.search);
      if (params.academic_year) qs.set("academic_year", params.academic_year);
      if (params.section)       qs.set("section", params.section);
      if (params.sort)          qs.set("sort", params.sort);
      if (params.page)          qs.set("page", String(params.page));
      if (params.limit)         qs.set("limit", String(params.limit));

      const res = await fetch(`/api/classes?${qs.toString()}`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch");
      setClasses(data.data.classes);
      setTotal(data.data.total ?? data.data.classes.length);
      setTotalPages(data.data.totalPages ?? 1);
      setCurrentPage(data.data.page ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses({ limit: 1000 });
  }, [fetchClasses]);

  // ─── Create class ───────────────────────────────────────────────
  const createClass = async (
    input: CreateClassInput
  ): Promise<{ success: boolean; message: string; data?: ApiClass }> => {
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to create" };

      setClasses((prev) => [...prev, data.data].sort((a, b) =>
        a.name.localeCompare(b.name) || a.section.localeCompare(b.section)
      ));
      return { success: true, message: "Class created successfully", data: data.data };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Update class ───────────────────────────────────────────────
  const updateClass = async (
    id: string,
    input: Partial<CreateClassInput>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to update" };

      setClasses((prev) => prev.map((c) => (c._id === id ? data.data : c)));
      return { success: true, message: "Class updated successfully" };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Delete class ───────────────────────────────────────────────
  const deleteClass = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/classes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to delete" };

      setClasses((prev) => prev.filter((c) => c._id !== id));
      return { success: true, message: "Class deleted successfully" };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Get single class ───────────────────────────────────────────
  const getClass = async (id: string): Promise<ApiClass | null> => {
    try {
      const res = await fetch(`/api/classes/${id}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok || !data.success) return null;
      return data.data;
    } catch {
      return null;
    }
  };

  return {
    classes,
    isLoading,
    error,
    total,
    totalPages,
    currentPage,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    getClass,
  };
}
