"use client";
import { useForm } from "react-hook-form";
import RoleGuard from "@/app/components/RoleGuard";

const JobCreatePage: React.FC = () => {
  const { register, handleSubmit } = useForm();
  // const createJobMutation = useCreateJob(); // Assuming you create this mutation

  const onSubmit = (data: any) => {
    // createJobMutation.mutate(data);
    console.log("Job Data:", data);
  };

  return (
    <RoleGuard allowedRoles={["employer"]}>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">
          Create New Job
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("title")}
            placeholder="Job Title"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <textarea
            {...register("description")}
            placeholder="Job Description"
            rows={6}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          ></textarea>
          {/* ... other fields ... */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Post Job
          </button>
        </form>
      </div>
    </RoleGuard>
  );
};

export default JobCreatePage;
