"use client";

import Link from "next/link";
import {
  FiBarChart2,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiEdit2,
  FiFileText,
  FiMapPin,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { Job } from "../../jobs/interfaces/job.interface";
import { useUserStore } from "@/app/store/useUserStore";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  console.log(job)
  const role = useUserStore((state) => state.user?.role);
  const isEmployer = role?.toLowerCase() === "employer";

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
          <strong>{job.applications}</strong> applications
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
            <Link
              href={`/dashboard/jobs/edit/${job.id}`}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
            >
              <FiEdit2 /> Edit
            </Link>
            <button
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              onClick={() => console.log(`Deleting job ${job.id}`)}
            >
              <FiTrash2 /> Delete
            </button>
            {job.applications > 0 && (
              <Link
                href={`/jobs/${job.id}/applications`}
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
            <Link
              href={`/dashboard/jobs/${job.id}/apply`}
              className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md shadow-sm transition-colors"
            >
              Apply Now
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;
