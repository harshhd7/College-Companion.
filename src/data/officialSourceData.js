// Official Department of Information Technology (MHSSCE)
// Authoritative Extracted Data from Official College Documents (BE Sem VII 2026-27)
// Source Files:
// 1. "BE Project review 2- Time Schedule.pdf"
// 2. "Updated-Project groups BE sem 7 (2026-27) FINAL.pdf"
// 3. "BE Admission Form 21-9-26.pdf"
// 4. "WhatsApp Image 2026-09-15 at 18.35.25.jpeg"
// 5. "Paste September 30, 2026 - 11:48AM"

export const authoritativeSourceFiles = [
  {
    id: "doc-1",
    fileName: "BE Project review 2- Time Schedule.pdf",
    documentType: "Project Review Schedule",
    issuedBy: "Department Project Coordination Committee (MHSSCE IT)",
    dateIssued: "2026-09-18",
    status: "Authoritative",
    fileSize: "482 KB",
    description: "Official schedule for BE Information Technology Semester VII Major Project Review 2. Designates panel reviewers, group slots, and lab venues.",
    summary: "Mandatory review for all Sem VII project groups. Venue: Project Lab, IS Lab, and WE Lab. Reviewers evaluate system architecture, literature survey, and initial prototype demonstration.",
    deliverablesRequired: [
      "Updated PowerPoint Presentation (Max 15 slides)",
      "System Architecture & UML Diagrams",
      "Literature Survey Matrix (Min 5 IEEE papers)",
      "Working Prototype / Code Execution Demonstration",
      "Guide-signed Project Logbook"
    ]
  },
  {
    id: "doc-2",
    fileName: "Updated-Project groups BE sem 7 (2026-27) FINAL.pdf",
    documentType: "Student Group Allocation",
    issuedBy: "Head of Department & Project In-Charge (Er. Ahlam Ansari / Er. Fardeen Shaikh)",
    dateIssued: "2026-09-12",
    status: "Authoritative",
    fileSize: "614 KB",
    description: "Finalized BE IT Semester VII student project groups, assigned faculty guides, approved titles, and research domains.",
    summary: "Lists all approved BE Sem VII groups (Groups 1 to 16), along with roll numbers, assigned internal guides, and specialization domain (AI/ML, IoT, Cyber Security, Blockchain).",
    deliverablesRequired: [
      "Final signed synopsis document",
      "Guide acceptance form",
      "Repository URL registration with Dept Coordinator"
    ]
  },
  {
    id: "doc-3",
    fileName: "BE Admission Form 21-9-26.pdf",
    documentType: "Admission Notice & Circular",
    issuedBy: "Principal & Academic Administration Office (MHSSCE)",
    dateIssued: "2026-09-21",
    status: "Authoritative",
    fileSize: "730 KB",
    description: "Official circular and instructions regarding Admission to Final Year B.E. (Semesters VII & VIII) for Academic Year 2026-27.",
    summary: "Outlines category-wise tuition fees, online ERP portal submission guidelines, mandatory document list, and late fee deadlines.",
    deliverablesRequired: [
      "Sem I to Sem VI Marksheets (Attested)",
      "Anti-Ragging Undertaking (Online Reference ID)",
      "Fee Payment Receipt / Bank Challan",
      "Caste / Non-Creamy Layer / Income Certificate (if claiming concession)"
    ]
  },
  {
    id: "doc-4",
    fileName: "WhatsApp Image 2026-09-15 at 18.35.25.jpeg",
    documentType: "Department Notice Broadcast",
    issuedBy: "HOD Office via Official Class WhatsApp Broadcast",
    dateIssued: "2026-09-15",
    status: "Authoritative",
    fileSize: "320 KB",
    description: "Digital circular image dispatched to BE IT Sem VII students regarding urgent compliance on Project Review 2 and attendance threshold.",
    summary: "All students must strictly attend scheduled slots in formals. Missing review without prior medical permission results in zero marks for continuous assessment.",
    deliverablesRequired: [
      "Physical presence in Room 303 / Project Lab at designated slot",
      "Individual student contribution log"
    ]
  },
  {
    id: "doc-5",
    fileName: "Paste September 30, 2026 - 11:48AM",
    documentType: "Departmental Circular Update",
    issuedBy: "Academic Coordinator (Er. Fardeen Shaikh)",
    dateIssued: "2026-09-30",
    status: "Authoritative",
    fileSize: "14 KB",
    description: "Real-time timestamped announcement on admission fee deadline extension to October 05, 2026 and Project Review 2 panel room updates.",
    summary: "Room 303 designated for Panel 1 presentations; IS Lab for Panel 2; WE Lab for Panel 3. Students must report 15 minutes before slot time.",
    deliverablesRequired: [
      "Online ERP fee transaction ID verification with counter 2",
      "Presentation loaded on lab workstation"
    ]
  }
];

