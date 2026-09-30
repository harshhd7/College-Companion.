import React, { useState } from "react";
import {
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  GraduationCap,
  ArrowUpRight,
  Layers,
  BookOpen
} from "lucide-react";

export default function DashboardSummaryGrid({
  todayClasses = [],
  activeClass,
  todayName = "Tuesday",
  upcomingEvents = [],
  onNavigate,
  onOpenOfficialDocs,
  showToast,
}) {
  const [rsvpState, setRsvpState] = useState({});

  // Calculations for Today's Classes Summary
  const totalClasses = todayClasses.length;
  const completedCount = todayClasses.filter((c) => c.status === "completed").length;
  const activeCount = todayClasses.filter((c) => c.status === "in-progress").length;
  const remainingCount = totalClasses - completedCount;

  // Next event
  const primaryEvent = upcomingEvents[0] || {
    id: "e1",
    name: "Hands-on Workshop: Deep Learning with PyTorch & HuggingFace",
    date: "Aug 14, 2026",
    time: "10:00 AM – 1:00 PM",
    venue: "Information Security (IS) Lab",
    tag: "Workshop",
    badge: "Hands-on Lab",
    seatsLeft: 12,
  };

  const secondaryEvent = upcomingEvents[1] || {
    id: "e2",
    name: "Industry Seminar: IoT Architectures & Smart City Deployments",
    date: "Aug 18, 2026",
    time: "2:00 PM – 4:00 PM",
    venue: "Room 303 (Seminar Hall)",
    tag: "Seminar",
    seatsLeft: 28,
  };

  const handleQuickRSVP = (e, eventId, eventTitle) => {
    e.stopPropagation();
    setRsvpState((prev) => ({ ...prev, [eventId]: true }));
    showToast?.(`RSVP confirmed for "${eventTitle}". Calendar invitation sent!`, "success");
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
            Daily Academic Snapshot
          </span>
          <span className="text-xs text-stone-500 font-medium">
            Semester VII • Official SH 2026 Version 2
          </span>
        </div>

        <button
          onClick={() => onNavigate?.("timetable")}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
        >
          <span>View Weekly Grid</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Grid Layout: 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SUMMARY CARD 1: Upcoming Classes - Next Immediate Lecture */}
        <div
          onClick={() => onNavigate?.("timetable")}
          className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {activeClass?.status === "in-progress" ? "Active Now" : "Next Class"}
              </span>
              <span className="text-xs font-mono font-semibold text-stone-600">
                P{activeClass?.period || 1} of {totalClasses || 5}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 font-mono">
                {activeClass?.code || "ITC701"}
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-emerald-900 transition-colors line-clamp-1">
                {activeClass?.subject || "AI and DS - II"}
              </h3>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/70">
              <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                <Clock size={13} className="text-emerald-700 shrink-0" />
                <span>{activeClass?.time || "11:00 AM – 12:00 PM"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <MapPin size={13} className="text-emerald-700 shrink-0" />
                <span>Lecture Hall {activeClass?.room || "303"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span className="truncate max-w-[150px]">
              {activeClass?.faculty || "Dr. Zainab Mirza"}
            </span>
            <span className="text-emerald-800 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>View</span>
              <ChevronRight size={13} />
            </span>
          </div>
        </div>

        {/* SUMMARY CARD 2: Upcoming Classes - Today's Schedule Overview */}
        <div
          onClick={() => onNavigate?.("timetable")}
          className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                {todayName}'s Plan
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                {completedCount}/{totalClasses} Done
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif font-bold text-stone-900">
                  {remainingCount}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  sessions remaining today
                </span>
              </div>

              {/* Progress step dots */}
              <div className="flex items-center gap-1.5 mt-2">
                {todayClasses.map((c, i) => (
                  <div
                    key={c.id || i}
                    title={`${c.subject} (${c.time})`}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      c.status === "completed"
                        ? "bg-stone-300"
                        : c.status === "in-progress"
                        ? "bg-emerald-600 ring-2 ring-emerald-200"
                        : "bg-emerald-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                Afternoon Practicals (2:00 – 4:00 PM)
              </span>
              <p className="text-stone-800 font-medium truncate">
                Batch A (IS) • Batch B (WE) • Batch C (PL)
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>5 Periods Scheduled</span>
            <span className="text-emerald-800 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>Full Schedule</span>
              <ChevronRight size={13} />
            </span>
          </div>
        </div>

        {/* SUMMARY CARD 3: Recent Events - Next Upcoming Campus Workshop */}
        <div
          onClick={() => onNavigate?.("events")}
          className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                {primaryEvent.tag || "Workshop"}
              </span>
              <span className="text-[11px] font-bold text-amber-800">
                {primaryEvent.seatsLeft} seats left
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Campus Technical Event
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                {primaryEvent.name}
              </h3>
            </div>

            <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/70">
              <div className="flex items-center gap-1.5 font-medium text-stone-800">
                <Calendar size={13} className="text-amber-700 shrink-0" />
                <span>{primaryEvent.date} • {primaryEvent.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <MapPin size={13} className="text-amber-700 shrink-0" />
                <span className="truncate">{primaryEvent.venue}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              onClick={(e) => handleQuickRSVP(e, primaryEvent.id, primaryEvent.name)}
              className={`px-3 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${
                rsvpState[primaryEvent.id]
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-950 hover:bg-amber-200"
              }`}
            >
              {rsvpState[primaryEvent.id] ? (
                <>
                  <CheckCircle2 size={12} className="text-emerald-700" />
                  <span>RSVP'd ✓</span>
                </>
              ) : (
                <span>Quick RSVP →</span>
              )}
            </button>
            <span className="text-amber-900 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>All Events</span>
              <ChevronRight size={13} />
            </span>
          </div>
        </div>

        {/* SUMMARY CARD 4: Official Milestones & Project Review 2 */}
        <div
          onClick={onOpenOfficialDocs}
          className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-3xl p-5 shadow-xs hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-stone-950">
                Official Milestone
              </span>
              <span className="text-[11px] text-stone-300 font-mono">
                BE Sem VII
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                Authoritative Schedule
              </span>
              <h3 className="text-base font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                Project Review 2 & Admission
              </h3>
            </div>

            <div className="space-y-1.5 text-xs text-stone-300 bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs border border-white/10">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <Calendar size={13} className="text-emerald-400 shrink-0" />
                <span>Review 2: Sep 24 – 25, 2026</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-200">
                <Building size={13} className="text-emerald-400 shrink-0" />
                <span>Panels 1, 2, 3 • Room 303 & Labs</span>
              </div>
              <p className="text-[11px] text-amber-300 pt-0.5 font-medium">
                Admission Fee Deadline: Sep 30, 2026
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-stone-400">
            <span className="text-emerald-300 font-semibold">12 Groups Assigned</span>
            <span className="text-white font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              <span>View Specs</span>
              <ChevronRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
