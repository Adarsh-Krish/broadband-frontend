import axios from "axios";

// const BASE_URL = "http://localhost:5000/api";
const BASE_URL = "https://broadband-backend.onrender.com/api";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const normalize = (obj) => {
  if (Array.isArray(obj)) return obj.map(normalize);
  if (obj && typeof obj === "object") {
    if (obj._id) obj.id = obj._id;
    Object.keys(obj).forEach((k) => normalize(obj[k]));
  }
  return obj;
};

api.interceptors.response.use(
  (response) => {
    response.data = normalize(response.data);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/partner/login";
    }
    return Promise.reject(error);
  },
);

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const submitLead = (data) => api.post("/leads", data);
export const getAllLeads = () => api.get("/leads");
export const getPartnerLeads = (slug) => api.get(`/leads/partner/${slug}`);
export const updateLeadStatus = (id, status) =>
  api.patch(`/leads/${id}/status`, { status });

export const getAllPartners = () => api.get("/partners");
export const createPartner = (data) => api.post("/partners", data);
export const deletePartner = (id) => api.delete(`/partners/${id}`);
export const updatePartnerSettings = (id, data) =>
  api.patch(`/partners/${id}`, data);
