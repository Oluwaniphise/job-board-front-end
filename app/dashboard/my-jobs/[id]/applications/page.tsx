"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  FiArrowLeft,
  FiClock,
  FiFileText,
  FiLoader,
  FiUser,
  FiPaperclip,
} from "react-icons/fi";
import employerService from "@/app/services/employer.services";
import { Skeleton } from "@/components/ui/skeleton";
import RoleGuard from "@/app/components/RoleGuard";

interface JobApplication {
  _id: string;
  candidateId?: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
  coverLetterText?: string;
  resumeUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface JobApplicationsResponse {
  data: JobApplication[];
}

const JobApplicationsPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const jobId = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params?.id]);

  const { data, isPending, isError, error, refetch, isRefetching } =
    useQuery<JobApplicationsResponse>({
      queryKey: ["employer-job-applications", jobId],
      queryFn: async () => employerService.getApplicationForJob(jobId),
      enabled: Boolean(jobId),
    });

  const applications = useMemo(() => data?.data ?? [], [data?.data]);

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  if (!jobId) {
    return (
      <RoleGuard allowedRoles={["employer"]}>
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-100 rounded-lg border border-yellow-200 dark:border-yellow-700">
          Job ID not provided. Please navigate from the My Jobs list.
        </div>
      </RoleGuard>
    );
  }

  if (isPending) {
    return (
      <RoleGuard allowedRoles={["employer"]}>
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-3"
            >
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </RoleGuard>
    );
  }

  if (isError) {
    return (
      <RoleGuard allowedRoles={["employer"]}>
        <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-100 rounded-lg border border-red-200 dark:border-red-800 space-y-3">
          <p className="font-semibold">Unable to load applications.</p>
          <p className="text-sm">{(error as Error)?.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {isRefetching && <FiLoader className="animate-spin" />}
            Retry
          </button>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["employer"]}>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <FiArrowLeft /> Back
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Job ID: {jobId}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Applications ({applications.length})
        </h1>

        {applications.length === 0 ? (
          <div className="text-center p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No applications yet
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Applications submitted for this job will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => {
              const status = application.status ?? "Pending";
              const statusStyle = (() => {
                const normalized = status.toLowerCase();
                if (normalized === "accepted" || normalized === "approved") {
                  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
                }
                if (normalized === "rejected" || normalized === "declined") {
                  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
                }
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
              })();

              return (
                <div
                  key={application._id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FiUser className="text-blue-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Candidate: {application.candidateId?.firstName}{" "}
                          {application.candidateId?.lastName} | {application.candidateId?.email }
                        </span>
                      </div>
                      {application.createdAt && (
                        <div className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FiClock className="text-gray-500" />
                          Applied {formatDate(application.createdAt)}
                        </div>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle}`}
                    >
                      {status}
                    </span>
                  </div>

                  {application.coverLetterText && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line border border-gray-100 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-900/40">
                      {application.coverLetterText}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div>Application ID: {application._id}</div>
                    {application.resumeUrl && (
                      <Link
                        href={application.resumeUrl}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FiPaperclip /> View Resume
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default JobApplicationsPage;
