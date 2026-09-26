import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  BookOpen,
  Briefcase,
  Bell,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  FolderPlus,
  HelpCircle,
} from "lucide-react";
import {
  adminService,
  timetableService,
  examService,
  academicService,
  notesService,
  eventsService,
  clubsService,
  opportunitiesService,
  communicationService,
} from "../lib/dataService";

export default function AdminDashboardView({ user, showToast }) {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'timetable' | 'exams' | 'notes' | 'announcements' | 'users'
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalNotes: 0,
    totalEvents: 0,
    totalClubs: 0,
    totalOpportunities: 0,
    totalTimetableEntries: 0,
    totalExams: 0,
    isLive: false,
  });
  const [loading, setLoading] = useState(true);

  // Timetable State
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [newTimetableModal, setNewTimetableModal] = useState(false);
  const [newTimetableForm, setNewTimetableForm] = useState({
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "10:00",
    subject_id: "",
    faculty_id: "",
    room: "303",
    session_type: "Lecture",
    batch: "ALL",
    practical_group: "",
  });

  // Exams State
  const [exams, setExams] = useState([]);
  const [newExamModal, setNewExamModal] = useState(false);
  const [newExamForm, setNewExamForm] = useState({
    date: "2026-08-27",
    start_time: "10:15",
    end_time: "11:15",
    course_code: "ITC701",
    course_name: "AI and DS - II",
    department: "Information Technology",
    year: "BE",
    semester: "Semester 7",
    exam_type: "In-Sem",
    faculty_in_charge: "Dr. Zainab Mirza",
  });

  // Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnModal, setNewAnnModal] = useState(false);
  const [newAnnForm, setNewAnnForm] = useState({
    title: "",
    category: "Academics",
    content: "",
    urgent: false,
  });

  // Users State
  const [profiles, setProfiles] = useState([]);

  // Load initial stats & data
  const loadStatsAndData = async () => {
    setLoading(true);
    try {
      const s = await adminService.getLiveStats();
      setStats(s);

      const [subList, facList, ttRes, examRes, annRes, profRes] = await Promise.all([
        academicService.getSubjects("Information Technology"),
        academicService.getFaculty("Information Technology"),
        timetableService.getWeeklySchedule({ batch: "ALL" }),
        examService.getExams({ department: "Information Technology", year: "BE", semester: "Semester 7" }),
        communicationService.getAnnouncements(),
        adminService.getAllProfiles(),
      ]);

      setSubjects(subList || []);
      setFaculty(facList || []);
      setTimetableEntries(ttRes?.raw || []);
      setExams(examRes?.data || []);
      setAnnouncements(annRes?.data || []);
      setProfiles(profRes || []);

      if (subList?.length > 0 && !newTimetableForm.subject_id) {
        setNewTimetableForm((prev) => ({ ...prev, subject_id: subList[0].id }));
      }
      if (facList?.length > 0 && !newTimetableForm.faculty_id) {
        setNewTimetableForm((prev) => ({ ...prev, faculty_id: facList[0].id }));
      }
    } catch (err) {
      console.warn("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatsAndData();
  }, []);

  // Add Timetable Entry Handler
  const handleAddTimetable = async (e) => {
    e.preventDefault();
    try {
      await timetableService.createEntry({
        ...newTimetableForm,
        department: "Information Technology",
        year: "BE",
        semester: "Semester 7",
        effective_from: "2026-07-06",
      });
      showToast("Timetable entry added successfully!", "success");
      setNewTimetableModal(false);
      loadStatsAndData();
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    }
  };

  // Delete Timetable Entry Handler
  const handleDeleteTimetable = async (id) => {
    if (!window.confirm("Are you sure you want to remove this timetable class?")) return;
    try {
      await timetableService.deleteEntry(id);
      showToast("Timetable entry deleted.", "info");
      loadStatsAndData();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "error");
    }
  };

  // Add Exam Handler
  const handleAddExam = async (e) => {
    e.preventDefault();
    try {
      await examService.createExam(newExamForm);
      showToast("Official exam schedule added!", "success");
      setNewExamModal(false);
      loadStatsAndData();
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    }
  };

  // Delete Exam Handler
  const handleDeleteExam = async (id) => {
    if (!window.confirm("Delete this exam schedule?")) return;
    try {
      await examService.deleteExam(id);
      showToast("Exam entry removed.", "info");
      loadStatsAndData();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "error");
    }
  };

  // Add Announcement Handler
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await communicationService.createAnnouncement({
        ...newAnnForm,
        published_by: user?.id || null,
      });
      showToast("Official announcement published!", "success");
      setNewAnnModal(false);
      setNewAnnForm({ title: "", category: "Academics", content: "", urgent: false });
      loadStatsAndData();
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await communicationService.deleteAnnouncement(id);
      showToast("Announcement removed.", "info");
      loadStatsAndData();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "error");
    }
  };

  // Update Profile Role Handler
  const handleRoleChange = async (profileId, newRole) => {
    try {
      await adminService.updateProfileRole(profileId, newRole);
      showToast(`Role updated to ${newRole}!`, "success");
      loadStatsAndData();
    } catch (err) {
      showToast(`Role update failed: ${err.message}`, "error");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              Department Administrator Portal
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Information Technology • BE Sem VII
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Institutional Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Live database management for SH 2026 timetable, internal assessment exam schedules, student role authorizations, and official notices without altering code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStatsAndData}
            disabled={loading}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-emerald-700" : ""} />
            <span>Sync Supabase</span>
          </button>
        </div>
      </div>

      {/* 2. Live Supabase Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Students
          </span>
          <span className="text-xl font-bold text-stone-900 block mt-1">
            {stats.totalStudents}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Active Profiles</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Timetable
          </span>
          <span className="text-xl font-bold text-stone-900 block mt-1">
            {timetableEntries.length}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Weekly Slots</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Exams
          </span>
          <span className="text-xl font-bold text-stone-900 block mt-1">
            {exams.length}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">IA Test 1 Slots</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Notes
          </span>
          <span className="text-xl font-bold text-stone-900 block mt-1">
            {stats.totalNotes}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Storage Uploads</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Events
          </span>
          <span className="text-xl font-bold text-stone-900 block mt-1">
            {stats.totalEvents}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Campus Fests</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Clubs
          </span>
          <span className="text-xl font-bold text-stone-900 block mt-1">
            {stats.totalClubs}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Student Societies</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Drives
          </span>
          <span className="text-xl font-bold text-stone-900 block mt-1">
            {stats.totalOpportunities}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">T&P Placements</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        {[
          { key: "overview", label: "Overview & Instructions", icon: ShieldCheck },
          { key: "timetable", label: `Timetable (${timetableEntries.length})`, icon: Calendar },
          { key: "exams", label: `Exams (${exams.length})`, icon: Clock },
          { key: "announcements", label: `Announcements (${announcements.length})`, icon: Bell },
          { key: "users", label: `User Roles (${profiles.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-emerald-900 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content */}
      {/* 4.1 OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Department Administrator Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <strong className="text-stone-900 block text-sm">
                  1. Official SH 2026 Timetable Management
                </strong>
                <p>
                  All weekly lecture, project, and practical batch allocations are retrieved from PostgreSQL. You can add, adjust room numbers (303, 305, 306), assign faculty, and configure batch constraints (ALL, A, B, C) directly through this panel.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <strong className="text-stone-900 block text-sm">
                  2. Role Security & Zero Privilege Escalation
                </strong>
                <p>
                  Every new signup strictly defaults to <code className="bg-stone-200 px-1 py-0.5 rounded">student</code>. Use the &quot;User Roles&quot; tab to promote verified staff to <code className="bg-stone-200 px-1 py-0.5 rounded">faculty</code> or <code className="bg-stone-200 px-1 py-0.5 rounded">admin</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <strong className="text-stone-900 block text-sm">
                  3. Separate Examination Table
                </strong>
                <p>
                  Internal Assessment Test 1 and semester finals are stored in <code className="bg-stone-200 px-1 py-0.5 rounded">exam_schedules</code>, strictly separated from weekly recurring class hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <strong className="text-stone-900 block text-sm">
                  4. Authentic MHSSCE Academic Curriculum
                </strong>
                <p>
                  Subjects are mapped to official University of Mumbai codes: AIDS-II (ITC701), IOE (ITC702), STQA (ITDO7014), IRS (ITDO7024), CSL (ILO7016), and DMMM (ILO7017).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.2 TIMETABLE TAB */}
      {activeTab === "timetable" && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Official Timetable Entries (SH 2026 Version 2)
              </h2>
              <p className="text-xs text-stone-500">
                Effective 06-07-2026 • Rooms 303, 305, 306 & IT Laboratories
              </p>
            </div>
            <button
              onClick={() => setNewTimetableModal(true)}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus size={15} />
              <span>Add Timetable Slot</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] tracking-wider border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {timetableEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">{entry.day_of_week}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">
                      {entry.start_time?.slice(0, 5)} – {entry.end_time?.slice(0, 5)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">
                        {entry.subjects?.abbreviation || "Project / Break"}
                      </div>
                      <div className="text-[10px] text-stone-500">{entry.subjects?.course_code}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      {entry.faculty ? `${entry.faculty.name} (${entry.faculty.faculty_code})` : "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800">{entry.room}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {entry.session_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">
                      {entry.batch} {entry.practical_group ? `(${entry.practical_group})` : ""}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteTimetable(entry.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors rounded"
                        title="Delete slot"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4.3 EXAMS TAB */}
      {activeTab === "exams" && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Official Exam Schedules (Internal Assessment Test 1)
              </h2>
              <p className="text-xs text-stone-500">
                Department of Information Technology • Historical & Upcoming Examination Records
              </p>
            </div>
            <button
              onClick={() => setNewExamModal(true)}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus size={15} />
              <span>Add Exam Schedule</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] tracking-wider border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Course Name</th>
                  <th className="py-3 px-4">Sem / Year</th>
                  <th className="py-3 px-4">Faculty In-Charge</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">{exam.date}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">
                      {exam.start_time?.slice(0, 5)} – {exam.end_time?.slice(0, 5)}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-800">
                      {exam.course_code}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-900">{exam.course_name}</td>
                    <td className="py-3 px-4 text-stone-600">
                      {exam.year} • {exam.semester}
                    </td>
                    <td className="py-3 px-4 text-stone-700">{exam.faculty_in_charge || "—"}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors rounded"
                        title="Delete exam"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4.4 ANNOUNCEMENTS TAB */}
      {activeTab === "announcements" && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Campus Notices & Announcements
              </h2>
              <p className="text-xs text-stone-500">
                Publish high-priority circulars to student companion dashboards
              </p>
            </div>
            <button
              onClick={() => setNewAnnModal(true)}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus size={15} />
              <span>Create Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl border border-stone-200 flex items-start justify-between gap-4 hover:border-stone-300 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {ann.urgent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                        Urgent
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {ann.category}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm">{ann.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{ann.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(ann.id)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition-colors shrink-0"
                  title="Delete announcement"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4.5 USERS & ROLES TAB */}
      {activeTab === "users" && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              User Role Management & Verification
            </h2>
            <p className="text-xs text-stone-500">
              All signups are strictly restricted to student role. Admin privileges can only be granted here.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] tracking-wider border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Dept / Sem</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4 text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900">{p.full_name}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">{p.email}</td>
                    <td className="py-3 px-4 text-stone-600">
                      {p.department || "IT"} • {p.semester || "Sem 7"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">{p.batch || "—"}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          p.role === "admin"
                            ? "bg-amber-100 text-amber-900"
                            : p.role === "faculty"
                            ? "bg-purple-100 text-purple-900"
                            : "bg-emerald-100 text-emerald-900"
                        }`}
                      >
                        {p.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={p.role}
                        onChange={(e) => handleRoleChange(p.id, e.target.value)}
                        className="py-1 px-2 text-xs bg-stone-50 border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700"
                      >
                        <option value="student">student</option>
                        <option value="faculty">faculty</option>
                        <option value="admin">admin</option>
                        <option value="club_admin">club_admin</option>
                        <option value="event_admin">event_admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD TIMETABLE ENTRY */}
      {newTimetableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">
              Add Timetable Session
            </h2>
            <form onSubmit={handleAddTimetable} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Day of Week</label>
                  <select
                    value={newTimetableForm.day_of_week}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, day_of_week: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Session Type</label>
                  <select
                    value={newTimetableForm.session_type}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, session_type: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    {["Lecture", "Practical", "Project", "Tutorial", "Break"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newTimetableForm.start_time}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, start_time: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newTimetableForm.end_time}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, end_time: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Subject</label>
                <select
                  value={newTimetableForm.subject_id}
                  onChange={(e) => setNewTimetableForm({ ...newTimetableForm, subject_id: e.target.value })}
                  className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                >
                  <option value="">-- None / General Break --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.course_code} — {s.abbreviation} ({s.course_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Faculty</label>
                <select
                  value={newTimetableForm.faculty_id}
                  onChange={(e) => setNewTimetableForm({ ...newTimetableForm, faculty_id: e.target.value })}
                  className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                >
                  <option value="">-- None / Student Self --</option>
                  {faculty.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.faculty_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Room / Lab</label>
                  <input
                    type="text"
                    required
                    placeholder="303, 305, Lab 1..."
                    value={newTimetableForm.room}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, room: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Batch</label>
                  <select
                    value={newTimetableForm.batch}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, batch: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="ALL">ALL</option>
                    <option value="A">Batch A</option>
                    <option value="B">Batch B</option>
                    <option value="C">Batch C</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Prac Group</label>
                  <select
                    value={newTimetableForm.practical_group}
                    onChange={(e) => setNewTimetableForm({ ...newTimetableForm, practical_group: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="">None</option>
                    <option value="IS">IS</option>
                    <option value="DB">DB</option>
                    <option value="PL">PL</option>
                    <option value="SE">SE</option>
                    <option value="WE">WE</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setNewTimetableModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD EXAM SCHEDULE */}
      {newExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">
              Add Official Exam Schedule
            </h2>
            <form onSubmit={handleAddExam} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newExamForm.date}
                    onChange={(e) => setNewExamForm({ ...newExamForm, date: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Exam Type</label>
                  <select
                    value={newExamForm.exam_type}
                    onChange={(e) => setNewExamForm({ ...newExamForm, exam_type: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="In-Sem">In-Sem (IA Test 1)</option>
                    <option value="End-Sem">End-Sem Final</option>
                    <option value="Oral / Practical">Oral / Practical</option>
                    <option value="Re-Exam">Re-Exam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newExamForm.start_time}
                    onChange={(e) => setNewExamForm({ ...newExamForm, start_time: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newExamForm.end_time}
                    onChange={(e) => setNewExamForm({ ...newExamForm, end_time: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ITC701"
                    value={newExamForm.course_code}
                    onChange={(e) => setNewExamForm({ ...newExamForm, course_code: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Year / Sem</label>
                  <select
                    value={newExamForm.semester}
                    onChange={(e) => setNewExamForm({ ...newExamForm, semester: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Semester 7">BE - Sem 7 (Current)</option>
                    <option value="Semester 8">BE - Sem 8</option>
                    <option value="Semester 5">TE - Sem 5</option>
                    <option value="Semester 3">SE - Sem 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI and DS - II"
                  value={newExamForm.course_name}
                  onChange={(e) => setNewExamForm({ ...newExamForm, course_name: e.target.value })}
                  className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Faculty In-Charge</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Zainab Mirza"
                  value={newExamForm.faculty_in_charge}
                  onChange={(e) => setNewExamForm({ ...newExamForm, faculty_in_charge: e.target.value })}
                  className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setNewExamModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD ANNOUNCEMENT */}
      {newAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-4">
              Publish Institutional Notice
            </h2>
            <form onSubmit={handleAddAnnouncement} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BE IT Sem VII Timetable Notice"
                  value={newAnnForm.title}
                  onChange={(e) => setNewAnnForm({ ...newAnnForm, title: e.target.value })}
                  className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newAnnForm.category}
                    onChange={(e) => setNewAnnForm({ ...newAnnForm, category: e.target.value })}
                    className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Examinations">Examinations</option>
                    <option value="Projects">Projects</option>
                    <option value="Placements">Placements</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAnnForm.urgent}
                      onChange={(e) => setNewAnnForm({ ...newAnnForm, urgent: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Mark as Urgent Alert</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details of the circular..."
                  value={newAnnForm.content}
                  onChange={(e) => setNewAnnForm({ ...newAnnForm, content: e.target.value })}
                  className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setNewAnnModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
