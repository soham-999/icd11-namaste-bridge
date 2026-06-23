// src/data.js

export const mockPatients = [
  {
    id: "PAT-2026-001",
    name: "Arjun Mehta",
    age: 42,
    gender: "Male",
    status: "Pending Validation",
    lastVisit: "2026-06-15",
    clinicalNotes: "Patient presenting with chronic recurring headaches exacerbated by mental stress and lack of sleep. Associated with localized temporal burning sensation."
  },
  {
    id: "PAT-2026-002",
    name: "Sunita Rao",
    age: 55,
    gender: "Female",
    status: "Fully Synced",
    lastVisit: "2026-06-19",
    clinicalNotes: "Chronic knee pain presenting with joint stiffness, popping sounds during movement, and cold weather intolerance."
  }
];

export const namasteToIcdMatches = {
  "Vataja Shirashoola": [
    {
      icdCode: "TM12.1",
      title: "Vataja Shirashoola Disorders",
      confidence: 0.96,
      matchType: "Semantic Exact",
      chapter: "Chapter 26: Traditional Medicine Conditions - Module I",
      description: "A condition characterized by pricking or throbbing headache primarily caused by an imbalance in Vata Dosha."
    },
    {
      icdCode: "TM12.9",
      title: "Traditional Medicine Headache Disorder, Unspecified",
      confidence: 0.74,
      matchType: "Broad Mapping",
      chapter: "Chapter 26: Module I",
      description: "General classification for cephalalgia presenting within traditional medicine diagnostic criteria."
    }
  ],
  "Sandhigata Vata": [
    {
      icdCode: "TM15.4",
      title: "Sandhigata Vata (Osteoarthropathy)",
      confidence: 0.94,
      matchType: "Semantic Exact",
      chapter: "Chapter 26: Traditional Medicine Conditions",
      description: "Degenerative joint disease corresponding to Vata localization within the skeletal articulations."
    }
  ]
};

export const icdToNamasteMatches = {
  "TM12.1": [
    { term: "Vataja Shirashoola", formulationMatch: "Dashamoola Katutrayam", confidence: 0.96 },
    { term: "Ardhavavabhedaka", formulationMatch: "Pathyakshadhatryadi", confidence: 0.68 }
  ]
};

export const globalHistoryLog = [
  {
    id: "LOG-9912",
    timestamp: "2026-06-21 14:22:10",
    operator: "Dr. A. Upadhyay",
    action: "Validated Mapping",
    details: "Vataja Shirashoola ➔ TM12.1 (PAT-2026-001)",
    status: "SUCCESS"
  },
  {
    id: "LOG-9911",
    timestamp: "2026-06-21 11:05:43",
    operator: "System Pipeline",
    action: "Bulk Ingestion Ingested",
    details: "Processed 12 clinic legacy rows via CSV ingestion",
    status: "SUCCESS"
  }
];