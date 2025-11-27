"use client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import RoleGuard from "@/app/components/RoleGuard";
import jobService from "@/app/services/jobs.service";

type ExperienceLevel = "Junior" | "Mid-Level" | "Intern" | "Senior";
type Status = "Archived" | "Published" | "Draft";
type JobType = "Full-time" | "Part-time" | "Contract";

interface CreateJobForm {
  title: string;
  companyName: string;
  location: string;
  description: string;
  salaryRange: string;
  requiredSkills: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  status: Status;
}

const JobCreatePage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateJobForm>();

  const { mutate: createJob, isPending } = useMutation({
    mutationFn: jobService.createJob,
    onSuccess: () => {
      toast.success("Job created successfully");
      reset();
      router.push("/dashboard/jobs/my-jobs");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create job");
    },
  });

  const onSubmit = (data: CreateJobForm) => {
    const payload = {
      ...data,
      requiredSkills: data.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };
    createJob(payload);
  };

  const isLoading = isSubmitting || isPending;

  return (
    <RoleGuard allowedRoles={["employer"]}>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Create New Job
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in the details below to publish a job posting.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Title
              </label>
              <input
                {...register("title", { required: true })}
                placeholder="e.g., Senior Frontend Engineer"
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name
              </label>
              <input
                {...register("companyName", { required: true })}
                placeholder="Company Inc."
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                {...register("location", { required: true })}
                placeholder="Remote or City, Country"
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Salary Range
              </label>
              <input
                {...register("salaryRange", { required: true })}
                placeholder="$80,000 - $110,000"
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Required Skills (comma separated)
            </label>
            <input
              {...register("requiredSkills", { required: true })}
              placeholder="React, TypeScript, Tailwind"
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
                <option value="Mid-Level">Mid-level</option>
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
              placeholder="Describe the responsibilities, requirements, and benefits..."
              rows={6}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm disabled:opacity-70"
            >
              {isLoading && <FiLoader className="animate-spin" />}
              Post Job
            </button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
};

export default JobCreatePage;
