import axiosClient from "../utils/axios-client";

class JobService {
  getJobs = async (userId: string) => {
    return await axiosClient.get(`/jobs`);
  };
  getJob = async (id: string) => {
    return await axiosClient.get(`/jobs/${id}`);
  };

  createJob = async (payload: any) => {
    return await axiosClient.post(`/jobs`, payload);
  };
}

const jobService = new JobService();

export default jobService;
