import axiosClient from "../utils/axios-client";

class CandidateService {
  applyToJob = async (id: string, payload: any) => {
    return await axiosClient.post(`candidate/jobs/${id}/applications`, payload);
  };

  hasCandidateAppliedToJob = async (jobId: string) => {
    return await axiosClient.get(`candidate/jobs/${jobId}/applications/status`);
  };

  getCandidateApplications = async () => {
    return await axiosClient.get(`candidate/applications`);
  };
}

const candidateService = new CandidateService();

export default candidateService;
