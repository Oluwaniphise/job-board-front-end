"use client";

import Link from "next/link";
import { FiBriefcase, FiPlus, FiSearch, FiUser } from "react-icons/fi";
import { useUserStore } from "../store/useUserStore";

const DashboardPage = () => {
  const user = useUserStore((state) => state.user);
  const name =
    user?.firstName || user?.lastName
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.email || "there";
  const role = user?.role?.toLowerCase();

  const ctas =
    role === "employer"
      ? [
          {
            href: "/dashboard/jobs/create-job",
            label: "Post a new job",
            icon: <FiPlus />,
            tone: "primary",
          },
          {
            href: "/dashboard/jobs/my-jobs",
            label: "Manage my jobs",
            icon: <FiBriefcase />,
            tone: "ghost",
          },
        ]
      : [
          {
            href: "/dashboard/jobs",
            label: "Browse jobs",
            icon: <FiSearch />,
            tone: "primary",
          },
          {
            href: "/dashboard/profile",
            label: "Update profile",
            icon: <FiUser />,
            tone: "ghost",
          },
        ];

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {name}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {role === "employer"
            ? "Let’s find the right talent for your openings."
            : "Explore new opportunities tailored for you."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {ctas.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                cta.tone === "primary"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {cta.icon}
              {cta.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 rounded-xl bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-50 border border-blue-100 dark:border-blue-800">
          <p className="text-sm font-medium">Quick Tip</p>
          <p className="text-sm mt-1">
            Keep your profile updated so employers can spot your strengths.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-green-50 text-green-900 dark:bg-green-900/30 dark:text-green-50 border border-green-100 dark:border-green-800">
          <p className="text-sm font-medium">Pro Insight</p>
          <p className="text-sm mt-1">
            Clear job titles and salary ranges attract more qualified candidates.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-purple-50 text-purple-900 dark:bg-purple-900/30 dark:text-purple-50 border border-purple-100 dark:border-purple-800">
          <p className="text-sm font-medium">What’s Next</p>
          <p className="text-sm mt-1">
            {role === "employer"
              ? "Review applicants quickly to keep interest high."
              : "Tailor your resume to each application for better response rates."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
