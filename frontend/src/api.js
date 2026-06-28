import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

// Attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(
    "JWT SENT:",
    token
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   AUTH
========================= */

export const login = async (payload) => {
  const res = await API.post(
    "/auth/login",
    payload
  );
  if(res.data?.token)
  {
    localStorage.setItem(
      "token",
      res.data.token
    );
  }
  return res.data;
};


/* =========================
   DASHBOARD
========================= */

export const getDashboardStats =
async () => {
  const res =
  await API.get(
    "/dashboard/stats"
  );

  return res.data;
};

export const getTopDiagnoses =
async () => {
  const res =
  await API.get(
    "/dashboard/top-diagnoses"
  );

  return res.data;
};

export const getTrafficData =
async () => {
  const res =
  await API.get(
    "/dashboard/traffic"
  );

  return res.data;
};

export const getChapterData =
async () => {
  const res =
  await API.get(
    "/dashboard/chapters"
  );

  return res.data;
};


/* =========================
   PATIENTS
========================= */

export const getPatients =
async () => {
  const res =
  await API.get(
    "/patients"
  );

  return res.data;
};

export const addPatient =
async (payload) => {
  const res =
  await API.post(
    "/patients",
    payload
  );

  return res.data;
};

export const getPatientById =
async (id) => {
  const res =
  await API.get(
    `/patients/${id}`
  );

  return res.data;
};


/* =========================
   WORKSPACE
========================= */

export const getWorkspace =
async (id) => {

  const res =
  await API.get(
    `/patients/${id}/workspace`
  );

  return res.data;
};

export const getHistory =
async (id) => {

  const res =
  await API.get(
    `/patients/${id}/history`
  );

  return res.data;
};


/* =========================
   CUSTOM API
========================= */

export const generateCustomAPI =
async (payload) => {

  const res =
  await API.post(
    "/custom-api/generate",
    payload
  );

  return res.data;
};


/* =========================
   BATCH
========================= */

export const processBatch =
async (records) => {

  const res =
  await API.post(
    "/batch/process",
    {
      records
    }
  );

  return res.data;
};

export const commitLedger =
async (payload) => {

  const res =
  await API.post(
    "/ledger/commit",
    payload
  );

  return res.data;
};

export default API;