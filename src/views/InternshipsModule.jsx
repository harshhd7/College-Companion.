import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  ExternalLink,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building,
  DollarSign,
  GraduationCap,
  Filter,
  ArrowRight,
  X,
  Plus,
} from "lucide-react";
import { placementForms } from "../data/mockData";
import { opportunitiesService } from "../lib/dataService";

export default function InternshipsModule({ user, showToast }) {
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState(null);
  const [formsList, setFormsList] = useState(placementForms);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDriveForm, setNewDriveForm] = useState({
    company_name: "",
    role_title: "",
    opportunity_type: "Full-Time",
    ctc_stipend: "",
    location: "Mumbai / Remote",
    eligibility_criteria: "BE IT / Min 60% with no live backlogs",
    apply_link: "",
    deadline: "2026-09-30",
  });

  const loadOpportunities = async () => {
    try {
      const res = await opportunitiesService.getOpportunities();
      if (res?.data && res.data.length > 0) {
        const formatted = res.data.map((d) => ({
          id: d.id,
          company: d.company_name || d.company,
          role: d.role_title || d.role,
          package: d.ctc_stipend || d.package || "Competitive",
          location: d.location || "Mumbai",
          type: d.opportunity_type || d.type || "Full-Time",
          deadline: d.deadline || "Ongoing",
          eligibility: d.eligibility_criteria || d.eligibility || "BE IT Sem VII",
          link: d.apply_link || d.link || "#",
          verified: true,
        }));
        setFormsList(formatted);
      }
    } catch (err) {
      console.warn("Could not load opportunities:", err);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const filteredForms = formsList.filter((f) => {
    const matchesType = filterType === "All" || f.type.toLowerCase() === filterType.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      f.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const handleApplyClick = (form) => {
    setSelectedForm(form);
  };

  const handleConfirmApply = () => {
    window.open(selectedForm.link, "_blank", "noreferrer");
    showToast?.(`Opening official form for ${selectedForm.company}!`, "success");
    setSelectedForm(null);
  };

  const handleAddDrive = async (e) => {
    e.preventDefault();
    try {
      await opportunitiesService.createOpportunity(newDriveForm);
      showToast?.(`Drive for ${newDriveForm.company_name} added!`, "success");
      setAddModalOpen(false);
      setNewDriveForm({
        company_name: "",
        role_title: "",
        opportunity_type: "Full-Time",
        ctc_stipend: "",
        location: "Mumbai / Remote",
        eligibility_criteria: "BE IT / Min 60% with no live backlogs",
        apply_link: "",
        deadline: "2026-09-30",
      });
      loadOpportunities();
    } catch (err) {
      showToast?.(`Error adding drive: ${err.message}`, "error");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-lime-800">
            Training & Placement Cell (T&P) • MHSSCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Placement & Internship Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Official recruitment drives, eligibility rules, and Google Form submission links for BE IT students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user?.role === "admin" && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>Add Drive</span>
            </button>
          )}

          <div className="px-4 py-2 bg-lime-50 rounded-2xl border border-lime-200 text-xs font-semibold text-lime-900 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-lime-700" />
            <span>T&P Verified Only</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, role, or location (e.g. 'TCS', 'Software Engineer')..."
            className="w-full text-xs sm:text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400 font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-stone-200/90 shadow-xs">
          {["All", "Full-Time", "Internship"].map((t) => {
            const isSelected = filterType.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-lime-900 text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs hover:border-lime-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-lime-50 text-lime-900 border border-lime-200">
                  {form.type}
                </span>
                <span className="text-xs font-bold text-lime-900 font-mono">{form.package}</span>
              </div>

              <h3 className="font-serif font-bold text-base text-stone-900">{form.company}</h3>
              <p className="text-xs text-stone-600 font-medium mt-0.5">{form.role}</p>

              <div className="mt-4 space-y-1.5 text-xs text-stone-500 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-stone-400 shrink-0" />
                  <span>{form.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-stone-400 shrink-0" />
                  <span className="truncate">{form.eligibility}</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                  <Clock size={13} className="shrink-0" />
                  <span>Deadline: {form.deadline}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-700" />
                Verified Drive
              </span>

              <button
                onClick={() => handleApplyClick(form)}
                className="px-4 py-1.5 bg-lime-800 hover:bg-lime-900 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span>Apply Form</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* APPLY CONFIRM MODAL */}
      {selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">
              Apply to {selectedForm.company}
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              You are being directed to the official Google Form application maintained by the T&P Cell for <strong>{selectedForm.role}</strong>. Please ensure your resume is up-to-date.
            </p>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1 mb-5">
              <div><strong>Package:</strong> {selectedForm.package}</div>
              <div><strong>Eligibility:</strong> {selectedForm.eligibility}</div>
              <div><strong>Deadline:</strong> {selectedForm.deadline}</div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedForm(null)}
                className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApply}
                className="px-5 py-2 bg-lime-800 hover:bg-lime-900 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <span>Proceed to Form</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD DRIVE MODAL (ADMIN) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
              Add Placement / Internship Drive
            </h3>
            <form onSubmit={handleAddDrive} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jio Platforms Ltd."
                  value={newDriveForm.company_name}
                  onChange={(e) => setNewDriveForm({ ...newDriveForm, company_name: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Graduate Engineer Trainee"
                    value={newDriveForm.role_title}
                    onChange={(e) => setNewDriveForm({ ...newDriveForm, role_title: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Type</label>
                  <select
                    value={newDriveForm.opportunity_type}
                    onChange={(e) => setNewDriveForm({ ...newDriveForm, opportunity_type: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">CTC / Stipend</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹7.5 LPA"
                    value={newDriveForm.ctc_stipend}
                    onChange={(e) => setNewDriveForm({ ...newDriveForm, ctc_stipend: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={newDriveForm.deadline}
                    onChange={(e) => setNewDriveForm({ ...newDriveForm, deadline: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Google Form / Apply Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://forms.gle/..."
                  value={newDriveForm.apply_link}
                  onChange={(e) => setNewDriveForm({ ...newDriveForm, apply_link: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold shadow-xs"
                >
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
