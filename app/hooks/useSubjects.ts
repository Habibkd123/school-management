"use client";
import { useState, useEffect, useCallback } from "react";
import { getAuthHeaders } from "@/lib/utils/session";

export interface ApiSubject {
  _id: string;
  name: string;
  code?: string;
  type: "theory" | "practical" | "both";
  class_id: string;
  full_marks: number;
  pass_marks: number;
  createdAt: string;
}

export function useSubjects(classId?: string) {
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = classId ? `?class_id=${classId}` : "";
      const res = await fetch(`/api/subjects${params}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setSubjects(data.data.subjects);
    } catch (e) {
      console.error("useSubjects fetch error", e);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { fetchSubjects(); }, [fetchSubjects]);

  const createSubject = useCallback(async (payload: Partial<ApiSubject> & { type?: string }) => {
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) await fetchSubjects();
    return data;
  }, [fetchSubjects]);

  const updateSubject = useCallback(async (id: string, payload: Partial<ApiSubject> & { type?: string }) => {
    const res = await fetch(`/api/subjects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) await fetchSubjects();
    return data;
  }, [fetchSubjects]);

  const deleteSubject = useCallback(async (id: string) => {
    const res = await fetch(`/api/subjects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.success) await fetchSubjects();
    return data;
  }, [fetchSubjects]);

  return { subjects, loading, fetchSubjects, createSubject, updateSubject, deleteSubject };
}
