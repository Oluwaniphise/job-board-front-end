"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiFileText,
  FiLoader,
  FiMapPin,
  FiRefreshCcw,
} from "react-icons/fi";
import candidateService from "@/app/services/candidate.service";
import { useUserStore } from "@/app/store/useUserStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface CandidateApplication {
  _id: string;
  candidateId?: string;
  coverLetterText?: string;
  resumeUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  jobId?:
    | {
        _id?: string;
        id?: string;
        title?: string;
        status?: string;
        employerId?: string;
        companyName?: string;
        location?: string;
        jobType?: string;
      }
    | string;
}

interface CandidateApplicationsResponse {
  data: CandidateApplication[];
}

const MyApplicationsPage = () => {
  const role = useUserStore((state) => state.user?.role?.toLowerCase());

  const {
    data,
    isPending,
    isError,
    error,
    refetch: refetchApplications,
    isRefetching,
  } = useQuery<CandidateApplicationsResponse>({
    queryKey: ["candidate-applications"],
    queryFn: async () => candidateService.getCandidateApplications(),
    enabled: role === "candidate",
  });

  const applications = useMemo(
    () => data?.data ?? [],
    [data?.data]
  );

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  if (role !== "candidate") {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-100 rounded-lg border border-yellow-200 dark:border-yellow-700">
          Only candidates can view their job applications.
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3"
          >
            <Skeleton className="h-6 w-1/3" />
            <div className="flex gap-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-4 w-1/5" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-100 rounded-lg border border-red-200 dark:border-red-800 space-y-3">
          <p className="font-semibold">Unable to load applications.</p>
          <p className="text-sm">{(error as Error)?.message}</p>
          <button
            type="button"
            onClick={() => refetchApplications()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={isRefetching}
          >
            {isRefetching && <FiLoader className="animate-spin" />}
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="max-w-4xl mx-auto text-center p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <FiBriefcase className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
          No applications yet
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Browse jobs and submit applications to see them listed here.
        </p>
        <Link
          href="/dashboard/jobs"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Browse Jobs <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
          My Applications <Badge variant="default">{applications.length}</Badge>
        </h1>
        <button
          type="button"
          onClick={() => refetchApplications()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60"
        >
          {isRefetching ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiRefreshCcw />
          )}
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {applications.map((application) => {
          const jobObject =
            typeof application.jobId === "string" ? undefined : application.jobId;
          const jobId =
            typeof application.jobId === "string"
              ? application.jobId
              : jobObject?.id || jobObject?._id;
          const jobTitle = jobObject?.title ?? "Untitled role";
          const companyName = jobObject?.companyName ?? "Unknown company";
          const jobLocation = jobObject?.location;
          const jobType = jobObject?.jobType;
          const status = application.status ?? "Pending";

          const statusStyle = (() => {
            if (status.toLowerCase() === "accepted" || status.toLowerCase() === "approved") {
              return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            }
            if (status.toLowerCase() === "rejected" || status.toLowerCase() === "declined") {
              return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            }
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
          })();

          return (
            <div
              key={application._id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FiBriefcase className="text-blue-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {companyName}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {jobTitle}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                    {jobLocation && (
                      <span className="inline-flex items-center gap-1">
                        <FiMapPin className="text-blue-500" />
                        {jobLocation}
                      </span>
                    )}
                    {jobType && (
                      <span className="inline-flex items-center gap-1">
                        <FiFileText className="text-purple-500" />
                        {jobType}
                      </span>
                    )}
                    {application.createdAt && (
                      <span className="inline-flex items-center gap-1">
                        <FiClock className="text-gray-500" />
                        Applied {formatDate(application.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle}`}
                >
                  {status}
                </span>
              </div>

              {jobId && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Application ID: {application._id}
                  </div>
                  <Link
                    href={`/dashboard/jobs/${jobId}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    View Job <FiArrowRight />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
