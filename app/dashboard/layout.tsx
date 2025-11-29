"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import AuthGuard from "../components/AuthGuard";
import { useUserStore } from "../store/useUserStore";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navLinkClass =
  "block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors";
const activeNavClass =
  "bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-white";

const normalizePath = (path: string) =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

const isActive = (href: string, pathname: string) =>
  normalizePath(pathname) === normalizePath(href);

const NavLink = ({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) => (
  <Link
    href={href}
    className={`${navLinkClass} ${
      isActive(href, pathname) ? activeNavClass : ""
    }`}
  >
    {label}
  </Link>
);

const EmployerNav = ({ pathname }: { pathname: string }) => (
  <div className="space-y-2">
    <NavLink href="/dashboard" label="Dashboard" pathname={pathname} />
    <NavLink
      href="/dashboard/jobs/create-job"
      label="Create Job"
      pathname={pathname}
    />
    <NavLink
      href="/dashboard/jobs/my-jobs"
      label="My Jobs"
      pathname={pathname}
    />
  </div>
);

const CandidateNav = ({ pathname }: { pathname: string }) => (
  <div className="space-y-2">
    <NavLink href="/dashboard" label="Dashboard" pathname={pathname} />
    <NavLink href="/dashboard/jobs" label="Browse Jobs" pathname={pathname} />
    <NavLink
      href="/dashboard/my-applications"
      label="View Applications"
      pathname={pathname}
    />
  </div>
);

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const nav =
    user?.role?.toLowerCase() === "employer" ? (
      <EmployerNav pathname={pathname} />
    ) : (
      <CandidateNav pathname={pathname} />
    );

  const handleLogout = () => {
    signOut();
    router.replace("/auth/login");
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 p-4 shadow-lg flex flex-col justify-between transform transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-blue-600">J.A.D</h3>
              <button
                type="button"
                className="md:hidden text-gray-600 dark:text-gray-200"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <FiX size={20} />
              </button>
            </div>
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

        <div className="flex-1 flex flex-col">
          <header className="md:hidden flex items-center justify-between px-4 py-3 shadow-sm bg-white dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 dark:text-gray-200"
              aria-label="Open sidebar"
            >
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <div className="w-6" />
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;