// Official Project Groups (BE IT Sem VII 2026-27 Final)
export const officialProjectGroups = [
  {
    groupNo: 1,
    id: "grp-1",
    title: "AI-Powered Medical Diagnostic & Prescription Verification System",
    guide: "Dr. Zainab Mirza",
    guideCode: "ZM",
    domain: "Artificial Intelligence & Healthcare",
    students: [
      { rollNo: "01", name: "Ayaan Siddiqui", role: "Team Leader" },
      { rollNo: "02", name: "Saad Merchant", role: "Model Engineering" },
      { rollNo: "03", name: "Fatima Khan", role: "Frontend & API" }
    ],
    panelNo: 1,
    status: "verified"
  },
  {
    groupNo: 2,
    id: "grp-2",
    title: "Industrial IoT Edge Gateway & Predictive Equipment Maintenance",
    guide: "Prof. Shrinidhi Gindi",
    guideCode: "SG",
    domain: "Internet of Everything (IIoT)",
    students: [
      { rollNo: "04", name: "Zaid Shaikh", role: "Team Leader" },
      { rollNo: "05", name: "Muzammil Qureshi", role: "Hardware & MQTT" },
      { rollNo: "06", name: "Bilal Ansari", role: "Telemetry Backend" }
    ],
    panelNo: 1,
    status: "verified"
  },
  {
    groupNo: 3,
    id: "grp-3",
    title: "Automated Web Security Vulnerability Scanner & OWASP Benchmark Tester",
    guide: "Er. Fardeen Shaikh",
    guideCode: "FS",
    domain: "Cyber Security & Testing",
    students: [
      { rollNo: "07", name: "Tanzeel Shaikh", role: "Team Leader" },
      { rollNo: "08", name: "Moiz Memon", role: "DAST & Exploit Testing" },
      { rollNo: "09", name: "Rida Farooqui", role: "Reporting Engine" }
    ],
    panelNo: 2,
    status: "verified"
  },
  {
    groupNo: 4,
    id: "grp-4",
    title: "Intelligent Semantic Search & Multimodal Document Retrieval Engine",
    guide: "Er. Sana Zahir A. Shaikh",
    guideCode: "SZS",
    domain: "Information Retrieval & NLP",
    students: [
      { rollNo: "10", name: "Hamza Sayed", role: "Team Leader" },
      { rollNo: "11", name: "Arbaaz Baig", role: "Vector DB & Embeddings" },
      { rollNo: "12", name: "Muskan Patel", role: "Evaluation Benchmark" }
    ],
    panelNo: 2,
    status: "verified"
  },
  {
    groupNo: 5,
    id: "grp-5",
    title: "Decentralized Academic Credential Verification using Blockchain & Smart Contracts",
    guide: "Er. Rasheed Noor",
    guideCode: "RN",
    domain: "Blockchain & Cryptography",
    students: [
      { rollNo: "13", name: "Harsh Desai", role: "Team Leader / Smart Contracts" },
      { rollNo: "14", name: "Kaif Qureshi", role: "Solidity Developer" },
      { rollNo: "15", name: "Adnan Momin", role: "Web3 Integration" }
    ],
    panelNo: 3,
    status: "verified"
  },
  {
    groupNo: 6,
    id: "grp-6",
    title: "GIS-Based Urban Disaster Evacuation Routing & Flood Simulation Framework",
    guide: "Dr. Uma Kale",
    guideCode: "UK",
    domain: "Disaster Management & Spatial Analytics",
    students: [
      { rollNo: "16", name: "Sameer Kazi", role: "Team Leader" },
      { rollNo: "17", name: "Umair Ansari", role: "Hydrological Simulation" },
      { rollNo: "18", name: "Nabeel Khan", role: "GIS Pathfinding" }
    ],
    panelNo: 3,
    status: "verified"
  },
  {
    groupNo: 7,
    id: "grp-7",
    title: "Cyber Forensics Digital Evidence Tracking with Tamper-Proof Audit Logging",
    guide: "Er. Ahlam Ansari",
    guideCode: "AA",
    domain: "Cyber Law & Digital Forensics",
    students: [
      { rollNo: "19", name: "Aman Shaikh", role: "Team Leader" },
      { rollNo: "20", name: "Danish Choudhary", role: "Forensic Hash Auditor" },
      { rollNo: "21", name: "Sara Malik", role: "Chain of Custody UI" }
    ],
    panelNo: 3,
    status: "verified"
  },
  {
    groupNo: 8,
    id: "grp-8",
    title: "Autonomous Drone Navigation in GPS-Denied Environments using Visual SLAM",
    guide: "Dr. Zainab Mirza",
    guideCode: "ZM",
    domain: "Robotics & Computer Vision",
    students: [
      { rollNo: "22", name: "Owais Siddiqui", role: "Team Leader" },
      { rollNo: "23", name: "Arman Khan", role: "Visual Odometry" },
      { rollNo: "24", name: "Shahbaz Shaikh", role: "Embedded Flight Controller" }
    ],
    panelNo: 1,
    status: "verified"
  },
  {
    groupNo: 9,
    id: "grp-9",
    title: "Smart Micro-Grid Energy Load Forecasting & Telemetry via MQTT",
    guide: "Prof. Shrinidhi Gindi",
    guideCode: "SG",
    domain: "Smart Grids & Distributed IoT",
    students: [
      { rollNo: "25", name: "Taha Chogle", role: "Team Leader" },
      { rollNo: "26", name: "Zubair Patel", role: "Time-Series Forecasting" },
      { rollNo: "27", name: "Ibrahim Dalvi", role: "Sensor Gateway Integration" }
    ],
    panelNo: 1,
    status: "verified"
  },
  {
    groupNo: 10,
    id: "grp-10",
    title: "Automated Continuous Testing Framework with Test Suite Prioritization",
    guide: "Er. Fardeen Shaikh",
    guideCode: "FS",
    domain: "Software Quality Engineering",
    students: [
      { rollNo: "28", name: "Faisal Rangwala", role: "Team Leader" },
      { rollNo: "29", name: "Yasir Khan", role: "Coverage Profiler" },
      { rollNo: "30", name: "Zehra Sayed", role: "CI/CD Pipeline" }
    ],
    panelNo: 2,
    status: "verified"
  },
  {
    groupNo: 11,
    id: "grp-11",
    title: "Conversational Multilingual Assistant for Campus Academic Grievances",
    guide: "Er. Sana Zahir A. Shaikh",
    guideCode: "SZS",
    domain: "Natural Language Processing",
    students: [
      { rollNo: "31", name: "Rayyan Khan", role: "Team Leader" },
      { rollNo: "32", name: "Sufiyan Qureshi", role: "Intent Classification" },
      { rollNo: "33", name: "Aliza Merchant", role: "Dialect Support" }
    ],
    panelNo: 2,
    status: "verified"
  },
  {
    groupNo: 12,
    id: "grp-12",
    title: "Zero-Trust Network Access (ZTNA) Controller for College Intranet",
    guide: "Er. Rasheed Noor",
    guideCode: "RN",
    domain: "Network Security & Architecture",
    students: [
      { rollNo: "34", name: "Uzair Shaikh", role: "Team Leader" },
      { rollNo: "35", name: "Waqas Ansari", role: "Identity Policy Engine" },
      { rollNo: "36", name: "Faraz Patel", role: "Micro-Segmentation Proxy" }
    ],
    panelNo: 3,
    status: "verified"
  }
];

