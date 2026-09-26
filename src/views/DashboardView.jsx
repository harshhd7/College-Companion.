import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  BookOpen,
  Briefcase,
  MessageSquare,
  Sparkles,
  Users,
  Search,
  Bell,
  GraduationCap,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  Download,
} from "lucide-react";
import {
  timetable,
  days,
  todayIndex,
  upcomingEvents,
  recentNotes,
  placementForms,
  studyGroups,
  campusAnnouncements,
} from "../data/mockData";
import {
  timetableService,
  notesService,
  eventsService,
  opportunitiesService,
  communicationService,
} from "../lib/dataService";

export default function DashboardView({ user, onNavigate, onOpenSearch, showToast }) {
  const [announcements, setAnnouncements] = useState(campusAnnouncements);
  const [liveTimetable, setLiveTimetable] = useState(null);
  const [liveNotes, setLiveNotes] = useState(recentNotes);
  const [liveEvents, setLiveEvents] = useState(upcomingEvents);
  const [livePlacements, setLivePlacements] = useState(placementForms);
  const [loading, setLoading] = useState(false);

  const todayName = days[todayIndex];

  // Fetch real Supabase data on mount
  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        const [ttRes, notesRes, eventsRes, oppsRes, annRes] = await Promise.all([
          timetableService.getWeeklySchedule({
            batch: user?.batch || "ALL",
            department: user?.department || "Information Technology",
            semester: user?.semester || "Semester 7",
          }),
          notesService.getNotes(),
          eventsService.getEvents(),
          opportunitiesService.getOpportunities(),
          communicationService.getAnnouncements(),
        ]);

        if (!isMounted) return;

        if (ttRes?.data) {
          setLiveTimetable(ttRes.data);
        }
        if (notesRes?.data && notesRes.data.length > 0) {
          // Normalize notes to match UI expected format
          const formatted = notesRes.data.map((n) => ({
            id: n.id,
            title: n.title,
            subject: n.subject_name || "General",
            description: n.module_unit ? `Module: ${n.module_unit}` : (n.description || "Course study material"),
            uploader: n.uploader_name || "Harsh Desai",
            rating: n.rating || 4.9,
            size: n.file_size || "3.2 MB PDF",
            downloads: n.downloads_count || 120,
            fileUrl: n.file_url,
          }));
          setLiveNotes(formatted);
        }
        if (eventsRes?.data && eventsRes.data.length > 0) {
          const formattedEvents = eventsRes.data.map((e) => ({
            id: e.id,
            name: e.title || e.name,
            tag: e.category || "Technical",
            badge: e.category === "Technical" ? "Flagship" : "Campus",
            date: e.event_date ? new Date(e.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : e.date,
            time: e.start_time?.slice(0, 5) ? `${e.start_time.slice(0, 5)} - ${e.end_time?.slice(0, 5) || "17:00"}` : (e.time || "10:00 AM"),
            venue: e.venue || "Auditorium",
            seatsLeft: 30,
          }));
          setLiveEvents(formattedEvents);
        }
        if (oppsRes?.data && oppsRes.data.length > 0) {
          const formattedOpps = oppsRes.data.map((o) => ({
            id: o.id,
            company: o.company_name || o.company,
            role: o.role_title || o.role,
            package: o.ctc_stipend || o.package || "Competitive",
            type: o.opportunity_type || o.type || "Full-time",
            link: o.apply_link || o.link || "#",
          }));
          setLivePlacements(formattedOpps);
        }
        if (annRes?.data && annRes.data.length > 0) {
          setAnnouncements(annRes.data);
        }
      } catch (err) {
        console.warn("Could not load full Supabase dashboard data:", err);
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Merge today classes: Prefer Supabase live timetable slots mapped to UI
  let todayClasses = [];
  if (liveTimetable && liveTimetable[todayName] && liveTimetable[todayName].length > 0) {
    todayClasses = liveTimetable[todayName].map((slot, idx) => ({
      id: slot.id,
      period: idx + 1,
      subject: slot.subjects?.abbreviation
        ? `${slot.subjects.abbreviation} (${slot.subjects.course_name})`
        : slot.session_type === "Break"
        ? "Recess Break"
        : "Major Project I",
      code: slot.subjects?.course_code || (slot.session_type === "Break" ? "RECESS" : "ITP701"),
      faculty: slot.faculty?.name || "Staff Advisor",
      time: `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`,
      room: slot.room,
      type: slot.session_type,
      status: idx === 1 ? "in-progress" : idx === 0 ? "completed" : "upcoming",
    }));
  } else {
    todayClasses = timetable[todayName] || [];
  }

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Find currently active or next class
  const activeClass = todayClasses.find((c) => c.status === "in-progress") || todayClasses[0];

  const handleDismissAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast?.("Announcement dismissed", "info");
  };

  const handleDownloadNote = (note) => {
    if (note.fileUrl) {
      window.open(note.fileUrl, "_blank", "noreferrer");
      showToast?.(`Opening "${note.title}"...`, "success");
    } else {
      showToast?.(`Downloading "${note.title}"...`, "success");
    }
  };

  const handleRSVP = (eventName) => {
    showToast?.(`Registered for "${eventName}". Confirmation sent!`, "success");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Personalized Header Greeting Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                {user.department || "Information Technology"}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                {user.semester || "Semester 7"}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-100">
                {user.department || "Information Technology"} • {user.semester || "Semester 7"}
              </span>
              {user.rollNumber && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-100">
                  {user.rollNumber}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
              {greeting}, {user.name.split(" ")[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-xl">
              You have <strong className="text-white">{todayClasses.length} sessions</strong> scheduled for today ({todayName}). Next lecture is{" "}
              <strong className="text-white">{activeClass?.subject || "AI and DS - II"}</strong> in{" "}
              <span className="underline decoration-emerald-400 font-semibold">{activeClass?.room || "303"}</span>.
            </p>
          </div>

          {/* Academic Badge */}
          <div className="flex items-center gap-3 bg-emerald-900/60 border border-emerald-700/60 p-3 rounded-2xl shrink-0 backdrop-blur-xs">
            <div className="text-center px-2">
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
                Attendance
              </span>
              <span className="text-xl font-bold text-white block">
                {user.attendancePercentage != null ? `${user.attendancePercentage}%` : "Pending"}
              </span>
              <span className="text-[9px] text-emerald-300 font-medium">
                {user.attendancePercentage != null ? "Recorded" : "Awaiting Data"}
              </span>
            </div>
            <div className="w-px h-8 bg-emerald-700/60" />
            <div className="text-center px-2">
              <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider block">
                CGPA
              </span>
              <span className="text-xl font-bold text-white block">
                {user.cgpa != null ? user.cgpa : "Pending"}
              </span>
              <span className="text-[9px] text-emerald-300 font-medium">
                {user.cgpa != null ? "Official Record" : "Awaiting Entry"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Campus Announcements (Dismissible Alert) */}
      {announcements.length > 0 && (
        <div className="space-y-2">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 shadow-2xs flex items-start justify-between gap-3 text-amber-950"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-200/60 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-amber-950">{ann.title}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-amber-200/60 text-amber-900 rounded">
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-amber-700">{ann.date || "Active Notice"}</span>
                  </div>
                  <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">{ann.content}</p>
                </div>
              </div>
              <button
                onClick={() => handleDismissAnnouncement(ann.id)}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold px-2 py-1 rounded-md hover:bg-amber-100 shrink-0 transition-colors"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Quick Actions Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        <button
          onClick={() => onNavigate("timetable")}
          className="p-3 bg-white hover:bg-emerald-50/50 border border-stone-200 rounded-2xl text-left transition-all group shadow-2xs"
        >
          <Calendar size={18} className="text-emerald-800 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-stone-900">View Schedule</p>
          <p className="text-[10px] text-stone-500">Period-wise day plan</p>
        </button>

        <button
          onClick={() => onNavigate("notes")}
          className="p-3 bg-white hover:bg-sky-50/50 border border-stone-200 rounded-2xl text-left transition-all group shadow-2xs"
        >
          <BookOpen size={18} className="text-sky-800 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-stone-900">Course Notes</p>
          <p className="text-[10px] text-stone-500">Unit summaries & QBs</p>
        </button>

        <button
          onClick={() => onNavigate("internships")}
          className="p-3 bg-white hover:bg-lime-50/50 border border-stone-200 rounded-2xl text-left transition-all group shadow-2xs"
        >
          <Briefcase size={18} className="text-lime-800 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-stone-900">Placement Forms</p>
          <p className="text-[10px] text-stone-500">TCS, Infosys drives</p>
        </button>

        <button
          onClick={() => onNavigate("studygroups")}
          className="p-3 bg-white hover:bg-rose-50/50 border border-stone-200 rounded-2xl text-left transition-all group shadow-2xs"
        >
          <MessageSquare size={18} className="text-rose-700 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-stone-900">Study Groups</p>
          <p className="text-[10px] text-stone-500">Peer WhatsApp groups</p>
        </button>

        <button
          onClick={() => onNavigate("lostfound")}
          className="p-3 bg-white hover:bg-amber-50/50 border border-stone-200 rounded-2xl text-left transition-all group shadow-2xs"
        >
          <Search size={18} className="text-amber-800 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-stone-900">Lost & Found</p>
          <p className="text-[10px] text-stone-500">Report or claim items</p>
        </button>

        <button
          onClick={onOpenSearch}
          className="p-3 bg-white hover:bg-purple-50/50 border border-stone-200 rounded-2xl text-left transition-all group shadow-2xs"
        >
          <MapPin size={18} className="text-purple-800 mb-1.5 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-stone-900">Campus Rooms</p>
          <p className="text-[10px] text-stone-500">LH & Lab finder</p>
        </button>
      </div>

      {/* 4. Main Two-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Today's Classes & Recent Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes Card */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800">
                  {todayName}'s Timetable
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900">Scheduled Sessions</h3>
              </div>
              <button
                onClick={() => onNavigate("timetable")}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
              >
                <span>Full Week</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {todayClasses.map((c) => {
                const isCurrent = c.status === "in-progress";
                const isCompleted = c.status === "completed";

                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? "bg-emerald-50/80 border-emerald-300 shadow-xs ring-1 ring-emerald-200"
                        : isCompleted
                        ? "bg-stone-50/60 border-stone-200/80 opacity-75"
                        : "bg-white border-stone-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCurrent
                            ? "bg-emerald-800 text-white"
                            : isCompleted
                            ? "bg-stone-200 text-stone-600"
                            : "bg-emerald-100 text-emerald-900"
                        }`}
                      >
                        P{c.period}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-stone-900">{c.subject}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-stone-100 text-stone-600">
                            {c.type}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-700 text-white animate-pulse">
                              Active Now
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Faculty: <strong className="text-stone-700">{c.faculty}</strong> • Course Code: {c.code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                      <div className="text-xs text-stone-600">
                        <p className="font-semibold flex items-center gap-1 sm:justify-end">
                          <Clock size={13} className="text-stone-400" />
                          {c.time}
                        </p>
                        <p className="text-stone-500 flex items-center gap-1 sm:justify-end mt-0.5">
                          <MapPin size={13} className="text-emerald-700" />
                          <strong className="text-emerald-800">{c.room}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Notes Section */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-sky-800">
                  Academic Repository
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900">Recent Course Notes</h3>
              </div>
              <button
                onClick={() => onNavigate("notes")}
                className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1 transition-colors"
              >
                <span>Browse All</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {liveNotes.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-stone-50 hover:bg-sky-50/40 border border-stone-200/90 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-900">
                        {n.subject}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">★ {n.rating}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-sky-900 transition-colors line-clamp-2">
                      {n.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{n.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
                    <span>Uploaded by {n.uploader}</span>
                    <button
                      onClick={() => handleDownloadNote(n)}
                      className="text-sky-800 font-semibold hover:text-sky-950 flex items-center gap-1 p-1 hover:bg-sky-100/70 rounded-lg transition-colors"
                    >
                      <Download size={13} />
                      <span>{n.size}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Events, Placements & Mentor Info */}
        <div className="space-y-6">
          {/* Assigned Faculty Mentor Card */}
          {user.mentor && (
            <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap size={18} className="text-emerald-800" />
                <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800">
                  Assigned Faculty Mentor
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-base shrink-0 font-serif">
                  {user.mentor.name.split(" ")[1]?.charAt(0) || "M"}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-stone-900 leading-tight">{user.mentor.name}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{user.mentor.designation}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-200/70">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-700 shrink-0" />
                  <span className="truncate">{user.mentor.cabin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-emerald-700 shrink-0" />
                  <span className="truncate">{user.mentor.hours}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={`mailto:${user.mentor.email}`}
                  className="flex-1 py-2 text-center bg-white border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail size={13} />
                  <span>Email</span>
                </a>
                <button
                  onClick={() => showToast?.(`Appointment slot requested with ${user.mentor.name}`, "success")}
                  className="flex-1 py-2 text-center bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calendar size={13} />
                  <span>Meet Slot</span>
                </button>
              </div>
            </div>
          )}

          {/* Upcoming Campus Events & Hackathons */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-amber-800">
                  Campus Buzz
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900">Upcoming Events</h3>
              </div>
              <button
                onClick={() => onNavigate("events")}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition-colors"
              >
                <span>All Fests</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {liveEvents.slice(0, 3).map((e) => (
                <div
                  key={e.id}
                  className="p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50/40 border border-stone-200/80 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {e.tag}
                    </span>
                    <span className="text-[11px] text-amber-800 font-semibold">{e.badge}</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">{e.name}</h4>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                    <Clock size={11} /> {e.date} • {e.time}
                  </p>
                  <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {e.venue}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-stone-200/70 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500">{e.seatsLeft} seats remaining</span>
                    <button
                      onClick={() => handleRSVP(e.name)}
                      className="text-xs text-amber-900 font-bold hover:underline"
                    >
                      Register Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Placements & Internships */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-lime-800">
                  Career Cell
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900">Latest Drives</h3>
              </div>
              <button
                onClick={() => onNavigate("internships")}
                className="text-xs font-semibold text-lime-800 hover:text-lime-950 flex items-center gap-1 transition-colors"
              >
                <span>View Drives</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-2.5">
              {livePlacements.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{p.company}</p>
                    <p className="text-[11px] text-stone-500 truncate">{p.role}</p>
                    <p className="text-[10px] text-lime-800 font-bold mt-0.5">{p.package}</p>
                  </div>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-lime-800 hover:bg-lime-900 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-2xs"
                  >
                    Apply
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
