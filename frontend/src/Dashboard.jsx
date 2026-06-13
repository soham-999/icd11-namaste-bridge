import React, { useState, useEffect } from "react";

import {
  getICDBySymptom,
  getDashboardStats,
  getTopDiagnoses,
  getPatients,
  getTrafficData,
  getChapterData,
  addPatient
} from "./api";

export default function Dashboard() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState("Overview");

  // Dashboard Filters
  const [timeframe, setTimeframe] = useState("30 Days");
  
  const [currentTime, setCurrentTime] = useState(new Date());

  const [stats, setStats] = useState(null);
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
   const [icdResult, setIcdResult] = useState(null);
  // Graph Data
  const [graphData, setGraphData] = useState({
    "15 Days": [30, 45, 68, 90, 110, 148],
    "30 Days": [110, 140, 180, 260, 350, 498],
    "3 Months": [850, 1100, 1240, 1560, 1850, 2248],
  });

  const totalApiSearches =
    graphData?.[timeframe]?.[
      graphData?.[timeframe]?.length - 1
    ] || 0;

  // ========================================================
  // Backend Configuration
  // ========================================================
  const BACKEND_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchLiveTelemetry = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/telemetry`);
      const data = await res.json();

      if (data?.graphData) {
        setGraphData(data.graphData);
      }
    } catch (error) {
      console.error("Telemetry fetch failed:", error);
    }
  };

  // ========================================================
  // Graph Increment Helper
  // ========================================================
  const triggerGraphIncrement = (incrementValue = 1) => {
    setGraphData((prev) => {
      const currentArray = [...prev[timeframe]];

      currentArray[currentArray.length - 1] =
        currentArray[currentArray.length - 1] + incrementValue;

      return {
        ...prev,
        [timeframe]: currentArray,
      };
    });
  };

  // ========================================================
  // CREATE API STATES
  // ========================================================
  const [apiList, setApiList] = useState([
    {
      id: "API-101",
      name: "EHR Translation Engine",
      endpoint: "/translate",
      method: "POST",
      status: "Active",
      rateLimit: "1000/min",
    },
    {
      id: "API-102",
      name: "Patient Pathology Sync",
      endpoint: "/pathology",
      method: "GET",
      status: "Active",
      rateLimit: "500/min",
    },
  ]);

  const [newApi, setNewApi] = useState({
    name: "",
    endpoint: "",
    method: "POST",
    rateLimit: "1000/min",
  });

  const [showCreatedKey, setShowCreatedKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);

  // ========================================================
  // CREATE API HANDLER
  // ========================================================
  const handleCreateApiSubmit = async (e) => {
    e.preventDefault();

    if (!newApi.name.trim() || !newApi.endpoint.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/custom-api/generate`,
        {
          method: "POST",
          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
},
          body: JSON.stringify({
            name: newApi.name,
            endpoint: newApi.endpoint,
            method: newApi.method,
            rateLimit: newApi.rateLimit,
          }),
        }
      );

      const data = await response.json();

      const freshApiNode = {
        id:
         data.apiId || ||
          `API-${Math.floor(Math.random() * 900) + 100}`,
        name: newApi.name,
        endpoint: newApi.endpoint.startsWith("/")
          ? newApi.endpoint
          : `/${newApi.endpoint}`,
        method: newApi.method,
        status: "Active",
        rateLimit: newApi.rateLimit,
      };

      setApiList((prev) => [freshApiNode, ...prev]);

      setGeneratedKey(
  data.data?.apiKey ||
          data.token ||
          `sk_live_${Math.random()
            .toString(36)
            .substring(2, 18)}`
      );

      setShowCreatedKey(true);

      setNewApi({
        name: "",
        endpoint: "",
        method: "POST",
        rateLimit: "1000/min",
      });

      triggerGraphIncrement(20);
    } catch (error) {
      console.error("API Creation Failed:", error);

      const freshApiNode = {
        id: `API-${Math.floor(Math.random() * 900) + 100}`,
        name: newApi.name,
        endpoint: newApi.endpoint.startsWith("/")
          ? newApi.endpoint
          : `/${newApi.endpoint}`,
        method: newApi.method,
        status: "Active",
        rateLimit: newApi.rateLimit,
      };

      setApiList((prev) => [freshApiNode, ...prev]);

      setGeneratedKey(
        `sk_live_${Math.random()
          .toString(36)
          .substring(2, 18)}`
      );

      setShowCreatedKey(true);

      setNewApi({
        name: "",
        endpoint: "",
        method: "POST",
        rateLimit: "1000/min",
      });

      triggerGraphIncrement(20);
    }
  };
  // ========================================================
