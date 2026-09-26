import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Search,
  BookOpen,
  Filter,
  Download,
  Info,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { timetable, days, todayIndex, quickCampusLocations } from "../data/mockData";
import { timetableService, examService } from "../lib/dataService";

export default function TimetableModule({ user, showToast }) {
  const [selectedDay, setSelectedDay] = useState(days[todayIndex] || "Mon");
  const [viewMode, setViewMode] = useState("timeline"); // 'timeline' | 'compact' | 'exams'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(user?.batch || "ALL");
  const [liveTimetable, setLiveTimetable] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mapping day names between short & full
  const fullDayMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  };

  useEffect(() => {
    let isMounted = true;
    const loadSchedule = async () => {
      setLoading(true);
      try {
        const [ttRes, examRes] = await Promise.all([
          timetableService.getWeeklySchedule({
            batch: selectedBatch,
            department: user?.department || "Information Technology",
            semester: user?.semester || "Semester 7",
          }),
          examService.getExams({
            department: user?.department || "Information Technology",
            year: user?.year || "BE",
            semester: user?.semester || "Semester 7",
          }),
        ]);

        if (!isMounted) return;
        if (ttRes?.data) {
          setLiveTimetable(ttRes.data);
        }
        if (examRes?.data) {
          setExams(examRes.data);
        }
      } catch (err) {
        console.warn("Could not load timetable from Supabase:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSchedule();
    return () => {
      isMounted = false;
    };
  }, [selectedBatch, user]);

  const fullDayName = fullDayMap[selectedDay] || selectedDay;

  // Resolve classes for selected day
  let classes = [];
  if (liveTimetable && liveTimetable[fullDayName] && liveTimetable[fullDayName].length > 0) {
    classes = liveTimetable[fullDayName].map((slot, idx) => ({
      id: slot.id,
      period: idx + 1,
      subject: slot.subjects?.abbreviation
        ? `${slot.subjects.abbreviation} (${slot.subjects.course_name})`
        : slot.session_type === "Break"
        ? "Recess Break"
        : "Major Project I Review",
      code: slot.subjects?.course_code || (slot.session_type === "Break" ? "RECESS" : "ITP701"),
      faculty: slot.faculty ? `${slot.faculty.name} (${slot.faculty.faculty_code})` : "Staff Advisor",
      time: `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`,
      room: slot.room,
      type: slot.session_type,
      batch: slot.batch,
      group: slot.practical_group,
      status: idx === 0 ? "completed" : idx === 1 ? "in-progress" : "upcoming",
    }));
  } else {
    classes = timetable[selectedDay] || [];
  }

  const filteredClasses = classes.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.subject.toLowerCase().includes(q) ||
      c.room.toLowerCase().includes(q) ||
      c.faculty.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  const handleExportSchedule = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Period,Time,Course,Code,Room,Faculty,Batch"]
        .concat(
          filteredClasses.map(
            (c) =>
              `"${c.period}","${c.time}","${c.subject}","${c.code}","${c.room}","${c.faculty}","${c.batch || "ALL"}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MHSSCE_IT_Sem7_Timetable_${selectedDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.(`Exported ${selectedDay} timetable CSV!`, "success");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800">
              Department of Information Technology • MHSSCE
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200">
              SH 2026 Version 2 • BE Sem VII
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Academic Schedule & Timetable
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Effective from 06-07-2026 • Classrooms 303, 305, 306 & IT Laboratories.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Batch Selector */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs">
            <span className="text-stone-500 px-2 font-medium">Batch:</span>
            {["ALL", "A", "B", "C"].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBatch(b)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedBatch === b
                    ? "bg-emerald-900 text-white shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportSchedule}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Day Selector Pills Bar */}
      <div className="bg-white p-2.5 rounded-2xl border border-stone-200/90 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {days.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isSelected = selectedDay === day && viewMode !== "exams";
            return (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  if (viewMode === "exams") setViewMode("timeline");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-900 text-white shadow-xs"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <span>{day}</span>
                {isToday && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isSelected ? "bg-emerald-800 text-emerald-200" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    Today
                  </span>
                )}
              </button>
            );
          })}

          {/* Exam Schedule Tab Button */}
          <button
            onClick={() => setViewMode("exams")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === "exams"
                ? "bg-amber-900 text-white shadow-xs"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            <Sparkles size={13} className="text-amber-300" />
            <span>IA Test 1 Schedule ({exams.length})</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === "timeline" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode("compact")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              viewMode === "compact" ? "bg-white text-stone-900 shadow-2xs" : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Compact Table
          </button>
        </div>
      </div>

      {/* Filter & Quick Search */}
      {viewMode !== "exams" && (
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by subject (e.g. 'AI and DS', 'IOE', 'STQA'), room (303, 305, 306), or faculty..."
            className="w-full text-xs sm:text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* VIEW MODE 1: EXAM SCHEDULES */}
      {viewMode === "exams" ? (
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Official Examination Timetable
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Internal Assessment Test 1 (August 2026)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                MHSSCE Information Technology Department • SE, TE, and BE Examination Slots
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold rounded-xl text-xs border border-amber-300">
              Department Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px] tracking-wider border-y border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Course Code</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4">Year / Sem</th>
                  <th className="py-3 px-4">Faculty In-Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {exams.map((ex) => (
                  <tr key={ex.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900 whitespace-nowrap">
                      {new Date(ex.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-stone-700 whitespace-nowrap">
                      {ex.start_time?.slice(0, 5)} – {ex.end_time?.slice(0, 5)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {ex.course_code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{ex.course_name}</td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                      {ex.year} • {ex.semester}
                    </td>
                    <td className="py-3 px-4 text-stone-700 whitespace-nowrap">
                      {ex.faculty_in_charge || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center text-stone-400">
          <Calendar size={40} className="mx-auto mb-3 text-stone-300" />
          <h3 className="font-semibold text-stone-800 text-base">No sessions scheduled</h3>
          <p className="text-xs text-stone-500 mt-1">
            {selectedDay === "Sat"
              ? "Saturday is reserved for project work, open labs, and student chapter hackathons."
              : "No classes match your current search query or batch filter."}
          </p>
        </div>
      ) : viewMode === "timeline" ? (
        /* Timeline View */
        <div className="space-y-3">
          {filteredClasses.map((c) => {
            const isCurrent = c.status === "in-progress";

            return (
              <div
                key={c.id}
                className={`p-5 rounded-3xl bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${
                  isCurrent ? "border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/30" : "border-stone-200/90 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-start md:items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold ${
                      isCurrent
                        ? "bg-emerald-800 text-white shadow-xs"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 leading-none">
                      Slot
                    </span>
                    <span className="text-base">{c.period}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-stone-900">{c.subject}</h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {c.code}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {c.type}
                      </span>
                      {c.batch && c.batch !== "ALL" && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                          Batch {c.batch} {c.group ? `(${c.group})` : ""}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-700 text-white animate-pulse">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Faculty Instructor: <strong className="text-stone-700">{c.faculty}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  <div className="text-xs text-stone-600">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Clock size={14} className="text-stone-400" />
                      <span>{c.time}</span>
                    </p>
                    <p className="text-emerald-800 font-bold flex items-center gap-1.5 mt-0.5">
                      <MapPin size={14} className="text-emerald-700" />
                      <span>Room {c.room}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(c.room);
                      showToast?.(`Copied Room ${c.room} to clipboard!`, "success");
                    }}
                    className="p-2 text-stone-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors"
                    title="Copy classroom location"
                  >
                    <MapPin size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Table Mode */
        <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Period</th>
                <th className="p-4">Time</th>
                <th className="p-4">Course & Code</th>
                <th className="p-4">Batch</th>
                <th className="p-4">Room</th>
                <th className="p-4">Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredClasses.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-bold text-stone-900">Period {c.period}</td>
                  <td className="p-4 text-stone-600">{c.time}</td>
                  <td className="p-4">
                    <div className="font-bold text-stone-900">{c.subject}</div>
                    <div className="text-[10px] text-stone-400">{c.code} • {c.type}</div>
                  </td>
                  <td className="p-4 font-semibold text-purple-900">{c.batch || "ALL"}</td>
                  <td className="p-4 font-semibold text-emerald-800">Room {c.room}</td>
                  <td className="p-4 text-stone-600">{c.faculty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Campus Location Map Directory */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-emerald-800" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700">
            MHSSCE Classroom & IT Laboratory Directory
          </h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {[
            { name: "Room 303", floor: "3rd Floor • Main IT Lecture Hall" },
            { name: "Room 305", floor: "3rd Floor • DLOC Elective Classroom" },
            { name: "Room 306", floor: "3rd Floor • ILOC / Tutorial Hall" },
            { name: "Project Lab (PL)", floor: "4th Floor • Major Project Lab" },
            { name: "Software Engg Lab (SE)", floor: "4th Floor • IT Lab 2" },
            { name: "Web Engg Lab (WE)", floor: "4th Floor • IT Lab 3" },
            { name: "Database Lab (DB)", floor: "4th Floor • IT Lab 1" },
            { name: "Information Sec Lab (IS)", floor: "4th Floor • Cyber Security Lab" },
          ].map((loc) => (
            <div key={loc.name} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="font-bold text-emerald-950 block">{loc.name}</span>
              <span className="text-[11px] text-stone-500 block truncate">{loc.floor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
