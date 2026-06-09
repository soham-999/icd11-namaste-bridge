// src/data.js

export const interoperabilityMetrics = [
  {
    title: "Total Synced Concepts",
    value: "14,820",
    change: "+12.3%",
    isUp: true
  },
  {
    title: "API Engine Latency",
    value: "34ms",
    change: "-4.1%",
    isUp: true
  },
  {
    title: "Active EHR Nodes",
    value: "18 Active",
    change: "Stable",
    isUp: true
  },
  {
    title: "Mapping Mismatches",
    value: "2",
    change: "-48.2%",
    isUp: true
  }
];

export const mappingActivityData = [
  { day: "Mon May 25", val: 420, pct: "45%" },
  { day: "Tue May 26", val: 510, pct: "55%" },
  { day: "Wed May 27", val: 490, pct: "52%" },
  { day: "Thu May 28", val: 680, pct: "75%" },
  { day: "Fri May 29", val: 720, pct: "80%" },
  { day: "Sat May 30", val: 310, pct: "35%" },
  { day: "Sun May 31", val: 890, pct: "95%" }
];

export const terminologyDistribution = [
  { name: "Ayurveda (AYU)", pct: 45, color: "bg-emerald-500", strokeDash: "45 100", strokeOffset: "0" },
  { name: "Unani (UNA)", pct: 25, color: "bg-blue-600", strokeDash: "25 100", strokeOffset: "-45" },
  { name: "Siddha (SID)", pct: 15, color: "bg-indigo-600", strokeDash: "15 100", strokeOffset: "-70" },
  { name: "Homeopathy (HOM)", pct: 10, color: "bg-amber-500", strokeDash: "10 100", strokeOffset: "-85" },
  { name: "Sowa-Rigpa (SOW)", pct: 5, color: "bg-sky-500", strokeDash: "5 100", strokeOffset: "-95" }
];

export const recentMappings = [
  { source: "Amavata", target: "1B10.2", status: "Success" },
  { source: "Tamaka Shwasa", target: "CA23.0", status: "Success" },
  { source: "Zeequn Nafas", target: "CA23.0", status: "Success" },
  { source: "Sandhivata", target: "FA01.Z", status: "Success" },
  { source: "Kasa", target: "MD11", status: "Pending" }
];

export const systemAuditLogs = [
  {
    id: 1,
    type: "info",
    title: "FHIR Bundle Validated",
    time: "2 mins ago",
    msg: "ConceptMap resource bound successfully to local EHR node."
  },
  {
    id: 2,
    type: "low",
    title: "Unmapped Term Flagged",
    time: "12 mins ago",
    msg: "Local term 'Madhumeha' requested mapping optimization query."
  },
  {
    id: 3,
    type: "high",
    title: "Connection Alert",
    time: "1 hr ago",
    msg: "External clinic network node dropped handshake packets intermittently."
  }
];
export const kpiData = interoperabilityMetrics;

export const trafficData = mappingActivityData.map(item => ({
  name: item.day,
  value: item.val
}));

export const chapterData = terminologyDistribution.map(item => ({
  name: item.name,
  value: item.pct
}));

export const topDiagnoses = recentMappings.map(item => ({
  code: item.target,
  diagnosis: item.source,
  cases: "N/A",
  percentage: item.status
}));