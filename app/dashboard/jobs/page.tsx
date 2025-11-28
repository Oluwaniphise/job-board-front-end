/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiPlusCircle } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/app/store/useUserStore";
import JobCard from "../components/jobs/JobCard";
import jobService from "@/app/services/jobs.service";
import { Job } from "./interfaces/job.interface";
import { Skeleton } from "@/components/ui/skeleton";

interface JobsResponse {
  data: Job[];
}

const JobListPage: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const userId = useUserStore((state) => state.user?.id || "");
  const initialize = useUserStore((state) => state.initialize);
  const [jobsList, setJobsList] = useState<Job[]>([]);

  const {
    data: jobs,
    isPending,
    isSuccess,
    error,
    isError: isJobsError,
  } = useQuery<JobsResponse>({
    queryKey: ["dashboard-jobs"],
    queryFn: async () => jobService.getJobs(""),
  });

  useEffect(() => {
    initialize();
    setHydrated(true);
  }, [initialize]);

  useEffect(() => {
    if (isSuccess) {
      setJobsList(jobs.data);
    } else {
      setJobsList([]);
    }
  }, [jobs, isSuccess, isJobsError, isPending]);

  if (hydrated && !userId) {
    return (
      <p className="text-red-500 dark:text-red-400">
        Error: User not identified. Please log in.
      </p>
    );
  }

  if (isPending) {
    // Render a skeleton grid during loading
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4"
          >
            <Skeleton className="h-6 w-3/4" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50 flex space-x-3">
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- Error State (Reused) ---
  if (isJobsError) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 rounded-md">
        <p className="font-bold">Error fetching jobs:</p>
        <p>{error?.message}</p>
      </div>
    );
  }

  if (!jobsList || jobsList.length === 0) {
    return (
      <div className="text-center p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <FiPlusCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          No job postings yet
        </h3>
        {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new job opening for candidates to see.
        </p> */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Job Listings ({jobsList.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobsList.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobListPage;
