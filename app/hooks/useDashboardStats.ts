"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAuthHeaders, useAuthReady } from "@/lib/utils/session";

export interface DashboardStats {
  students: { total: number; active: number; inactive: number };
  teachers: { total: number; active: number; inactive: number };
  classes:  { total: number };
  subjects: { total: number };
  attendance: {
    total: number;
    present: number;
    absent: number;
    late: number;
    leave: number;
    percentage: number | null;
    marked: boolean;
  };
}

interface UseDashboardStatsOptions {
  skip?: boolean;
  /** Polling interval in ms. Default: 60 000 (1 min). Pass 0 to disable. */
  pollInterval?: number;
}

export function useDashboardStats(opts: UseDashboardStatsOptions = {}) {
  const { skip = false, pollInterval = 60_000 } = opts;

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const authReady = useAuthReady();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/dashboard/stats", {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch");
      setStats(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch once auth is ready
  useEffect(() => {
    if (skip || !authReady) return;
    fetchStats();
  }, [skip, authReady, fetchStats]);

  // Polling for auto-update
  useEffect(() => {
    if (skip || !authReady || pollInterval <= 0) return;
    intervalRef.current = setInterval(fetchStats, pollInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [skip, authReady, pollInterval, fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}
