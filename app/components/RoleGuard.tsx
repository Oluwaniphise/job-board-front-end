'use client';

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/useUserStore";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  redirectTo?: string;
}

const RoleGuard = ({ allowedRoles, children, redirectTo = "/dashboard" }: RoleGuardProps) => {
  const router = useRouter();
  const initialize = useUserStore((state) => state.initialize);
  const role = useUserStore((state) => state.user?.role?.toLowerCase());

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (role && !allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
      router.replace(redirectTo);
    }
  }, [allowedRoles, redirectTo, role, router]);

  // if (!role || !allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
  //   return <div>Redirecting...</div>;
  // }

  return <>{children}</>;
};

export default RoleGuard;
