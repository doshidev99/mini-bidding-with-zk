import { AuthService } from "@services/auth0Service";
import { ACCESS_TOKEN } from "@utils/constants";
import { LocalStorage } from "@utils/newLocalstorage";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API!;

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reson?: any) => void;
}[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const handleLogout = () => {
  const authService = new AuthService();
  authService.logout();
};

const getInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    function (config) {
      const token = LocalStorage.get(ACCESS_TOKEN);
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      return response.data;
    },
    async function (error) {
      return Promise.reject(error.response?.data);
    }
  );

  return instance;
};

export const axiosInstance = getInstance(baseURL);

export const axiosInstanceExplore = getInstance(
  process.env.NEXT_PUBLIC_API_EXPLORE!
);

export default axiosInstance;