// REAL TIME CLOCK
// ========================================================

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

// ========================================================
// LOAD DASHBOARD DATA
// ========================================================
useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const statsData = await getDashboardStats();
      const diagnosesData = await getTopDiagnoses();
      const trafficData = await getTrafficData();
      const chapterData = await getChapterData();
      const patientData = await getPatients();

      setStats(statsData);

      console.log("Stats:", statsData);
      console.log("Diagnoses:", diagnosesData);
      console.log("Traffic:", trafficData);
      console.log("Chapters:", chapterData);
      console.log("Patients:", patientData);

    } catch (err) {
      console.error("Dashboard API Error:", err);
    }
  };

  loadDashboardData();
}, []);
  // ========================================================
  // FEATURE: Analytics / Patient Diagnostics State
  // ========================================================
  const [patientInput, setPatientInput] = useState({
    symptoms: "",
    fileName: "",
    fileType: "Blood Sample",
  });

  const [diagnosticResult, setDiagnosticResult] = useState(null);

  // ========================================================
  // FEATURE: Batch Mapping State
  // ========================================================
  const [batchFile, setBatchFile] = useState(null);
  const [batchResults, setBatchResults] = useState([]);

  // ========================================================
  // Core Structured Healthcare Vocabulary Matrix
  // ========================================================
  const diseaseMockDatabase = [
    {
      id: "TM-921",
      disease: "Fever",
      code: "MG26",
      diagnosis: "Pyrexia of unknown origin / Elevated body temperature",
    },
    {
      id: "TM-114",
      disease: "Infection",
      code: "1D40",
      diagnosis: "Bacterial infection, unspecified site",
    },
    {
      id: "TM-305",
      disease: "Bone Fracture / Plaster application",
      code: "NC32",
      diagnosis:
        "Displaced fracture of forearm, mechanical casting stabilized",
    },
    {
      id: "TM-551",
      disease: "Knee Ligament Injury",
      code: "NC93",
      diagnosis: "Sprain and strain of cruciate ligament of knee",
    },
    {
      id: "TM-204",
      disease: "Pneumonia",
      code: "CA40",
      diagnosis: "Pneumonia, unspecified",
    },
    {
      id: "TM-442",
      disease: "Lung Cancer",
      code: "2C25",
      diagnosis: "Malignant neoplasms of bronchus or lung",
    },
    {
      id: "TM-781",
      disease: "Diabetes Mellitus",
      code: "5A10",
      diagnosis: "Metabolic disorder state",
    },
  ];

  // ========================================================
