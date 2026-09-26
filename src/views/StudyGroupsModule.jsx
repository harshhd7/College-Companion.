import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import { studyGroups } from "../data/mockData";
import { studyGroupsService } from "../lib/dataService";

export default function StudyGroupsModule({ user, showToast }) {
  const [groups, setGroups] = useState(studyGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newGroupForm, setNewGroupForm] = useState({
    subject: "AI and DS - II",
    focus: "PyTorch & Deep Learning Project Collaboration",
    link: "https://chat.whatsapp.com/example-it-sem7",
    tags: "Study, Project, Sem 7",
  });

  const loadGroups = async () => {
    try {
      const res = await studyGroupsService.getGroups();
      if (res?.data && res.data.length > 0) {
        const formatted = res.data.map((g) => ({
          id: g.id,
          subject: g.subject_name || g.subject,
          lead: g.created_by_name || g.lead || "Peer Leader",
          members: g.members_count || 12,
          link: g.group_link || g.link || "#",
          focus: g.focus_topic || g.focus || "Peer discussion & syllabus completion",
          tags: ["Study", "Sem 7"],
        }));
        setGroups(formatted);
      }
    } catch (err) {
      console.warn("Could not load study groups:", err);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const filteredGroups = groups.filter(
    (g) =>
      !searchQuery ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.focus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = (group) => {
    if (group.link && group.link !== "#") {
      window.open(group.link, "_blank", "noreferrer");
      showToast?.(`Redirecting to peer chat for "${group.subject}"!`, "success");
    } else {
      showToast?.(`Joined study group "${group.subject}"!`, "success");
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const createdRecord = {
        subject_name: newGroupForm.subject,
        focus_topic: newGroupForm.focus,
        group_link: newGroupForm.link,
        created_by_name: `${user?.name || "Student"} (Sem 7)`,
        user_id: user?.id || null,
        members_count: 1,
      };

      await studyGroupsService.createGroup(createdRecord);
      showToast?.(`Study group for "${newGroupForm.subject}" created!`, "success");
      setCreateModalOpen(false);
      setNewGroupForm({
        subject: "AI and DS - II",
        focus: "PyTorch & Deep Learning Project Collaboration",
        link: "https://chat.whatsapp.com/example-it-sem7",
        tags: "Study, Project, Sem 7",
      });
      loadGroups();
    } catch (err) {
      // Local fallback
      const created = {
        id: `sg-${Date.now()}`,
        subject: newGroupForm.subject,
        lead: `${user?.name || "Harsh D."} (${user?.semester || "Sem 7"})`,
        members: 1,
        link: newGroupForm.link,
        focus: newGroupForm.focus,
        tags: newGroupForm.tags.split(",").map((t) => t.trim()),
      };
      setGroups([created, ...groups]);
      setCreateModalOpen(false);
      showToast?.(`Study group for "${created.subject}" created!`, "success");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-rose-800">
            Peer Learning Community • MHSSCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Subject Study Circles
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Connect with classmates, join active WhatsApp subject channels, and share assignment doubts.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Form Study Group</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-xs">
        <Search size={18} className="text-stone-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search study groups by subject (e.g. 'AI & DS', 'IOE', 'STQA') or topic..."
          className="w-full text-xs sm:text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400 font-sans"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-xs text-stone-400 hover:text-stone-700">
            Clear
          </button>
        )}
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-900 border border-rose-200">
                  {group.subject}
                </span>
                <span className="text-xs font-semibold text-stone-500">{group.members} Members</span>
              </div>

              <h3 className="font-serif font-bold text-base text-stone-900">{group.focus}</h3>

              <div className="mt-4 p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-600 space-y-1">
                <div>Lead / Moderator: <strong>{group.lead}</strong></div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {group.tags?.map((t) => (
                    <span key={t} className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 text-stone-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-700" />
                Verified Peers
              </span>

              <button
                onClick={() => handleJoin(group)}
                className="px-4 py-1.5 bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span>Join Group</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">Form New Study Circle</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Subject</label>
                <select
                  value={newGroupForm.subject}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, subject: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                >
                  <option value="AI and DS - II">AI and DS - II (ITC701)</option>
                  <option value="Internet of Everything">Internet of Everything (ITC702)</option>
                  <option value="Software Testing & QA">Software Testing & QA (ITDO7014)</option>
                  <option value="Information Retrieval System">Information Retrieval (ITDO7024)</option>
                  <option value="Major Project I">Major Project I (ITP701)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Focus & Learning Goals</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit test case automation & Selenium practice"
                  value={newGroupForm.focus}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, focus: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">WhatsApp / Discord Chat Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  value={newGroupForm.link}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, link: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold shadow-xs"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
