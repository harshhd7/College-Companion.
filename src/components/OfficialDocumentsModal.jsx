import React, { useState } from "react";
import {
  X,
  FileText,
  Calendar,
  Users,
  Building,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Search
} from "lucide-react";
import {
  authoritativeSourceFiles,
  officialProjectGroups,
  officialReviewSchedule,
  officialAdmissionGuidelines,
} from "../data/officialSourceData";

export default function OfficialDocumentsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("groups"); // 'groups' | 'review' | 'admission' | 'files'
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredGroups = officialProjectGroups.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.guide.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.students.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 border border-emerald-700">
                Authoritative College Records
              </span>
              <span className="text-xs text-emerald-200/80">
                BE IT Sem VII • Academic Year 2026-27
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              Official Project Groups & Review 2 Schedule
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls & Search */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("groups")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "groups"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
              }`}
            >
              <Users size={13} />
              <span>Project Groups ({officialProjectGroups.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("review")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "review"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
              }`}
            >
              <Calendar size={13} />
              <span>Review 2 Time Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab("admission")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "admission"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
              }`}
            >
              <Building size={13} />
              <span>BE Admission 2026-27</span>
            </button>

            <button
              onClick={() => setActiveTab("files")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "files"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/60"
              }`}
            >
              <FileText size={13} />
              <span>Attached Source Files ({authoritativeSourceFiles.length})</span>
            </button>
          </div>

          {activeTab === "groups" && (
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student, guide, or topic..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          )}
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* GROUPS TAB */}
          {activeTab === "groups" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>
                  Source: <strong>Updated-Project groups BE sem 7 (2026-27) FINAL.pdf</strong>
                </span>
                <span>{filteredGroups.length} groups matched</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGroups.map((grp) => (
                  <div
                    key={grp.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-900 text-white">
                        Group {grp.groupNo}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-600">
                        Panel {grp.panelNo}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 leading-snug">
                      {grp.title}
                    </h4>

                    <div className="text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200">
                      <p>
                        <strong className="text-stone-900">Guide: </strong>
                        {grp.guide} ({grp.guideCode})
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Domain: {grp.domain}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        Students:
                      </span>
                      {grp.students.map((st, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-stone-700">
                          <span>
                            <strong className="text-stone-900 mr-1.5 font-mono">#{st.rollNo}</strong>
                            {st.name}
                          </span>
                          <span className="text-[10px] text-stone-400">{st.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEW SCHEDULE TAB */}
          {activeTab === "review" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck size={15} />
                  <span>Mandatory Project Review 2 Guidelines</span>
                </p>
                <p>
                  Review will evaluate system architecture diagrams, literature survey synthesis, and live prototype module execution. All members must report in formals with logbooks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {officialReviewSchedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-800 text-white">
                        {slot.panel}
                      </span>
                      <span className="text-xs font-semibold text-stone-600">
                        {slot.date}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                        <Clock size={13} className="text-emerald-700" />
                        <span>{slot.timeSlot}</span>
                      </p>
                      <p className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                        <MapPin size={13} className="text-emerald-700" />
                        <span>Venue: {slot.venue}</span>
                      </p>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-xl text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">
                        Reviewers:
                      </span>
                      <p className="font-medium text-stone-800">
                        {slot.reviewers.join(" • ")}
                      </p>
                    </div>

                    <div className="text-xs space-y-1 text-stone-600">
                      <p>
                        <strong>Allocated Groups: </strong>
                        {slot.allocatedGroups.map((g) => `Group ${g}`).join(", ")}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        <strong>Focus: </strong>
                        {slot.evaluationCriteria}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADMISSION GUIDELINES TAB */}
          {activeTab === "admission" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950">
                <div>
                  <span className="font-bold">Notice Ref: {officialAdmissionGuidelines.circularNumber}</span>
                  <p className="text-[11px] mt-0.5 text-amber-900">
                    Admission to Final Year B.E. (Semester VII & VIII) for 2026-27
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-950 font-bold shrink-0">
                  Last Date: {officialAdmissionGuidelines.dates.lastDateWithoutLateFee}
                </span>
              </div>

              {/* Fee Matrix */}
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

              {/* Documents & Bank */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px] block">
                    Required Documents Checklist:
                  </span>
                  <ul className="space-y-1 list-disc list-inside text-stone-600">
                    {officialAdmissionGuidelines.mandatoryDocuments.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2 text-emerald-950">
                  <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] block">
                    Bank Account & Payment Gateway:
                  </span>
                  <p><strong>Bank: </strong>{officialAdmissionGuidelines.bankDetails.bank} ({officialAdmissionGuidelines.bankDetails.branch})</p>
                  <p><strong>Account Name: </strong>{officialAdmissionGuidelines.bankDetails.accountName}</p>
                  <p><strong>A/C No: </strong><span className="font-mono">{officialAdmissionGuidelines.bankDetails.accountNumber}</span></p>
                  <p><strong>IFSC: </strong><span className="font-mono font-bold">{officialAdmissionGuidelines.bankDetails.ifsc}</span></p>
                  <p className="text-[11px] text-emerald-800">Submit receipt to {officialAdmissionGuidelines.contactInCharge}</p>
                </div>
              </div>
            </div>
          )}

          {/* SOURCE FILES TAB */}
          {activeTab === "files" && (
            <div className="space-y-3">
              {authoritativeSourceFiles.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        {f.documentType}
                      </span>
                      <span className="font-bold text-stone-900">{f.fileName}</span>
                    </div>
                    <p className="text-stone-600 text-[11px]">{f.description}</p>
                    <p className="text-stone-400 text-[10px]">
                      Issued: {f.dateIssued} • Authority: {f.issuedBy}
                    </p>
                  </div>
                  <span className="text-emerald-700 font-bold px-2.5 py-1 bg-emerald-100 rounded-lg shrink-0 text-center">
                    Verified Source
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>Institution: M.H. Saboo Siddik College of Engineering</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
