import axiosClient from "../utils/axios-client";

class CandidateService {
  applyToJob = async (id: string, payload: any) => {
    return await axiosClient.post(`candidate/jobs/${id}/applications`, payload);
  };
}

const candidateService = new CandidateService();

export default candidateService;
