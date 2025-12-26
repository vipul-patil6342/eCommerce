import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error = null) => {
    refreshQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    refreshQueue = [];
};

axiosInstance.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config;

        //Skip refresh for auth endpoints
        if (
            err.response?.status === 401 &&
            !original._retry &&
            !original.url.includes("/auth/login") &&
            !original.url.includes("/auth/refresh") &&
            !original.url.includes("/auth/signup")
        ) {
            original._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({
                        resolve: () => resolve(axiosInstance(original)),
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                await axios.post(
                    `${baseUrl}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                processQueue();
                return axiosInstance(original);
            } catch (refreshError) {
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);
