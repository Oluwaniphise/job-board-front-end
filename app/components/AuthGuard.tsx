'use client';
import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "../store/useUserStore";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const accessToken = useUserStore((state) => state.accessToken);
  const initialize = useUserStore((state) => state.initialize);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Ensure localStorage is read on client mount so token is available
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!accessToken) {
      const nextParam = pathname ? `?next=${encodeURIComponent(pathname.substring(1))}` : "";
      router.replace(`/auth/login${nextParam}`);
    }
  }, [accessToken, pathname, router]);

  if (!accessToken) {
    return <div className="flex flex-col items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