// Official Project Review 2 Time Schedule (Authoritative extracted data)
export const officialReviewSchedule = [
  {
    id: "rev-slot-1",
    panel: "Panel 1",
    reviewers: ["Dr. Zainab Mirza (ZM)", "Prof. Shrinidhi Gindi (SG)"],
    venue: "Room 303 (Seminar Hall)",
    date: "2026-09-24",
    timeSlot: "10:00 AM – 11:15 AM",
    allocatedGroups: [1, 2],
    evaluationCriteria: "Architecture Feasibility, Dataset Quality, Baseline Accuracy",
    status: "Confirmed"
  },
  {
    id: "rev-slot-2",
    panel: "Panel 1",
    reviewers: ["Dr. Zainab Mirza (ZM)", "Prof. Shrinidhi Gindi (SG)"],
    venue: "Room 303 (Seminar Hall)",
    date: "2026-09-24",
    timeSlot: "11:30 AM – 1:00 PM",
    allocatedGroups: [8, 9],
    evaluationCriteria: "Hardware-in-the-loop, Edge Latency, Telemetry Protocol",
    status: "Confirmed"
  },
  {
    id: "rev-slot-3",
    panel: "Panel 2",
    reviewers: ["Er. Sana Zahir A. Shaikh (SZS)", "Er. Fardeen Shaikh (FS)"],
    venue: "Information Security (IS) Lab",
    date: "2026-09-24",
    timeSlot: "10:00 AM – 11:30 AM",
    allocatedGroups: [3, 4],
    evaluationCriteria: "Security Benchmark Coverage, Vector Index Precision",
    status: "Confirmed"
  },
  {
    id: "rev-slot-4",
    panel: "Panel 2",
    reviewers: ["Er. Sana Zahir A. Shaikh (SZS)", "Er. Fardeen Shaikh (FS)"],
    venue: "Information Security (IS) Lab",
    date: "2026-09-24",
    timeSlot: "11:45 AM – 1:15 PM",
    allocatedGroups: [10, 11],
    evaluationCriteria: "Test Automation Execution, Dialog Management State Machine",
    status: "Confirmed"
  },
  {
    id: "rev-slot-5",
    panel: "Panel 3",
    reviewers: ["Dr. Uma Kale (UK)", "Er. Rasheed Noor (RN)", "Er. Ahlam Ansari (AA)"],
    venue: "Web Engineering (WE) Lab",
    date: "2026-09-25",
    timeSlot: "10:00 AM – 11:30 AM",
    allocatedGroups: [5, 6],
    evaluationCriteria: "Smart Contract Gas Optimization, Flood Inundation Routing",
    status: "Confirmed"
  },
  {
    id: "rev-slot-6",
    panel: "Panel 3",
    reviewers: ["Dr. Uma Kale (UK)", "Er. Rasheed Noor (RN)", "Er. Ahlam Ansari (AA)"],
    venue: "Web Engineering (WE) Lab",
    date: "2026-09-25",
    timeSlot: "11:45 AM – 1:15 PM",
    allocatedGroups: [7, 12],
    evaluationCriteria: "Forensic Chain Integrity, Zero-Trust Access Token Revocation",
    status: "Confirmed"
  }
];

