import axios from "axios";

const API = "http://localhost:5000";

export const getICDBySymptom = async (symptom) => {
  const res = await axios.get(`${API}/icd/${symptom}`);
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await axios.get(`${API}/dashboard/stats`);
  return res.data;
};

export const getTopDiagnoses = async () => {
  const res = await axios.get(`${API}/dashboard/top-diagnoses`);
  return res.data;
};

export const getPatients = async () => {
  const res = await axios.get(`${API}/patients`);
  return res.data;
};