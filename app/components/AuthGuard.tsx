"use client";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "../utils/authUtils";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      const nextParam = pathname
        ? `?next=${encodeURIComponent(pathname.substring(1))}`
        : "";
      router.replace(`/auth/login${nextParam}`);
    }
  }, [pathname]);

  return <>{children}</>;
};

export default AuthGuard;