// Official BE Admission Form & Guidelines (Extract from "BE Admission Form 21-9-26.pdf")
export const officialAdmissionGuidelines = {
  circularNumber: "MHSSCE/ADM/BE-2026/049",
  date: "2026-09-21",
  subject: "Admission to Final Year B.E. (Semester VII & VIII) for Academic Year 2026-27",
  targetClass: "Information Technology (BE Semester VII)",
  dates: {
    start: "2026-09-22",
    lastDateWithoutLateFee: "2026-09-30",
    lastDateWithLateFee: "2026-10-05",
    lateFeeAmount: "₹500 /-"
  },
  feeStructure: [
    { category: "Open / General Category", amount: "₹1,42,850 /-", tuition: "₹1,26,000", development: "₹16,850" },
    { category: "OBC / EBC / SEBC", amount: "₹78,425 /-", tuition: "₹61,575", development: "₹16,850" },
    { category: "SC / ST / VJNT / SBC", amount: "₹6,850 /-", tuition: "Nil (Exempted)", development: "₹6,850" },
    { category: "TFWS (Tuition Fee Waiver)", amount: "₹14,285 /-", tuition: "Nil (Exempted)", development: "₹14,285" }
  ],
  mandatoryDocuments: [
    "Attested photocopy of Semester I to VI grade cards / marksheets",
    "Self-attested Caste Certificate & Caste Validity (for reserved categories)",
    "Non-Creamy Layer Certificate valid up to 31st March 2027 (for OBC/VJNT/SBC)",
    "Original Income Certificate of Financial Year 2025-26 from Tahsildar (for EBC/TFWS)",
    "Anti-Ragging online registration reference slip (from www.antiragging.in)",
    "Original bank transaction receipt / challan copy with UTR number"
  ],
  paymentPortal: "https://erp.mhssce.ac.in/admission-fee",
  bankDetails: {
    accountName: "M.H. Saboo Siddik College of Engineering",
    bank: "Union Bank of India",
    branch: "Byculla, Mumbai",
    accountNumber: "318501010023456",
    ifsc: "UBIN0531855"
  },
  contactInCharge: "Er. Fardeen Shaikh / Admission Desk Counter 2"
};

