import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List,
  CalendarPlus,
  Share2,
  X,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { upcomingEvents } from "../data/mockData";
import { eventsService } from "../lib/dataService";

export default function CampusEventsFeed({ user, showToast }) {
  const [events, setEvents] = useState(upcomingEvents);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [isRegistering, setIsRegistering] = useState(false);

  // Fetch from Supabase
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await eventsService.getEvents();
      if (res?.data && res.data.length > 0) {
        const formatted = res.data.map((e) => ({
          id: e.id,
          name: e.title || e.name,
          tag: e.category || "Technical",
          badge: e.category === "Workshop" ? "Hands-on Lab" : e.category === "Seminar" ? "Industry Speaker" : "Campus",
          date: e.event_date
            ? new Date(e.event_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : e.date,
          time: e.start_time?.slice(0, 5)
            ? `${e.start_time.slice(0, 5)} - ${e.end_time?.slice(0, 5) || "17:00"}`
            : e.time || "10:00 AM",
          venue: e.venue || "Room 303 / Main Auditorium",
          organizer: e.organizer || "Dept. of Information Technology",
          seatsLeft: e.seats_left ?? 25,
          description: e.description || "Technical seminar & hands-on development workshop.",
          speaker: e.speaker || "Faculty & Industry Specialists",
        }));
        setEvents(formatted);
      }
    } catch (err) {
      console.warn("Could not load events from Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const eventTypes = ["All", "Workshop", "Seminar", "Hackathon", "Technical"];

  const filteredEvents = events.filter((evt) => {
    const matchesType =
      filterType === "All" ||
      evt.tag?.toLowerCase() === filterType.toLowerCase() ||
      evt.name?.toLowerCase().includes(filterType.toLowerCase());

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      evt.name?.toLowerCase().includes(query) ||
      evt.venue?.toLowerCase().includes(query) ||
      evt.organizer?.toLowerCase().includes(query) ||
      evt.description?.toLowerCase().includes(query) ||
      (evt.speaker && evt.speaker.toLowerCase().includes(query));

    return matchesType && matchesSearch;
  });

  const handleRegisterConfirm = (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsRegistering(true);
    setTimeout(() => {
      setRegisteredEventIds((prev) => new Set([...prev, selectedEvent.id]));
      setIsRegistering(false);
      showToast?.(`Registered for "${selectedEvent.name}"! Confirmation sent to ${user?.email || "student email"}.`, "success");
      setSelectedEvent(null);
    }, 400);
  };

  const handleAddToCalendar = (evt, e) => {
    e.stopPropagation();
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MHSSCE//College Companion//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${evt.name}`,
      `DESCRIPTION:${evt.description}`,
      `LOCATION:${evt.venue}`,
      `ORGANIZER:${evt.organizer}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${evt.name.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast?.(`Calendar invite (.ics) generated for ${evt.name}`, "info");
  };

  return (
    <div className="space-y-6">
      {/* Header controls bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
            <span>MHSSCE IT Curriculum</span>
            <span aria-hidden="true">·</span>
            <span>Seminars & Skill Labs</span>
            <span aria-hidden="true">·</span>
            <span>Semester VII</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Campus Events, Workshops & Seminars
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Curated technical seminars, hands-on lab workshops, and student symposiums for Information Technology students.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200/80">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="Card Grid Feed"
            >
              <LayoutGrid size={15} />
              <span className="hidden sm:inline">Feed</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="Filterable List View"
            >
              <List size={15} />
              <span className="hidden sm:inline">List View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workshops, seminars, topics, venues, or speakers..."
            className="w-full text-xs sm:text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-stone-400 hover:text-stone-600 text-xs"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter type buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-stone-200/90 shadow-xs overflow-x-auto">
          {eventTypes.map((type) => {
            const isSelected = filterType.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Current Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? "event" : "events"}
          {filterType !== "All" && ` matching "${filterType}"`}
        </span>
        <span>Semester VII Academic Year 2026</span>
      </div>

      {/* VIEW MODE: LIST VIEW */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Date & Time</th>
                  <th className="py-3.5 px-5">Event Title & Topic</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Organizer</th>
                  <th className="py-3.5 px-5 text-right">Registration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-500">
                      No workshops or seminars match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => {
                    const isRegistered = registeredEventIds.has(evt.id);
                    return (
                      <tr
                        key={evt.id}
                        className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedEvent(evt)}
                      >
                        <td className="py-4 px-5 whitespace-nowrap">
                          <p className="font-semibold text-stone-900">{evt.date}</p>
                          <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <Clock size={12} className="text-stone-400" />
                            {evt.time}
                          </p>
                        </td>
                        <td className="py-4 px-5 min-w-[240px]">
                          <p className="font-bold text-stone-900 text-sm">{evt.name}</p>
                          <p className="text-stone-500 text-[11px] line-clamp-1 mt-0.5">
                            {evt.description}
                          </p>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-semibold text-stone-800">
                            {evt.tag}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-stone-600 flex items-center gap-1.5">
                            <MapPin size={13} className="text-stone-400 shrink-0" />
                            {evt.venue}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-stone-500">
                          {evt.organizer}
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => handleAddToCalendar(evt, e)}
                              title="Add to calendar"
                              className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                            >
                              <CalendarPlus size={14} />
                            </button>
                            {isRegistered ? (
                              <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
                                <CheckCircle2 size={13} />
                                Confirmed
                              </span>
                            ) : (
                              <button
                                onClick={() => setSelectedEvent(evt)}
                                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors"
                              >
                                RSVP
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW MODE: GRID / FEED VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500">
              No upcoming workshops or seminars found for this filter.
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const isRegistered = registeredEventIds.has(evt.id);
              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Quiet metadata line without pills */}
                    <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                          {evt.tag}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.organizer}</span>
                      </div>
                      <span className="text-[11px] text-amber-800 font-semibold">{evt.badge}</span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-950 transition-colors">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-stone-600 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/70">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-stone-400 shrink-0" />
                        <span className="font-medium text-stone-800">{evt.date}</span>
                        <span aria-hidden="true">·</span>
                        <Clock size={13} className="text-stone-400 shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-stone-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      {isRegistered ? "You're attending" : `${evt.seatsLeft} slots left`}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleAddToCalendar(evt, e)}
                        title="Add to Calendar (.ics)"
                        className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                      >
                        <CalendarPlus size={14} />
                      </button>

                      {isRegistered ? (
                        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-700" />
                          <span>Registered</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedEvent(evt)}
                          className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
                        >
                          <span>RSVP</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* EVENT DETAILS & REGISTRATION MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <span>{selectedEvent.tag}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedEvent.organizer}</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900 leading-tight">
                  {selectedEvent.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 mb-5 leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200/80 mb-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-0.5">
                  Date & Time
                </span>
                <p className="font-semibold text-stone-800">{selectedEvent.date}</p>
                <p className="text-stone-500">{selectedEvent.time}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-0.5">
                  Venue Location
                </span>
                <p className="font-semibold text-stone-800">{selectedEvent.venue}</p>
                <p className="text-stone-500">MHSSCE Campus</p>
              </div>
            </div>

            <form onSubmit={handleRegisterConfirm} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || "Harsh Desai"}
                  className="w-full py-2 px-3 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || "harshdesaihd007@gmail.com"}
                  className="w-full py-2 px-3 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering || registeredEventIds.has(selectedEvent.id)}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isRegistering ? (
                    <span>Registering...</span>
                  ) : registeredEventIds.has(selectedEvent.id) ? (
                    <span>Already Registered</span>
                  ) : (
                    <span>Confirm Free RSVP</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
