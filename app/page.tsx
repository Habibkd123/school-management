"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        {/* Loading Spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-50 dark:border-t-transparent animate-spin" />
        <span className="text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase animate-pulse">
          Entering ERP Portal...
        </span>
      </div>
    </div>
  );
}
