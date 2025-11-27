"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "../components/AuthGuard";
import { useUserStore } from "../store/useUserStore";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navLinkClass =
  "block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors";

const EmployerNav = () => (
  <div className="space-y-2">
    <Link href="/dashboard/jobs/create-job" className={navLinkClass}>
      Create Job
    </Link>
    <Link href="/dashboard/jobs/my-jobs" className={navLinkClass}>
      My Jobs
    </Link>
    <Link href="/dashboard/jobs" className={navLinkClass}>
      Applications
    </Link>
  </div>
);

const CandidateNav = () => (
  <div className="space-y-2">
    <Link href="/dashboard/jobs" className={navLinkClass}>
      Browse Jobs
    </Link>
    <Link href="/dashboard/jobs" className={navLinkClass}>
      View Applications
    </Link>
  </div>
);

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useUserStore();
  const router = useRouter();
  const nav =
    user?.role?.toLowerCase() === "employer" ? (
      <EmployerNav />
    ) : (
      <CandidateNav />
    );

  const handleLogout = () => {
    signOut();
    router.replace("/auth/login");
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-600">Dashboard</h3>
            <nav className="space-y-2">{nav}</nav>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full px-3 py-2 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors"
          >
            Logout
          </button>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
