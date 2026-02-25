import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (email, password) =>
  api.post("/auth/login", { email, password });

// Leads
export const submitLead = (data) => api.post("/leads", data);
export const getAllLeads = () => api.get("/leads");
export const getPartnerLeads = (slug) => api.get(`/leads/partner/${slug}`);
export const updateLeadStatus = (id, status) =>
  api.patch(`/leads/${id}/status`, { status });

// Partners
export const getAllPartners = () => api.get("/partners");
export const createPartner = (data) => api.post("/partners", data);
export const deletePartner = (id) => api.delete(`/partners/${id}`);
