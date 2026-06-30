"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthHeaders, useAuthReady } from "@/lib/utils/session";

export interface ApiClassGroup {
  _id: string;
  school_id: string;
  name: string;
  academic_year: string;
  classes: Array<{
    class_id: { _id: string; name: string; class_code?: string } | string;
    stream_id?: { _id: string; name: string } | string | null;
    section_id?: { _id: string; name: string } | string | null;
  }>;
  sub_groups?: Array<ApiClassGroup | string>;
  status: "Active" | "Inactive";
  createdAt?: string;
}

let _groupsCache: ApiClassGroup[] | null = null;
let _cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000;
const _listeners = new Set<(s: ApiClassGroup[]) => void>();

function invalidateCache() { _groupsCache = null; _cacheTimestamp = 0; }

export function useClassGroups(options?: { skip?: boolean; academicYear?: string }) {
  const [groups, setGroups] = useState<ApiClassGroup[]>(_groupsCache ?? []);
  const [isLoading, setIsLoading] = useState(_groupsCache === null);
  const [error, setError] = useState<string | null>(null);
  const authReady = useAuthReady();

  useEffect(() => {
    const listener = (data: ApiClassGroup[]) => setGroups(data);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  const fetchGroups = useCallback(async (params: { academic_year?: string } = {}) => {
    setIsLoading(true); setError(null);
    try {
      const qs = new URLSearchParams();
      if (params.academic_year) qs.set("academic_year", params.academic_year);

      const res = await fetch(`/api/class-groups?${qs}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch class groups");

      _groupsCache = data.data.groups;
      _cacheTimestamp = Date.now();
      _listeners.forEach(fn => fn(data.data.groups));
      setGroups(data.data.groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load class groups");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options?.skip || !authReady) return;
    fetchGroups({ academic_year: options?.academicYear });
  }, [fetchGroups, options?.skip, options?.academicYear, authReady]);

  const createGroup = async (input: {
    name: string;
    academic_year: string;
    classes: Array<{
      class_id: string;
      stream_id?: string | null;
      section_id?: string | null;
    }>;
    sub_groups?: string[];
  }) => {
    try {
      const res = await fetch("/api/class-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
      invalidateCache();
      fetchGroups({ academic_year: input.academic_year });
      return { success: true, message: "Class Group created", data: data.data };
    } catch { return { success: false, message: "Network error" }; }
  };

  const deleteGroup = async (id: string, academicYear?: string) => {
    try {
      const res = await fetch(`/api/class-groups/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
      invalidateCache();
      fetchGroups({ academic_year: academicYear });
      return { success: true, message: "Class Group deleted" };
    } catch { return { success: false, message: "Network error" }; }
  };

  return { groups, isLoading, error, fetchGroups, createGroup, deleteGroup };
}
