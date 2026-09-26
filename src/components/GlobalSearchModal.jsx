import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Calendar, BookOpen, Briefcase, Users, MapPin, ArrowRight, Clock } from "lucide-react";
import { timetable, upcomingEvents, recentNotes, placementForms, campusClubs, quickCampusLocations } from "../data/mockData";

export default function GlobalSearchModal({ isOpen, onClose, onNavigate, showToast }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results = [];

    // Search classes in timetable
    Object.entries(timetable).forEach(([day, classes]) => {
      classes.forEach((c) => {
        if (c.subject.toLowerCase().includes(q) || c.faculty.toLowerCase().includes(q) || c.room.toLowerCase().includes(q)) {
          results.push({
            id: `class-${c.id}`,
            category: "Classes",
            title: c.subject,
            subtitle: `${day} • ${c.time} • ${c.room} (${c.faculty})`,
            icon: Calendar,
            view: "timetable",
          });
        }
      });
    });

    // Search Notes
    recentNotes.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.subject.toLowerCase().includes(q)) {
        results.push({
          id: `note-${n.id}`,
          category: "Course Notes",
          title: n.title,
          subtitle: `${n.subject} • ${n.uploader}`,
          icon: BookOpen,
          view: "notes",
        });
      }
    });

    // Search Events
    upcomingEvents.forEach((e) => {
      if (e.name.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.tag.toLowerCase().includes(q)) {
        results.push({
          id: `event-${e.id}`,
          category: "Events",
          title: e.name,
          subtitle: `${e.date} • ${e.venue}`,
          icon: Calendar,
          view: "events",
        });
      }
    });

    // Search Placements
    placementForms.forEach((p) => {
      if (p.company.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)) {
        results.push({
          id: `placement-${p.id}`,
          category: "Placements",
          title: p.company,
          subtitle: `${p.role} • ${p.package}`,
          icon: Briefcase,
          view: "internships",
        });
      }
    });

    // Search Campus Rooms
    quickCampusLocations.forEach((loc) => {
      if (loc.name.toLowerCase().includes(q) || loc.floor.toLowerCase().includes(q)) {
        results.push({
          id: `loc-${loc.name}`,
          category: "Campus Rooms",
          title: loc.name,
          subtitle: `${loc.floor} • ${loc.type}`,
          icon: MapPin,
          action: () => {
            navigator.clipboard?.writeText(loc.name);
            showToast?.(`Copied ${loc.name} (${loc.floor}) to clipboard!`, "success");
          },
        });
      }
    });

    // Search Clubs
    campusClubs.forEach((club) => {
      if (club.name.toLowerCase().includes(q) || club.category.toLowerCase().includes(q)) {
        results.push({
          id: `club-${club.id}`,
          category: "Campus Clubs",
          title: club.name,
          subtitle: `${club.category} • ${club.recruitmentStatus}`,
          icon: Users,
          view: "clubs",
        });
      }
    });

    return results.slice(0, 8);
  }, [query, showToast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-stone-200 bg-stone-50/50">
          <Search size={20} className="text-stone-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, rooms, notes, events, clubs..."
            className="w-full py-4 text-sm sm:text-base text-stone-900 bg-transparent outline-none placeholder:text-stone-400 font-sans"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1.5 text-stone-400 hover:text-stone-600 rounded-md">
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} className="ml-2 px-2 py-1 text-xs text-stone-500 bg-stone-200/80 rounded font-mono hover:bg-stone-300 transition-colors">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto divide-y divide-stone-100 flex-1">
          {query.trim() === "" ? (
            <div className="py-8 px-4 text-center">
              <div className="inline-flex p-3 bg-emerald-50 text-emerald-700 rounded-full mb-3">
                <Search size={22} />
              </div>
              <p className="text-sm font-semibold text-stone-800">Quick Campus Search</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                Type course names (e.g. "AIDS-II", "IOE"), room codes ("Room 303", "IS Lab"), companies ("TCS"), or clubs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {["Room 303", "AIDS-II", "IOE", "TCS", "ACM"].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setQuery(sample)}
                    className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 rounded-full text-stone-600 transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs mt-1 text-stone-400">Try searching with a broader keyword or check spelling.</p>
            </div>
          ) : (
            searchResults.map((res) => {
              const Icon = res.icon;
              return (
                <button
                  key={res.id}
                  onClick={() => {
                    if (res.action) {
                      res.action();
                    } else if (res.view) {
                      onNavigate(res.view);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors truncate">
                          {res.title}
                        </p>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                          {res.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-0.5">{res.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight size={15} className="text-stone-300 group-hover:text-emerald-700 transition-colors shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
          <span>College Companion Unified Index</span>
          <span className="text-stone-400">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}