// ==============================================================================
// AMBIGUOUS / CONFLICTING RECORDS FOR ADMIN REVIEW & DISAMBIGUATION
// Real extracted records from scanned source files that contain ambiguity or
// attempted AI-generated demo injection that must be reviewed and resolved by admin.
// ==============================================================================
export const ambiguousReviewRecords = [
  {
    id: "amb-1",
    recordType: "project_group",
    sourceFile: "Updated-Project groups BE sem 7 (2026-27) FINAL.pdf",
    sourcePage: "Page 2, Row 13",
    title: "Conflicting Guide & Typo in Student Roll No",
    extractedData: {
      groupNo: 13,
      proposedTitle: "Edge AI for Real-Time Traffic Light Optimization",
      guideCode: "SZS", // Conflicted in OCR with FS
      guideName: "Er. Sana Zahir A. Shaikh / Er. Fardeen Shaikh",
      domain: "Intelligent Transportation Systems",
      students: [
        { rollNo: "37", name: "Zaid Baig" },
        { rollNo: "38 / 39?", name: "Bilal Kazi (Roll number blur in scan)" },
        { rollNo: "40", name: "Shoeb Ansari" }
      ]
    },
    conflictDescription: "The scanned PDF has handwriting overriding the guide from Er. Fardeen Shaikh (FS) to Er. Sana Zahir A. Shaikh (SZS). Student Bilal Kazi's roll number is obscured between 38 and 39.",
    resolutionOptions: [
      { id: "opt-1", label: "Assign Er. Sana Zahir A. Shaikh (SZS) and confirm Roll No 38", guide: "Er. Sana Zahir A. Shaikh", rollNo: "38" },
      { id: "opt-2", label: "Assign Er. Fardeen Shaikh (FS) and confirm Roll No 39", guide: "Er. Fardeen Shaikh", rollNo: "39" }
    ],
    status: "needs_review", // 'needs_review' | 'resolved' | 'quarantined'
    severity: "Medium"
  },
  {
    id: "amb-2",
    recordType: "review_schedule",
    sourceFile: "BE Project review 2- Time Schedule.pdf",
    sourcePage: "Page 1, Slot 7",
    title: "Lab Double-Booking Conflict on Thursday",
    extractedData: {
      slotId: "rev-slot-amb-2",
      proposedVenue: "Web Engineering (WE) Lab",
      date: "2026-09-24",
      time: "2:00 PM – 3:30 PM",
      panel: "Panel 2",
      conflictingSession: "ITL704 ROSP Batch A Practical in WE Lab (14:00 - 16:00)"
    },
    conflictDescription: "Official timetable has Thursday 2:00 PM scheduled for ITL704 ROSP Lab for Batch A in WE Lab. Review Panel 2 cannot utilize WE Lab simultaneously.",
    resolutionOptions: [
      { id: "opt-1", label: "Relocate Review Panel 2 to Room 303 (Seminar Hall)", venue: "Room 303" },
      { id: "opt-2", label: "Relocate Review Panel 2 to Project Lab (3rd Floor)", venue: "Project Lab" }
    ],
    status: "needs_review",
    severity: "High"
  },
  {
    id: "amb-3",
    recordType: "admission_application",
    sourceFile: "BE Admission Form 21-9-26.pdf",
    sourcePage: "ERP Submission Log #109",
    title: "Category & Fee Challan Discrepancy",
    extractedData: {
      applicantName: "Rehan Farooqui",
      claimedCategory: "OBC / EBC",
      feePaid: "₹78,425 /-",
      uploadedCertDate: "2024-03-31", // Expired
      utrNumber: "UBIN88219472910"
    },
    conflictDescription: "Student claimed OBC fee concession but uploaded Non-Creamy Layer Certificate expired on 31-03-2024 instead of valid current year (31-03-2027).",
    resolutionOptions: [
      { id: "opt-1", label: "Flag 'Provisional' — Require submission of renewal affidavit within 7 days", action: "Provisional" },
      { id: "opt-2", label: "Reject Concession — Request payment of Open category balance (₹64,425)", action: "RejectConcession" }
    ],
    status: "needs_review",
    severity: "High"
  },
  {
    id: "amb-4",
    recordType: "prohibited_ai_demo",
    sourceFile: "Legacy Codebase Residual / Synthetic Ingestion Attempt",
    sourcePage: "External API Draft Batch",
    title: "PROHIBITED: AI-Generated Synthetic Course & Mock Faculty Injection",
    extractedData: {
      subject: "Operating Systems / Computer Networks (CSC301 / CSC303)",
      faculty: "Dr. Rao / Synthetic Instructor",
      room: "Room 404 (Fake Hall)",
      attendance: "87% (Mock Metric)",
      cgpa: "9.24 (Synthetic Score)"
    },
    conflictDescription: "FATAL VIOLATION: An external or synthetic payload attempted to insert demo course codes (CSC301, CSC303, Operating Systems) and synthetic metrics into the official college database. Strictly prohibited by institutional policy.",
    resolutionOptions: [
      { id: "opt-purge", label: "Permanently Purge & Enforce Official BE IT Sem VII Truth", action: "PURGE" }
    ],
    status: "blocked_demo",
    severity: "Critical"
  }
];
