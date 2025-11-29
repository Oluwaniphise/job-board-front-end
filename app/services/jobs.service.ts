import axiosClient from "../utils/axios-client";

class JobService {
  getJobs = async (userId: string) => {
    return await axiosClient.get(`/jobs`);
  };

  getMyJobs = async () => {
    return await axiosClient.get(`/jobs/employer`);
  };

  getJob = async (id: string) => {
    return await axiosClient.get(`/jobs/${id}`);
  };

  getApplicationsForAJob = async (id: string) => {
    return await axiosClient.get(`/applications/job/${id}`);
  };

  createJob = async (payload: any) => {
    return await axiosClient.post(`/jobs`, payload);
  };

  updateJob = async (payload: any, id: string) => {
    return await axiosClient.patch(`/jobs/${id}`, payload);
  };

  deleteJob = async (id: string) => {
    return await axiosClient.delete(`/jobs/${id}`);
  };
}

const jobService = new JobService();

export default jobService;