// Core Search Handler
// ========================================================
const handleCoreSearchLookup = async (e) => {
  e.preventDefault();

  if (!searchQuery.trim()) {
    setSearchResults([]);
    return;
  }

  try {
    // Backend ICD Search
    const result = await getICDBySymptom(searchQuery);

    setIcdResult(result);

    if (Array.isArray(result)) {
      setSearchResults(result);
    } else if (result?.results) {
      setSearchResults(result.results);
    } else {
      setSearchResults([]);
    }

    triggerGraphIncrement(5);
  } catch (error) {
    console.error("Search Failed:", error);

    // Fallback Local Search
    const results = diseaseMockDatabase.filter(
      (item) =>
        item.disease
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.diagnosis
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  }
};

// ========================================================
// PRE-LOADED SAMPLES: Interactive Presentation Helpers
// ========================================================
const injectBatchSample = (type) => {
  setBatchFile(`${type}_bulk_manifest.csv`);

  if (type === "injury") {
    setBatchResults([
      {
        rawTerm:
          "Compound fracture of tibia with plaster requirements",
        mappedTerm: "Bone Fracture / Casting",
        localId: "NAM-I1",
        icd11Code: "NC32",
        status: "SUCCESS",
      },
      {
        rawTerm:
          "Deep tissue laceration on right palmar region",
        mappedTerm: "Open Wound / Injury",
        localId: "NAM-I2",
        icd11Code: "ND52",
        status: "SUCCESS",
      },
      {
        rawTerm:
          "Chronic viral fever with systemic chills",
        mappedTerm: "Pyrexia / Fever",
        localId: "NAM-I3",
        icd11Code: "MG26",
        status: "SUCCESS",
      },
    ]);
  } else {
    setBatchResults([
      {
        rawTerm:
          "Severe bacterial lung consolidation",
        mappedTerm: "Pneumonia",
        localId: "NAM-D1",
        icd11Code: "CA40",
        status: "SUCCESS",
      },
      {
        rawTerm:
          "Metabolic insulin degradation profile",
        mappedTerm: "Diabetes Mellitus",
        localId: "NAM-D2",
        icd11Code: "5A10",
        status: "SUCCESS",
      },
      {
        rawTerm:
          "Unspecified tissue cellular malignancy",
        mappedTerm: "Carcinoma Entity",
        localId: "NAM-D3",
        icd11Code: "",
        status: "UNMAPPED",
      },
    ]);
  }

  triggerGraphIncrement(15);
};

// ========================================================
// Diagnostic Demo Helper
// ========================================================
const injectDiagnosticSample = (condition) => {
  if (condition === "mri") {
    setPatientInput({
      symptoms:
        "Persistent localized thoracic column pain, respiratory restriction",
      fileName: "mri_spinal_t2_weighted.dcm",
      fileType: "MRI Structural Scan",
    });

    setDiagnosticResult({
      stage: "Structural Phase III Progression",
      medications:
        "Cisplatin systemic chemotherapy, advanced targeted localized EGFR suppressors",
      riskProfile:
        "High Critical Risk - Immediate Oncological Inpatient Tracking Required",
      doctor: "Dr. Arnab Gupta (Oncologist)",
      hospital: "Tata Medical Center, Rajarhat",
    });
  } else {
    setPatientInput({
      symptoms:
        "High spike fever, chronic productive cough, oxygenation drops to 92%",
      fileName: "cbc_blood_panel.pdf",
      fileType: "Blood Sample Report",
    });

    setDiagnosticResult({
      stage: "Acute Alveolar Consolidation Phase I",
      medications:
        "Broad Spectrum Tazobactam/Piperacillin IV injections, nebulized bronchodilators",
      riskProfile:
        "Moderate Systemic Risk - Managed Isolated Ward Monitoring",
      doctor: "Dr. S. Chatterjee (Pulmonologist)",
      hospital: "Apollo Gleneagles, Salt Lake",
    });
  }

  triggerGraphIncrement(25);
};

// ========================================================
// Timeframe Labels
// ========================================================
const timeframeLabels = {
  "15 Days": [
    "Day 1",
    "Day 4",
    "Day 7",
    "Day 10",
    "Day 13",
    "Today",
  ],
  "30 Days": [
    "Day 1-5",
    "Day 6-10",
    "Day 11-15",
    "Day 16-20",
    "Day 21-25",
    "Current",
  ],
  "3 Months": [
    "Early April",
    "Mid April",
    "Late April",
    "Early May",
    "Mid May",
    "June Current",
  ],
};

// ========================================================
// SVG Graph Generator
// ========================================================
const renderLineGraphPoints = () => {
  const dataPoints =
    graphData?.[timeframe] || [0, 0, 0, 0, 0, 0];

  const max = Math.max(...dataPoints, 1) * 1.1;
  const width = 500;
  const height = 140;

  const pointsCoordinates = dataPoints.map(
    (val, idx) => {
      const x =
        (idx / (dataPoints.length - 1)) * width;

      const y =
        height - (val / max) * height;

      return {
        x,
        y,
        value: val,
      };
    }
  );

  const pathD = pointsCoordinates.reduce(
    (acc, pt, idx) =>
      idx === 0
        ? `M ${pt.x} ${pt.y}`
        : `${acc} L ${pt.x} ${pt.y}`,
    ""
  );

  const areaD =
    pointsCoordinates.length > 0
      ? `${pathD} L ${
          pointsCoordinates[
            pointsCoordinates.length - 1
          ].x
        } ${height} L ${
          pointsCoordinates[0].x
        } ${height} Z`
      : "";

  return {
    pathD,
    areaD,
    pointsCoordinates,
    height,
    width,
  };
};

const graphSpecs = renderLineGraphPoints();
return (
  <div className="min-h-screen bg-[#e9edf0] text-[#1e293b] flex flex-col md:flex-row font-sans antialiased">

    {/* SIDEBAR CONTAINER NAVIGATION */}
    <aside className="w-full md:w-64 bg-[#0f172a] text-[#94a3b8] flex flex-col justify-between p-4 shrink-0 shadow-xl z-20">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-[#3b82f6] flex items-center justify-center text-white font-bold text-xl shadow-md">
            N
          </div>

          <div>
            <h1 className="text-white font-semibold text-sm tracking-wide">
              Namaste ICD
            </h1>

            <p className="text-[10px] text-[#3b82f6] font-medium tracking-widest uppercase">
              Interop Engine
            </p>
          </div>
        </div>

        <nav className="mt-6 space-y-1">

          <button
            onClick={() => setActiveTab("Overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "Overview"
                ? "bg-[#3b82f6] text-white shadow-md"
                : "hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <span>📊</span>
            Operational Dashboard
          </button>

          <button
            onClick={() => setActiveTab("ICD-11 Finder")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "ICD-11 Finder"
                ? "bg-[#3b82f6] text-white shadow-md"
                : "hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <span>🔍</span>
            NAMASTE ↔ ICD-11 Mapper
          </button>

          <button
            onClick={() => setActiveTab("Batch Mapping")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "Batch Mapping"
                ? "bg-[#3b82f6] text-white shadow-md"
                : "hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <span>🗂️</span>
            Batch Ingestion Pipeline
          </button>

          <button
            onClick={() => setActiveTab("Analytics Reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "Analytics Reports"
                ? "bg-[#3b82f6] text-white shadow-md"
                : "hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <span>📈</span>
            Patient AI Diagnostics
          </button>

          <button
            onClick={() => setActiveTab("CREATE API")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "CREATE API"
                ? "bg-[#3b82f6] text-white shadow-md"
                : "hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            <span>🔑</span>
            Create Custom API
          </button>

        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-800 px-2 space-y-2">

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            System Sync Engine
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 text-center font-mono">
          <span className="text-white font-bold text-xs tracking-widest block">
            {currentTime.toLocaleTimeString()}
          </span>

          <span className="text-[9px] text-slate-500 block mt-0.5">
            {currentTime.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

      </div>
    </aside>

    {/* BODY WORKSPACE AREA */}
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 bg-white/40 p-4 rounded-xl shadow-sm backdrop-blur-sm">

        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">

            {activeTab === "Overview" &&
              "Operational Command Overview"}

            {activeTab === "ICD-11 Finder" &&
              "Universal Medical Taxonomy Mapper"}

            {activeTab === "Batch Mapping" &&
              "EHR Cross-Platform Batch Processing Pipeline"}

            {activeTab === "Analytics Reports" &&
              "Patient History & Multi-Modal Clinical Intake Hub"}

            {activeTab === "CREATE API" &&
              "Developer Portal & API Provision Factory"}

          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise healthcare interoperability deployment portal.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 text-[11px] font-semibold text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Core Pipeline Synced
        </div>

      </header>
        {/* VIEW 1: DASHBOARD */}
        {activeTab === "Overview" && (
          <>
            <div className="p-6 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white rounded-xl shadow-md border border-slate-800 space-y-1">
              <h3 className="text-md font-bold tracking-tight">
                Welcome, Clinical Infrastructure Administration Team 👋
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                Namaste ICD Interoperability Engine is auditing local clinical
                registries, translating cross-border traditional schemas, and
                streaming clean healthcare payloads into distributed regional
                hospital storage layers.
              </p>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Synced Concepts
                </span>
                <span className="text-xl font-bold text-blue-600 block mt-2 font-mono">
  {stats?.totalMappedPatients || 0}
</span>
                <span className="text-[9px] text-slate-400 block mt-1">
                  Cross-Database Vocabularies Loaded
                </span>
              </div> 

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">
    Mapping Accuracy
  </span>

  <span className="text-xl font-bold text-emerald-600 block mt-2 font-mono">
    {stats?.accuracy || 0}%
  </span>

  <span className="text-[9px] text-slate-400 block mt-1">
    Current Engine Precision
  </span>
</div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
    Pending Mappings
  </span>

  <span className="text-xl font-bold text-amber-600 block mt-2 font-mono">
    {stats?.pendingMappings || 0}
  </span>

  <span className="text-[9px] text-slate-400 block mt-1">
    Awaiting ICD Resolution
  </span>
</div>

             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
    Active Connected EHR Nodes
  </span>

  <span className="text-xl font-bold text-emerald-600 block mt-2 font-mono">
    14 Live Systems
  </span>

  <span className="text-[9px] text-slate-400 block mt-1">
    HL7 / FHIR Ingestion Handshakes
  </span>
</div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  API Translation Latency
                </span>
                <span className="text-xl font-bold text-slate-800 block mt-2 font-mono">
  42 ms
</span>
                <span className="text-[9px] text-slate-400 block mt-1">
                  Real-Time Core Compute Speed
                </span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 border-l-4 border-l-blue-500 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  Integrated API Search Tally
                </span>
                <span className="text-xl font-bold text-blue-700 block mt-2 font-mono">
  {stats?.searchesToday || 0} calls
</span>
                <span className="text-[9px] text-slate-500 block mt-1">
                  Live synchronized event telemetry
                </span>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Dynamic API Volume Metrics Trend
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Real-time vector tracking increases dynamically on every
                      operational user search layout trigger.
                    </p>
                  </div>

                  <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px] font-medium">
                    {["15 Days", "30 Days", "3 Months"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-3 py-1 rounded-md transition-all ${
                          timeframe === t
                            ? "bg-white text-slate-800 font-semibold shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full pt-4 px-2 relative overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${graphSpecs.width} ${graphSpecs.height}`}
                    className="w-full h-36 overflow-visible"
                  >
                    <defs>
                      <linearGradient
                        id="lineGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopColor="#3b82f6"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <line
                      x1="0"
                      y1={graphSpecs.height}
                      x2={graphSpecs.width}
                      y2={graphSpecs.height}
                      stroke="#e2e8f0"
                      strokeWidth="1.5"
                    />

                    <line
                      x1="0"
                      y1={graphSpecs.height / 2}
                      x2={graphSpecs.width}
                      y2={graphSpecs.height / 2}
                      stroke="#f1f5f9"
                      strokeDasharray="4"
                    />

                    <path
                      d={graphSpecs.areaD}
                      fill="url(#lineGrad)"
                    />

                    <path
                      d={graphSpecs.pathD}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {graphSpecs.pointsCoordinates.map((pt, idx) => (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill="#fff"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                        />
                      </g>
                    ))}
                  </svg>

                  <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    {(timeframeLabels?.[timeframe] || []).map(
                      (label, idx) => (
                        <span
                          key={idx}
                          className={`text-center ${
                            idx ===
                            (timeframeLabels?.[timeframe]?.length || 1) - 1
                              ? "text-blue-600 font-bold"
                              : ""
                          }`}
                        >
                          {label}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Taxonomy Allocation Balance
                  </h4>
                  <p className="text-xs text-slate-400">
                    Distribution profile of ingested local entries matching
                    target frameworks.
                  </p>
                </div>

                <div className="space-y-3 py-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>WHO ICD-11 Standards</span>
                      <span className="font-mono font-bold">65%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "65%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>NAMASTE Traditional Medicine</span>
                      <span className="font-mono font-bold">25%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: "25%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                      <span>Unmapped Custom Classifications</span>
                      <span className="font-mono font-bold">10%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full">
                      <div
                        className="bg-amber-400 h-2 rounded-full"
                        style={{ width: "10%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-slate-200">
                  🛡️ Ingestion streams compliant with global HL7 architecture
                  metrics.
                </div>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: UNIVERSAL MAPPER */}
{activeTab === "ICD-11 Finder" && (
  <div className="space-y-6">

    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
        ICD-11 Symptom Search
      </h3>

      <div className="flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter symptom (e.g. fever, cough, headache)"
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm"
        />

        <button
  onClick={async () => {
    try {
      console.log("Searching:", searchQuery);

      const result = await getICDBySymptom([
        searchQuery
      ]);

      console.log("ICD Result:", result);

      setIcdResult(result);
    } catch (err) {
      console.error("ICD Error:", err);
    }
  }}
>
  Search
</button> 
      </div>
    </div>

    {icdResult?.data?.data?.length > 0 && (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Symptom</th>
              <th className="p-3 text-left">ICD Code</th>
              <th className="p-3 text-left">Risk</th>
              <th className="p-3 text-left">Confidence</th>
            </tr>
          </thead>

          <tbody>
           {icdResult.data.data.map((item, index) => (
              <tr
                key={index}
                className="border-t"
              >
                <td className="p-3">
                  {item.symptom}
                </td>

                <td className="p-3 font-bold text-blue-600">
                  {item.icd?.icdCode}
                </td>

                <td className="p-3">
                  {item.fusion?.risk}
                </td>

                <td className="p-3">
                  {item.fusion?.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

  </div>
)}
             {/* VIEW 3: BATCH MAPPING */}
        {activeTab === "Batch Mapping" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Automated Multi-Record Batch Ingestion
              </h3>

              <p className="text-xs text-slate-400 mb-4">
                Upload bulk clinic documentation strings to uniformly parse
                international codes.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => injectBatchSample("injury")}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-all"
                >
                  📋 Load Injury Dataset Sample
                </button>

                <button
                  type="button"
                  onClick={() => injectBatchSample("chronic")}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg text-xs font-semibold transition-all"
                >
                  📋 Load Chronic Disease Dataset Sample
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  injectBatchSample("injury");
                }}
                className="space-y-4"
              >
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center bg-slate-50">
                  <span className="text-xs text-slate-500 font-medium block mb-1">
                    {batchFile
                      ? `Staged File Vector: ${batchFile}`
                      : "📁 Drag & Drop raw clinic tables or datasets here"}
                  </span>
                </div>

                <button
                  type="submit"
                  className="bg-[#0f172a] hover:bg-slate-800 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-sm"
                >
                  Execute Bulk Pipeline Conversion
                </button>
              </form>
            </div>

            {batchResults?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Processed Ingestion Matrix Output
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-200 text-[10px]">
                        <th className="p-4">
                          Raw Ingested Clinical Narrative
                        </th>
                        <th className="p-4">
                          Mapped Term Identification
                        </th>
                        <th className="p-4">Local ID Tag</th>
                        <th className="p-4">ICD-11 Targets</th>
                        <th className="p-4">Pipeline Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700 text-[11px]">
                      {batchResults.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-4 font-sans text-slate-800">
                            {row.rawTerm}
                          </td>

                          <td className="p-4 font-sans text-blue-600 font-semibold">
                            {row.mappedTerm}
                          </td>

                          <td className="p-4 text-slate-400">
                            {row.localId}
                          </td>

                          <td className="p-4">
                            {row.icd11Code ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold">
                                {row.icd11Code}
                              </span>
                            ) : (
                              <span className="text-slate-300 italic">
                                Unmapped
                              </span>
                            )}
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-[9px] font-bold ${
                                row.status === "SUCCESS"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: ANALYTICS / DIAGNOSTICS */}
        {activeTab === "Analytics Reports" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Patient Diagnostic Clinical File Parser
              </h3>

              <p className="text-xs text-slate-400 mb-4">
                Attach multi-modal clinic logs to execute direct disease
                predictive indexing.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => injectDiagnosticSample("mri")}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-all"
                >
                  ⚡ Inject Patient MRI Spine Scan Sample
                </button>

                <button
                  type="button"
                  onClick={() => injectDiagnosticSample("blood")}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg text-xs font-semibold transition-all"
                >
                  ⚡ Inject Patient Complex Blood Sample
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  injectDiagnosticSample("blood");
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    Clinical Presentation Symptoms
                  </label>

                  <textarea
                    value={patientInput.symptoms}
                    onChange={(e) =>
                      setPatientInput({
                        ...patientInput,
                        symptoms: e.target.value,
                      })
                    }
                    placeholder="Somatic markers profile configuration data..."
                    className="w-full h-28 bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg p-3 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Laboratory Assessment Attachment File Profile
                    </label>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 truncate font-mono">
                      {patientInput.fileName
                        ? `Loaded: ${patientInput.fileName} [${patientInput.fileType}]`
                        : "No physical attachment parsed yet"}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm"
                  >
                    Compute Ingestion Diagnostics Profile
                  </button>
                </div>
              </form>
            </div>

            {diagnosticResult && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* keep rest of your diagnosticResult cards unchanged */}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: CREATE API */}
        {activeTab === "CREATE API" && (
          <div className="space-y-6 animate-fadeIn">
            {showCreatedKey && (
              <div className="p-5 bg-slate-900 text-white rounded-xl border border-emerald-500/30 shadow-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <button
                    type="button"
                    onClick={() => setShowCreatedKey(false)}
                    className="text-slate-400 hover:text-white transition-colors text-sm font-bold bg-white/10 w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-base">🎉</span>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    API Endpoint Provisioned Successfully
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Your secure connection pipeline route has been activated.
                </p>

                <div className="bg-black/40 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row gap-3">
                  <div className="font-mono text-xs text-emerald-400 bg-black/30 px-3 py-2 rounded border border-slate-900 flex-1 break-all">
                    {generatedKey}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(generatedKey);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`px-4 py-2 text-white text-xs font-semibold rounded-lg ${
                      copied
                        ? "bg-emerald-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {copied ? "Copied Token!" : "Copy Token"}
                  </button>
                </div>
              </div>
            )}
         {/* RESPONSIVE DUAL PANELS: Form Entry & Active Endpoint Tables */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

  {/* PANEL 1: API Endpoint Factory Form Builder */}
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 xl:col-span-1">
    <div>
      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        🛠️ Endpoint Provision Factory
      </h3>
      <p className="text-xs text-slate-400 mt-0.5">
        Spin up immediate secure microservices linked straight into core EHR network adapters.
      </p>
    </div>

    <form onSubmit={handleCreateApiSubmit} className="space-y-4 text-xs">
      <div className="space-y-1">
        <label className="font-bold text-slate-500 uppercase tracking-wide block">
          Service Node Name
        </label>
        <input
          type="text"
          required
          value={newApi.name}
          onChange={(e) =>
            setNewApi({ ...newApi, name: e.target.value })
          }
          placeholder="e.g., Apollo Live Diagnostics, Saltlake Lab Sync"
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
        />
      </div>

      <div className="space-y-1">
        <label className="font-bold text-slate-500 uppercase tracking-wide block">
          Route Access Path (Endpoint)
        </label>

        <div className="flex rounded-lg shadow-sm bg-slate-100 border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
          <span className="px-3 py-2.5 text-slate-400 bg-slate-100 border-r border-slate-200 select-none font-mono font-medium">
            /api/v1
          </span>

          <input
            type="text"
            required
            value={newApi.endpoint}
            onChange={(e) =>
              setNewApi({
                ...newApi,
                endpoint: e.target.value,
              })
            }
            placeholder="/patient-lookup"
            className="flex-1 bg-slate-50 border-none text-slate-800 text-xs px-3 py-2.5 focus:outline-none font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase tracking-wide block">
            HTTP Verb Method
          </label>

          <select
            value={newApi.method}
            onChange={(e) =>
              setNewApi({
                ...newApi,
                method: e.target.value,
              })
            }
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2.5 focus:outline-none font-bold"
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase tracking-wide block">
            Rate Limit Threshold
          </label>

          <select
            value={newApi.rateLimit}
            onChange={(e) =>
              setNewApi({
                ...newApi,
                rateLimit: e.target.value,
              })
            }
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2.5 focus:outline-none font-semibold"
          >
            <option value="100/min">100 / min</option>
            <option value="500/min">500 / min</option>
            <option value="1000/min">1,000 / min</option>
            <option value="5000/min">5,000 / min</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-md transition-all tracking-wide mt-2"
      >
        Generate Custom API Endpoint
      </button>
    </form>
  </div>

  {/* PANEL 2: Interactive Real-Time Registry Table Engine */}
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden xl:col-span-2">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          📡 Active Managed Interop Registry
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Live routing nodes handling secure inbound HL7 / FHIR pipeline transactions.
        </p>
      </div>

      <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 font-bold px-2.5 py-1 rounded-full font-mono">
        {apiList.length} Endpoints Registered
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50/70 text-slate-400 font-bold uppercase border-b border-slate-200 text-[10px]">
            <th className="p-4">Service Endpoint Specs</th>
            <th className="p-4">HTTP Method</th>
            <th className="p-4">System ID Code</th>
            <th className="p-4">Rate Limiting</th>
            <th className="p-4">Deployment Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {apiList.map((api) => (
            <tr
              key={api.id}
              className="hover:bg-slate-50/60 transition-colors"
            >
              <td className="p-4">
                <span className="text-slate-800 font-semibold block">
                  {api.name}
                </span>

                <span className="text-blue-600 font-mono font-medium block mt-0.5 text-[11px] select-all">
                  /api/v1{api.endpoint}
                </span>
              </td>

              <td className="p-4">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    api.method === "GET"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : api.method === "POST"
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : api.method === "PUT"
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}
                >
                  {api.method}
                </span>
              </td>

              <td className="p-4 font-mono text-slate-400 text-[11px]">
                {api.id}
              </td>

              <td className="p-4 font-mono text-slate-600 font-medium">
                {api.rateLimit}
              </td>

              <td className="p-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {api.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

</div>
</div>
)}
</main>
</div>
);
}