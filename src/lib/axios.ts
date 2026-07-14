import axios from "axios";

const env = import.meta.env.VITE_NODE_ENV;
const api = axios.create({
  baseURL:
    env === "production"
      ? import.meta.env.VITE_API_BASE_URL
      : "http://localhost:3001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 403 &&
      error.response?.data?.message
        ?.toLowerCase()
        .includes("suspended")
    ) {
      window.location.href = "/suspended";
    }
    return Promise.reject(error);
  },
);

// A regular axios request can be silently aborted mid-flight if the tab closes
// or navigates away right after it's fired — the browser doesn't guarantee
// delivery. Use this instead of `api.post` for writes that must survive the
// user closing the tab immediately after triggering them (e.g. marking a
// contact as CONTACTED right before ending a dialer session). `keepalive`
// tells the browser to finish sending the request even if the page unloads.
export async function postKeepalive(path: string, body: unknown = {}): Promise<void> {
  const token = localStorage.getItem("token");
  await fetch(`${api.defaults.baseURL}${path}`, {
    method: "POST",
    credentials: "include",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

export default api;
