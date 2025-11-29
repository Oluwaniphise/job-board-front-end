"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  FiBarChart2,
  FiBriefcase,
  FiClock,
  FiLoader,
  FiDollarSign,
  FiEdit2,
  FiFileText,
  FiMapPin,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { Job } from "../../jobs/interfaces/job.interface";
import { useUserStore } from "@/app/store/useUserStore";
import { Modal, ModalClose } from "@/components/ui/modal";
import jobService from "@/app/services/jobs.service";
import candidateService from "@/app/services/candidate.service";
import toast from "react-hot-toast";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  type FormValues = {
    title: string;
    companyName: string;
    location: string;
    salaryRange: string;
    jobType: Job["jobType"];
    experienceLevel: Job["experienceLevel"];
    status: Job["status"];
    requiredSkills: string;
    description: string;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      companyName: "",
      location: "",
      salaryRange: "",
      jobType: "Full-time",
      experienceLevel: "Junior",
      status: "Draft",
      requiredSkills: "",
      description: "",
    },
  });

  const { mutate: updateJob, isPending: isUpdating } = useMutation({
    mutationKey: ["update-job", job.id],
    mutationFn: (payload: any) => jobService.updateJob(payload, job.id),
    onSuccess: async () => {
      toast.success("Job updated");
      setEditOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["dashboard-jobs"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update job");
    },
  });

  const { mutate: deleteJob, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-job", job.id],
    mutationFn: () => jobService.deleteJob(job.id),
    onSuccess: async () => {
      toast.success("Job deleted");
      setDeleteOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["dashboard-jobs"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete job");
    },
  });

  useEffect(() => {
    if (!editOpen) return;
    reset({
      title: job.title || "",
      companyName: job.companyName || "",
      location: job.location || "",
      salaryRange: job.salaryRange || "",
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      status: job.status,
      requiredSkills: job.requiredSkills?.join(", ") || "",
      description: job.description || "",
    });
  }, [editOpen, job, reset]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      requiredSkills: values.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    updateJob(payload);
  };

  const role = useUserStore((state) => state.user?.role);
  const isEmployer = role?.toLowerCase() === "employer";
  const isCandidate = role?.toLowerCase() === "candidate";

  const { data: applicationStatus, isPending: isCheckingApplicationStatus } =
    useQuery<{ hasApplied: boolean }>({
      queryKey: ["job-application-status", job.id],
      queryFn: async () => {
        const response = await candidateService.hasCandidateAppliedToJob(
          job.id
        );
        return response.data;
      },
      enabled: isCandidate,
    });

  const { data: jobApplicationsData, isPending: isLoadingApplicationsCount } =
    useQuery<{ data?: unknown[] }>({
      queryKey: ["job-applications-count", job.id],
      queryFn: async () => jobService.getApplicationsForAJob(job.id),
      enabled: true,
    });

  const applicationsCount =
     jobApplicationsData?.data?.length  ?? 0;
  const hasApplied = applicationStatus?.hasApplied ?? false;

  const getStatusStyle = (status: Job["status"]) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Archived":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Draft":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition duration-300 p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiBriefcase className="text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              {job.companyName}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <FiMapPin className="text-blue-500" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <FiDollarSign className="text-green-500" />
              {job.salaryRange}
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusStyle(
            job.status
          )}`}
        >
          {job.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <FiClock className="text-gray-500" />
          Posted {formatDate(job.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <FiFileText className="text-purple-500" />
          {job.jobType}
        </span>
        <span className="flex items-center gap-1">
          <FiBarChart2 className="text-orange-500" />
          {job.experienceLevel}
        </span>
        <div className="flex items-center gap-1">
          <FiUsers className="text-blue-500" />
          {isEmployer && isLoadingApplicationsCount ? (
            <FiLoader className="animate-spin text-blue-500" />
          ) : (
            <strong>{applicationsCount}</strong>
          )}{" "}
          applications
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.requiredSkills?.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
        {job.description}
      </p>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center gap-3">
        {isEmployer ? (
          <>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
            >
              <FiEdit2 /> Edit
            </button>
            <button
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              onClick={() => setDeleteOpen(true)}
            >
              <FiTrash2 /> Delete
            </button>
            {applicationsCount > 0 && (
              <Link
                href={`/dashboard/my-jobs/${job.id}/applications`}
                className="ml-auto inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
              >
                <FiUsers /> Review Applications
              </Link>
            )}
          </>
        ) : (
          <>
            <Link
              href={`/dashboard/jobs/${job.id}`}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              <FiFileText /> View Job
            </Link>
            {isCandidate && (
              <button
                type="button"
                disabled={hasApplied || isCheckingApplicationStatus}
                onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCheckingApplicationStatus && (
                  <FiLoader className="animate-spin" />
                )}
                {hasApplied ? "Applied" : "Apply Now"}
              </button>
            )}
          </>
        )}
      </div>

      {isEmployer && (
        <Modal open={editOpen} onOpenChange={setEditOpen} title="Edit Job">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title
                </label>
                <input
                  {...register("title", { required: true })}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <input
                  {...register("companyName", { required: true })}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  {...register("location", { required: true })}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Salary Range
                </label>
                <input
                  {...register("salaryRange", { required: true })}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Required Skills (comma separated)
              </label>
              <input
                {...register("requiredSkills", { required: true })}
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Type
                </label>
                <select
                  {...register("jobType", { required: true })}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Experience Level
                </label>
                <select
                  {...register("experienceLevel", { required: true })}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="Intern">Intern</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  {...register("status", { required: true })}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Description
              </label>
              <textarea
                {...register("description", { required: true })}
                rows={5}
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
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
                disabled={isUpdating || isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {(isUpdating || isSubmitting) && (
                  <FiLoader className="animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isEmployer && (
        <Modal
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Job"
          description="This action cannot be undone. Are you sure you want to delete this job?"
        >
          <div className="flex justify-end gap-2 pt-2">
            <ModalClose asChild>
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </ModalClose>
            <button
              type="button"
              onClick={() => deleteJob()}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
            >
              {isDeleting && <FiLoader className="animate-spin" />}
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default JobCard;
