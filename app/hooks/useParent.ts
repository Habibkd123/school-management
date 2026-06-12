import { useState, useEffect } from "react";
import { getAuthHeaders } from "@/lib/utils/session";

import { useAuth } from "@/app/context/auth";

export interface ApiChild {
  _id: string;
  name: string;
  roll_no?: string;
  class_id?: {
    _id: string;
    name: string;
    section: string;
  };
  photo_url?: string;
  gender?: string;
}

export function useParent() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ApiChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "parent") {
      fetchChildren();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchChildren = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/parent/children", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setChildren(data.data);
        if (data.data.length > 0) {
          // Select the first child by default if none is selected yet
          setSelectedChildId((prev) => prev || data.data[0]._id);
        }
      } else {
        setError(data.message || "Failed to fetch children");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedChild = children.find(c => c._id === selectedChildId) || null;

  return {
    children,
    selectedChild,
    selectedChildId,
    setSelectedChildId,
    isLoading,
    error,
    refresh: fetchChildren,
  };
}
