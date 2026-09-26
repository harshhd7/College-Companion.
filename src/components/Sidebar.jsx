import React from "react";
import {
  Home,
  Calendar,
  Search,
  Users,
  BookOpen,
  Briefcase,
  MessageSquare,
  Bell,
  GraduationCap,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
  X,
} from "lucide-react";

export const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Home, badge: null },
  { key: "timetable", label: "Timetable", icon: Calendar, badge: "Live" },
  { key: "notes", label: "Course Notes", icon: BookOpen, badge: "Repo" },
  { key: "internships", label: "Placements", icon: Briefcase, badge: "T&P" },
  { key: "studygroups", label: "Study Groups", icon: MessageSquare, badge: null },
  { key: "events", label: "Events & Fests", icon: Bell, badge: "Hackathon" },
  { key: "lostfound", label: "Lost & Found", icon: Search, badge: null },
  { key: "clubs", label: "Student Clubs", icon: Users, badge: null },
  { key: "admin", label: "Admin Console", icon: ShieldCheck, badge: "Staff", adminOnly: true },
];

export default function Sidebar({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  user,
  onOpenProfile,
  onLogout,
}) {
  const visibleNavItems = navItems.filter((item) => {
    if (item.adminOnly) {
      return user?.role === "admin" || user?.role === "faculty";
    }
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 w-64 bg-stone-900 text-stone-100 flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <GraduationCap size={20} />
            </div>
            <div>
              <span className="font-serif font-bold text-white text-base tracking-tight leading-tight block">
                Companion
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 -mt-0.5 block">
                Academic Portal
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Main Menu
          </div>

          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={`${
                      isActive
                        ? "text-white"
                        : "text-stone-400 group-hover:text-emerald-400 transition-colors"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-emerald-900/60 text-emerald-200"
                        : "bg-stone-800 text-stone-400 group-hover:bg-emerald-950 group-hover:text-emerald-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-stone-800 bg-stone-950/60 space-y-2">
          {/* User Preview */}
          <div
            onClick={onOpenProfile}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800/80 flex items-center justify-between cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.avatar || user?.initials || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-200 truncate group-hover:text-white">
                  {user?.name || "Student"}
                </p>
                <p className="text-[10px] text-stone-500 truncate">
                  {user?.department ? `${user.department.split(" ")[0]} • ${user.semester || user.role}` : user?.role}
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-stone-500 group-hover:text-stone-300 shrink-0" />
          </div>

          {/* Quick Sign Out Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
