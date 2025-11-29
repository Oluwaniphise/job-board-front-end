import axiosClient from "../utils/axios-client";

class EmployerService {
  getApplicationForJob = async (id: string) => {
    return await axiosClient.get(`employer/jobs/${id}/applications`);
  };
}

const employerService = new EmployerService();

export default employerService;
