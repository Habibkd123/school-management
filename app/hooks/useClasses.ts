"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthHeaders } from "@/lib/utils/session";

// ─── Types ────────────────────────────────────────────────────────
export interface ApiClass {
  _id: string;
  name: string;
  section: string;
  academic_year: string;
  capacity: number;
  class_teacher_id?: { _id: string; name: string; email: string } | null;
  school_id: string;
  createdAt: string;
}

export interface ClassFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── useClasses — list + CRUD ─────────────────────────────────────
export function useClasses(initialFilters: ClassFilters = {}) {
  const [classes, setClasses]     = useState<ApiClass[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [filters, setFilters]     = useState<ClassFilters>({ page: 1, limit: 50, ...initialFilters });

  // ─── Fetch classes ─────────────────────────────────────────────
  const fetchClasses = useCallback(async (f: ClassFilters = filters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (f.search) params.set("search", f.search);
      params.set("page",  String(f.page  || 1));
      params.set("limit", String(f.limit || 50));

      const res  = await fetch(`/api/classes?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load classes");
        return;
      }

      setClasses(data.data.classes);
      setPagination(data.data.pagination);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchClasses(filters);
  }, [filters]);

  // ─── Add class ─────────────────────────────────────────────────
  const addClass = async (
    classData: { name: string; section: string; academic_year: string; capacity: number }
  ): Promise<{ success: boolean; message: string; class?: ApiClass }> => {
    try {
      const res  = await fetch("/api/classes", {
        method:  "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body:    JSON.stringify(classData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to add class" };

      await fetchClasses(filters);
      return { success: true, message: data.message, class: data.data.class };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Update class ──────────────────────────────────────────────
  const updateClass = async (
    id: string,
    updates: Partial<{ name: string; section: string; academic_year: string; capacity: number }>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res  = await fetch(`/api/classes/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body:    JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to update class" };

      // Update locally for instant UI feedback
      setClasses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...data.data.class } : c))
      );
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Delete class ──────────────────────────────────────────────
  const deleteClass = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res  = await fetch(`/api/classes/${id}`, {
        method:  "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed to delete class" };

      setClasses((prev) => prev.filter((c) => c._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Network error" };
    }
  };

  // ─── Update filters (triggers refetch) ────────────────────────
  const updateFilters = (newFilters: Partial<ClassFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
  };

  return {
    classes,
    pagination,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch: () => fetchClasses(filters),
    addClass,
    updateClass,
    deleteClass,
  };
}
