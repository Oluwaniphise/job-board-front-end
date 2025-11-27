import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log(error);
  }
  return config;
});

export default axiosClient;
