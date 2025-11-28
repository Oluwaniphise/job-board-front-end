"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiBarChart2,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiLoader,
  FiMapPin,
  FiShield,
} from "react-icons/fi";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Job } from "../interfaces/job.interface";
import jobService from "@/app/services/jobs.service";
import { useUserStore } from "@/app/store/useUserStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal, ModalClose } from "@/components/ui/modal";
import { Controller, useForm } from "react-hook-form";
import candidateService from "@/app/services/candidate.service";

interface JobResponse {
  data: Job;
}

const JobDetailsPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const role = useUserStore((state) => state.user?.role?.toLowerCase());
  const [applyOpen, setApplyOpen] = useState(false);

  type ApplyFormValues = {
    coverLetterText: string;
    resumeFile: File | null;
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<ApplyFormValues>({
    defaultValues: { coverLetterText: "", resumeFile: null },
  });

  const resumeFile = watch("resumeFile");

  const jobId = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params?.id]);

  const {
    data,
    isPending,
    isError,
    error,
    refetch: refetchJob,
  } = useQuery<JobResponse>({
    queryKey: ["job-details", jobId],
    queryFn: async () => jobService.getJob(jobId),
    enabled: Boolean(jobId),
  });

  const {
    mutate: applyToJob,
    isPending: isApplying,
    isSuccess: hasApplied,
    reset: resetApplyState,
  } = useMutation({
    mutationKey: ["apply-job", jobId],
    mutationFn: (payload: FormData) =>
      candidateService.applyToJob(jobId, payload),
    onSuccess: () => {
      toast.success("Application submitted successfully");
      setApplyOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Failed to submit application"
      );
    },
  });

  useEffect(() => {
    resetApplyState();
    reset();
  }, [jobId, resetApplyState, reset]);

  const job = data?.data;
  const canApply = role === "candidate";

  const formatDate = (value: string | undefined) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  if (!jobId) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800">
          Job ID not found. Please navigate from the jobs list.
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-10 w-32" />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4 border border-gray-100 dark:border-gray-700">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-32" />
          <Skeleton className="h-5 w-1/4" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="p-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-800 space-y-3">
          <p className="font-semibold">Unable to load job details.</p>
          <p className="text-sm">{(error as Error).message}</p>
          <button
            type="button"
            onClick={() => refetchJob()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-700">
          Job not found. It may have been removed or archived.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center cursor-pointer gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <FiArrowLeft /> Back to jobs
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiBriefcase className="text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                {job.companyName}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                {job.jobType}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <FiMapPin className="text-blue-500" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <FiDollarSign className="text-green-500" />
                {job.salaryRange}
              </span>
              <span className="inline-flex items-center gap-1">
                <FiBarChart2 className="text-orange-500" />
                {job.experienceLevel}
              </span>
              <span className="inline-flex items-center gap-1">
                <FiClock className="text-gray-500" />
                Posted {formatDate(job.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-200 capitalize">
              {job.status}
            </span>
            <button
              type="button"
              disabled={!canApply || isApplying}
              onClick={() => setApplyOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors w-full md:w-auto"
            >
              {isApplying && <FiLoader className="animate-spin" />}
              {hasApplied ? "Applied" : "Apply Now"}
            </button>
            {!canApply && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {role !== "candidate"
                  ? "Only candidates can apply to jobs."
                  : "Job is not currently accepting applications."}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
              Applications
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {job.applications}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700">
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
              Updated
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {formatDate(job.updatedAt)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Job Description
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
              >
                <FiShield className="text-blue-500" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {canApply && (
        <Modal
          open={applyOpen}
          onOpenChange={setApplyOpen}
          title="Apply for this job"
          description="Submit your cover letter and upload your resume."
        >
          <form
            className="space-y-4"
            onSubmit={handleSubmit((values) => {
              if (!values.resumeFile) {
                toast.error("Please upload your resume");
                return;
              }
              const formData = new FormData();
              formData.append("coverLetterText", values.coverLetterText);
              formData.append("resume", values.resumeFile);
              applyToJob(formData);
            })}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cover Letter
              </label>
              <textarea
                {...register("coverLetterText", { required: true })}
                rows={5}
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Share why you're a great fit..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Resume
              </label>
              <Controller
                name="resumeFile"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, ref } }) => (
                  <>
                    <input
                      ref={ref}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                      required
                    />
                    {resumeFile && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Selected: {resumeFile.name}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <ModalClose asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </ModalClose>
              <button
                type="submit"
                disabled={isApplying || isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {(isApplying || isSubmitting) && (
                  <FiLoader className="animate-spin" />
                )}
                Submit Application
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default JobDetailsPage;
