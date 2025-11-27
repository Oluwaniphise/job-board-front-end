/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/app/store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import JobCard from "../../components/jobs/JobCard";
import jobService from "@/app/services/jobs.service";
import RoleGuard from "@/app/components/RoleGuard";
import { FiPlus, FiPlusCircle } from "react-icons/fi";

const JobListEmployer: React.FC = () => {
  const userId = useUserStore((state) => state.user?.id || "");
  const [jobsList, setJobsList] = useState([]);

  const {
    data: jobs,
    isPending,
    isSuccess,
    error,
    refetch,
    isError: isJobsError,
  } = useQuery({
    queryKey: ["dashboard-jobs"],
    queryFn: async () => jobService.getJobs(""),
  });

  useEffect(() => {
    if (isSuccess) {
      setJobsList(jobs.data);
    } else {
      setJobsList([]);
    }
  }, [jobs, isSuccess, isJobsError, isPending]);

  let content;

  if (!userId) {
    content = (
      <p className="text-red-500 dark:text-red-400">
        Error: User not identified. Please log in.
      </p>
    );
  } else if (isPending) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4 animate-pulse"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50 flex space-x-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  } else if (isJobsError) {
    content = (
      <div className="p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 rounded-md">
        <p className="font-bold">Error fetching jobs:</p>
        <p>{error.message}</p>
      </div>
    );
  } else if (!jobsList || jobsList.length === 0) {
    content = (
      <div className="text-center p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <FiPlusCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />

        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          No job postings yet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new job opening for candidates to see.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/jobs/create-job"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Create New Job
          </Link>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Job Postings ({jobsList.length})
          </h2>
          <Link
            href="/dashboard/jobs/create-job"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
          >
            Create Job
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsList.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    );
  }

  return <RoleGuard allowedRoles={["employer"]}>{content}</RoleGuard>;
};

export default JobListEmployer;
