import axios, { AxiosInstance } from "axios";

// Function to get the JWT token from wherever it's stored
const getToken = (): string | null => {
  // For example, if you store it in localStorage
  return localStorage.getItem("jwtToken");
};

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API base URL
});

// Add a request interceptor to include the JWT token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
