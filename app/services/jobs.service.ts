import axiosClient from "../utils/axios-client";

class JobService {
  getJobs = async (userId: string) => {
    return await axiosClient.get(`/jobs`);
  };
  getJob = async (id: string) => {
    return await axiosClient.get(`/jobs/${id}`);
  };
}

const jobService = new JobService();

export default jobService;
