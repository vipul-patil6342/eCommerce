import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = [];

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise((resolve) => {
                    refreshQueue.push(() => resolve(axiosInstance(original)));
                });
            }

            isRefreshing = true;

            try {
                await axiosInstance.post("/auth/refresh");

                isRefreshing = false;

                // Flush queue
                refreshQueue.forEach((cb) => cb());
                refreshQueue = [];

                // Retry the request that failed
                return axiosInstance(original);

            } catch (e) {
                isRefreshing = false;
                refreshQueue = [];
                return Promise.reject(e);
            }
        }

        return Promise.reject(err);
    }
);
