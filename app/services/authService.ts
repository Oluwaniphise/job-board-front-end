import axiosClient from "../utils/axios-client";

class AuthService {
  login = async ({ email, password }: { email: string; password: string }) => {
    return await axiosClient.post(`/auth/login`, { email, password });
  };

  register = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    role: "candidate" | "employer";
    password: string;
  }) => {
    return await axiosClient.post(`/auth/register`, payload);
  };

  requestToken = async ({
    token_type,
    email,
  }: {
    token_type: string;
    email: string;
  }) => {
    return await axiosClient.post(`/auth/request-token`, { token_type, email });
  };

  logOutUser = async ({ email }: { email: string }) => {
    return await axiosClient.post("auth/logout", {
      email,
    });
  };
}

const authService = new AuthService();

export default authService;
