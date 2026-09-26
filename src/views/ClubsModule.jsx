import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Mail,
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { campusClubs } from "../data/mockData";
import { clubsService } from "../lib/dataService";

export default function ClubsModule({ user, showToast }) {
  const [clubs, setClubs] = useState(campusClubs);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedClubIds, setJoinedClubIds] = useState([]);

  const loadClubs = async () => {
    try {
      const res = await clubsService.getClubs();
      if (res?.data && res.data.length > 0) {
        const formatted = res.data.map((c) => ({
          id: c.id,
          name: c.name,
          category: c.category || "Student Chapter",
          lead: c.lead || "Club Executive",
          members: c.member_count || 50,
          desc: c.description || "Active student chapter at MHSSCE.",
          status: c.recruitment_status || "Open",
          email: c.contact_email || "club@mhssce.ac.in",
        }));
        setClubs(formatted);
      }
    } catch (err) {
      console.warn("Could not load clubs from Supabase:", err);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const filteredClubs = clubs.filter(
    (c) =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinInterest = async (club) => {
    try {
      if (user?.id) {
        await clubsService.joinClub(club.id, user.id);
      }
      setJoinedClubIds((prev) => [...prev, club.id]);
      showToast?.(`Application submitted for ${club.name}! Check your email for orientation details.`, "success");
    } catch (err) {
      showToast?.(`Submitted interest for ${club.name}!`, "success");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-purple-800">
            Student Life & Chapters • MHSSCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Campus Societies & Technical Clubs
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Build projects, participate in national competitions, and grow your peer network.
          </p>
        </div>

        <div className="px-4 py-2 bg-purple-50 rounded-2xl border border-purple-200 text-xs font-semibold text-purple-900 flex items-center gap-2">
          <Users size={16} className="text-purple-700" />
          <span>{clubs.length} Active Student Chapters</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-xs">
        <Search size={18} className="text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search clubs by name, domain, or technologies..."
          className="w-full text-xs sm:text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400 font-sans"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-xs text-stone-400 hover:text-stone-700">
            Clear
          </button>
        )}
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClubs.map((club) => {
          const isJoined = joinedClubIds.includes(club.id);

          return (
            <div
              key={club.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200">
                    {club.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Recruitment {club.status}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-stone-900">{club.name}</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{club.desc}</p>

                <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <span>Lead: <strong>{club.lead}</strong></span>
                  <span>{club.members} Members</span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={`mailto:${club.email}`}
                  className="text-xs text-stone-500 hover:text-purple-900 flex items-center gap-1.5 transition-colors"
                >
                  <Mail size={13} />
                  <span>Contact Board</span>
                </a>

                {isJoined ? (
                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Applied</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleJoinInterest(club)}
                    className="px-4 py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
                  >
                    <span>Join Chapter</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
