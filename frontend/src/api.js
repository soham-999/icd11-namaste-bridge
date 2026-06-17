import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ICD SEARCH
export const getICDBySymptom = async (symptoms) => {
  const res = await API.post("/icd", {
    symptoms
  });

  return res.data;
};

// DASHBOARD
export const getDashboardStats = async () => {
  const res = await API.get("/dashboard/stats");
  return res.data;
};

export const getTopDiagnoses = async () => {
  const res = await API.get("/dashboard/top-diagnoses");
  return res.data;
};

export const getTrafficData = async () => {
  const res = await API.get("/dashboard/traffic");
  return res.data;
};

export const getChapterData = async () => {
  const res = await API.get("/dashboard/chapters");
  return res.data;
};

// PATIENTS
export const getPatients = async () => {
  const res = await API.get("/patients");
  return res.data;
};

export const addPatient = async (payload) => {
  const res = await API.post(
    "/patients/add-patient",
    payload
  );

  return res.data;
}; 

 // CUSTOM API GENERATOR
 export const generateCustomAPI = async (payload) => {
  const res = await API.post(
    "/custom-api/generate",
    payload
  );

  return res.data;
};

// BATCH PROCESSING
export const processBatch = async (records) => {
  const res = await API.post(
    "/batch/process",
    {
      records
    }
  );

  return res.data;
};

export default API;