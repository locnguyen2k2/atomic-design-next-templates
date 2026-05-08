"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores";

const publicPaths = ["/login", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const { currentOrg, setCurrentOrg } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  const performCheck = useCallback(async () => {
    await checkAuth();
    setIsInitialized(true);
  }, [checkAuth]);

  useEffect(() => {
    performCheck();
  }, [performCheck]);

  useEffect(() => {
    if (!isInitialized) return;

    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    if (!isAuthenticated && !isPublicPath) {
      router.push("/login");
    } else if (isAuthenticated && isPublicPath) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isInitialized, pathname, router]);

  if (!isInitialized || (isLoading && !isAuthenticated)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-text-muted animate-pulse font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
