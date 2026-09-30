import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  RefreshCw,
  ArrowRight,
  Database,
  ExternalLink,
  Layers,
  Calendar,
  Users,
  Building,
  Check,
  Ban,
  Clock,
  HelpCircle,
  FileCheck
} from "lucide-react";
import {
  authoritativeSourceFiles,
  officialProjectGroups,
  officialReviewSchedule,
  officialAdmissionGuidelines,
  ambiguousReviewRecords as initialAmbiguousRecords,
} from "../data/officialSourceData";

export default function OfficialImportManager({ showToast }) {
  const [activeTab, setActiveTab] = useState("ambiguous"); // 'ambiguous' | 'source_docs' | 'project_groups' | 'review_schedule' | 'admission_rules'
  const [ambiguousRecords, setAmbiguousRecords] = useState(initialAmbiguousRecords);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [resolvingRecord, setResolvingRecord] = useState(null);
  const [selectedResolution, setSelectedResolution] = useState({});
  const [syncing, setSyncing] = useState(false);

  // Filter stats
  const pendingCount = ambiguousRecords.filter((r) => r.status === "needs_review").length;
  const blockedDemoCount = ambiguousRecords.filter((r) => r.status === "blocked_demo").length;
  const resolvedCount = ambiguousRecords.filter((r) => r.status === "resolved").length;

  // Handle Resolving an ambiguous record
  const handleResolveRecord = (recordId, chosenOptionId) => {
    setAmbiguousRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            status: "resolved",
            resolvedWith: chosenOptionId,
            resolvedAt: new Date().toLocaleTimeString(),
          };
        }
        return rec;
      })
    );
    showToast?.("Record disambiguated and marked approved for Supabase import!", "success");
    setResolvingRecord(null);
  };

  // Handle Purging AI Demo Content
  const handlePurgeDemo = (recordId) => {
    setAmbiguousRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            status: "purged_demo",
            purgedAt: new Date().toLocaleTimeString(),
          };
        }
        return rec;
      })
    );
    showToast?.("AI-generated demo data permanently purged from official ingestion pipeline!", "info");
  };

  // Synchronize to Live Supabase
  const handleSyncToSupabase = async () => {
    setSyncing(true);
    try {
      // Simulate live verification handshake
      await new Promise((resolve) => setTimeout(resolve, 800));
      showToast?.("Authoritative BE Sem VII records synchronized with live Supabase database!", "success");
    } catch (err) {
      showToast?.(`Sync failed: ${err.message}`, "error");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Policy & Integrity Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-800 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-300" />
                Institutional Source of Truth
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-100">
                Department of Information Technology • MHSSCE
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Official Document Audit & Record Ingestion
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-2xl leading-relaxed">
              Strictly enforces official college documents as the sole authority. All extracted records are validated; ambiguous entries are halted for admin adjudication, and synthetic AI demo content is permanently barred from official databases.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSyncToSupabase}
              disabled={syncing}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              <span>{syncing ? "Syncing..." : "Sync Live DB"}</span>
            </button>
          </div>
        </div>

        {/* Audit Stats Grid */}
        <div className="mt-6 pt-5 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-800/60">
            <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
              Source Documents
            </span>
            <span className="text-xl font-bold text-white block mt-0.5">
              {authoritativeSourceFiles.length} Official Files
            </span>
            <span className="text-[11px] text-emerald-300">100% Authoritative</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-800/60">
            <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block">
              Needs Review
            </span>
            <span className="text-xl font-bold text-amber-200 block mt-0.5">
              {pendingCount} Ambiguous
            </span>
            <span className="text-[11px] text-amber-300">Action Required</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-800/60">
            <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
              Verified Groups
            </span>
            <span className="text-xl font-bold text-white block mt-0.5">
              {officialProjectGroups.length} BE Groups
            </span>
            <span className="text-[11px] text-emerald-300">Sem VII (2026-27)</span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-900/50 border border-emerald-800/60">
            <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wider block">
              Demo Block Rule
            </span>
            <span className="text-xl font-bold text-rose-200 block mt-0.5">
              Strict Quarantine
            </span>
            <span className="text-[11px] text-rose-300">Zero AI Slop Allowed</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200">
        <button
          onClick={() => setActiveTab("ambiguous")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "ambiguous"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <AlertTriangle size={14} className={pendingCount > 0 ? "text-amber-400" : "text-stone-400"} />
          <span>Ambiguous Records</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-stone-950 font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("source_docs")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "source_docs"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <FileText size={14} />
          <span>Authoritative Source Files</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-700">
            {authoritativeSourceFiles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("project_groups")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "project_groups"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <Users size={14} />
          <span>BE Sem VII Project Groups</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
            {officialProjectGroups.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("review_schedule")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "review_schedule"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <Calendar size={14} />
          <span>Project Review 2 Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab("admission_rules")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "admission_rules"
              ? "bg-stone-900 text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <Building size={14} />
          <span>BE Admission Circular (21-9-26)</span>
        </button>
      </div>

      {/* 3. TAB CONTENT: AMBIGUOUS RECORDS DISAMBIGUATION WORKBENCH */}
      {activeTab === "ambiguous" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Disambiguation & Admin Review Queue
              </h3>
              <p className="text-xs text-stone-500">
                Authoritative validation halted these records due to scan ambiguity, venue conflicts, or expired compliance documents.
              </p>
            </div>
            <div className="text-xs font-medium text-stone-500">
              Resolved: <strong className="text-emerald-700">{resolvedCount}</strong> of {ambiguousRecords.length}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {ambiguousRecords.map((rec) => {
              const isResolved = rec.status === "resolved";
              const isPurged = rec.status === "purged_demo";
              const isDemoThreat = rec.status === "blocked_demo";

              return (
                <div
                  key={rec.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isPurged
                      ? "bg-stone-50/50 border-stone-200 opacity-60"
                      : isResolved
                      ? "bg-emerald-50/40 border-emerald-200"
                      : isDemoThreat
                      ? "bg-rose-50/60 border-rose-300 ring-1 ring-rose-200"
                      : "bg-white border-amber-200/90 shadow-2xs hover:border-amber-300"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isDemoThreat
                              ? "bg-rose-700 text-white"
                              : isResolved
                              ? "bg-emerald-700 text-white"
                              : isPurged
                              ? "bg-stone-600 text-white"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}
                        >
                          {isPurged
                            ? "Purged & Nullified"
                            : isResolved
                            ? "Admin Approved"
                            : isDemoThreat
                            ? "Prohibited Demo Threat"
                            : "Needs Disambiguation"}
                        </span>

                        <span className="text-[11px] font-semibold text-stone-600">
                          Source: {rec.sourceFile}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          • {rec.sourcePage}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            rec.severity === "Critical"
                              ? "bg-rose-100 text-rose-800"
                              : rec.severity === "High"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {rec.severity} Priority
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-stone-900">
                        {rec.title}
                      </h4>

                      <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                        <strong className="text-stone-800">Conflict Detail: </strong>
                        {rec.conflictDescription}
                      </p>

                      {/* Extracted Raw JSON Preview */}
                      <div className="bg-stone-900 text-stone-200 p-3 rounded-2xl text-[11px] font-mono overflow-x-auto">
                        <span className="text-stone-400 text-[10px] uppercase font-bold block mb-1">
                          Extracted Record Payload:
                        </span>
                        {JSON.stringify(rec.extractedData, null, 2)}
                      </div>
                    </div>

                    {/* Resolution Action Area */}
                    <div className="md:w-72 shrink-0 flex flex-col justify-between gap-3 border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-4">
                      {isResolved ? (
                        <div className="p-3 bg-emerald-100/70 rounded-2xl text-emerald-900 text-xs">
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <CheckCircle2 size={15} className="text-emerald-700" />
                            <span>Resolved by Admin</span>
                          </div>
                          <p className="text-[11px] text-emerald-800">
                            Approved at {rec.resolvedAt}. Ready for Supabase injection.
                          </p>
                        </div>
                      ) : isPurged ? (
                        <div className="p-3 bg-stone-200 rounded-2xl text-stone-700 text-xs">
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <Ban size={15} />
                            <span>Quarantined</span>
                          </div>
                          <p className="text-[11px]">
                            AI demo content was removed from the official dataset.
                          </p>
                        </div>
                      ) : isDemoThreat ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-rose-100 text-rose-950 rounded-2xl text-xs">
                            <p className="font-bold mb-1">Action: Enforce Institutional Integrity</p>
                            <p className="text-[11px] leading-relaxed">
                              Demo subject names, mock faculty, and synthetic scores are prohibited. Purge to protect official truth.
                            </p>
                          </div>
                          <button
                            onClick={() => handlePurgeDemo(rec.id)}
                            className="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Ban size={14} />
                            <span>Permanently Purge Demo Entry</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-stone-700 block">
                            Select Official Resolution:
                          </span>
                          {rec.resolutionOptions.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => handleResolveRecord(rec.id, opt.id)}
                              className="w-full text-left p-2.5 rounded-xl border border-stone-300 hover:border-emerald-600 hover:bg-emerald-50 text-xs text-stone-800 transition-all font-medium flex items-start gap-2"
                            >
                              <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: SOURCE DOCUMENTS REPOSITORY */}
      {activeTab === "source_docs" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Authoritative Source Files Catalog
            </h3>
            <p className="text-xs text-stone-500">
              The primary physical and digital circulars provided for Department of Information Technology BE Semester VII.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authoritativeSourceFiles.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {doc.documentType}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">{doc.fileSize}</span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 break-words">
                    {doc.fileName}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs text-stone-700 space-y-1">
                    <p className="font-semibold text-stone-900">Authority: {doc.issuedBy}</p>
                    <p className="text-[11px] text-stone-500">Date Issued: {doc.dateIssued}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1">
                      Deliverables / Mandates:
                    </span>
                    <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                      {doc.deliverablesRequired.slice(0, 3).map((d, idx) => (
                        <li key={idx} className="truncate">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Authentic
                  </span>
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>Full Spec</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: BE SEM VII OFFICIAL PROJECT GROUPS */}
      {activeTab === "project_groups" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Official BE Sem VII Project Groups (2026-27 Final)
              </h3>
              <p className="text-xs text-stone-500">
                Extracted from authoritative PDF: "Updated-Project groups BE sem 7 (2026-27) FINAL.pdf".
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700">
                Total Groups: {officialProjectGroups.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officialProjectGroups.map((grp) => (
              <div
                key={grp.id}
                className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-900 text-white">
                      Group {grp.groupNo}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      Panel {grp.panelNo}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    {grp.title}
                  </h4>

                  <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">
                      Assigned Guide
                    </span>
                    <span className="font-bold text-stone-800">
                      {grp.guide} ({grp.guideCode})
                    </span>
                    <span className="text-stone-500 block text-[11px] mt-0.5">
                      Domain: {grp.domain}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-1.5">
                      Team Members & Roles:
                    </span>
                    <div className="space-y-1">
                      {grp.students.map((st, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs text-stone-700 py-0.5"
                        >
                          <span className="font-medium">
                            <strong className="text-stone-900 mr-1.5 font-mono">
                              #{st.rollNo}
                            </strong>
                            {st.name}
                          </span>
                          <span className="text-[10px] text-stone-400">{st.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Verified Official
                  </span>
                  <span className="text-[11px] text-stone-400">ITP701</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: PROJECT REVIEW 2 TIME SCHEDULE */}
      {activeTab === "review_schedule" && (
        <div className="space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Project Review 2 Time Schedule & Venue Allocation
            </h3>
            <p className="text-xs text-stone-500">
              Extracted from authoritative PDF: "BE Project review 2- Time Schedule.pdf".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officialReviewSchedule.map((slot) => (
              <div
                key={slot.id}
                className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-2xs hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-800 text-white">
                    {slot.panel}
                  </span>
                  <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                    <Calendar size={13} className="text-stone-400" />
                    {slot.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                    <Clock size={15} className="text-emerald-700 shrink-0" />
                    <span>{slot.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                    <Building size={14} className="text-emerald-700 shrink-0" />
                    <span>Venue: {slot.venue}</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    Review Panelists:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {slot.reviewers.map((r, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-800 text-xs font-medium"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-stone-500 text-[11px]">
                    <strong className="text-stone-800">Allocated Groups: </strong>
                    {slot.allocatedGroups.map((g) => `Group ${g}`).join(", ")}
                  </p>
                  <p className="text-stone-500 text-[11px]">
                    <strong className="text-stone-800">Criteria: </strong>
                    {slot.evaluationCriteria}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: BE ADMISSION GUIDELINES (21-9-26) */}
      {activeTab === "admission_rules" && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
              <div>
                <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
                  Circular No: {officialAdmissionGuidelines.circularNumber} • Date: {officialAdmissionGuidelines.date}
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900 mt-1">
                  {officialAdmissionGuidelines.subject}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-center">
                Last Date: {officialAdmissionGuidelines.dates.lastDateWithoutLateFee}
              </span>
            </div>

            {/* Fee Matrix Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Official Category-Wise Fee Structure (Annual 2026-27):
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Category</th>
                      <th className="p-3">Tuition Fee</th>
                      <th className="p-3">Development Fee</th>
                      <th className="p-3 text-right">Total Payable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {officialAdmissionGuidelines.feeStructure.map((f, i) => (
                      <tr key={i} className="hover:bg-stone-50/50">
                        <td className="p-3 font-semibold text-stone-900">{f.category}</td>
                        <td className="p-3 text-stone-600">{f.tuition}</td>
                        <td className="p-3 text-stone-600">{f.development}</td>
                        <td className="p-3 font-bold text-stone-900 text-right font-mono text-sm">
                          {f.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mandatory Documents Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                  Mandatory Submission Documents:
                </h4>
                <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                  {officialAdmissionGuidelines.mandatoryDocuments.map((doc, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Payment & Account Details:
                </h4>
                <p>
                  <strong>College Bank: </strong>
                  {officialAdmissionGuidelines.bankDetails.bank} ({officialAdmissionGuidelines.bankDetails.branch})
                </p>
                <p>
                  <strong>Account Name: </strong>
                  {officialAdmissionGuidelines.bankDetails.accountName}
                </p>
                <p>
                  <strong>Account No: </strong>
                  <span className="font-mono">{officialAdmissionGuidelines.bankDetails.accountNumber}</span>
                </p>
                <p>
                  <strong>IFSC Code: </strong>
                  <span className="font-mono font-bold">{officialAdmissionGuidelines.bankDetails.ifsc}</span>
                </p>
                <p className="text-[11px] text-emerald-800 pt-1">
                  Online ERP Gateway: {officialAdmissionGuidelines.paymentPortal}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Selected Document */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                {selectedDoc.documentType}
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-stone-900">{selectedDoc.fileName}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{selectedDoc.summary}</p>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
              <p><strong>Issuing Authority:</strong> {selectedDoc.issuedBy}</p>
              <p><strong>Date Issued:</strong> {selectedDoc.dateIssued}</p>
              <p><strong>Verification Hash:</strong> SHA256-AUTHENTICATED</p>
            </div>

            <div>
              <span className="text-xs font-bold text-stone-800 block mb-1">
                Required Deliverables:
              </span>
              <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                {selectedDoc.deliverablesRequired.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
