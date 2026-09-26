import React from "react";
import { Search, Bell, Menu, GraduationCap, ShieldCheck, Sparkles, User } from "lucide-react";

export default function Navbar({
  user,
  onOpenSidebar,
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  onSwitchRole,
  unreadCount = 0,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 text-white flex items-center justify-center shadow-xs">
              <GraduationCap size={20} className="text-emerald-300" />
            </div>
            <div>
              <span className="font-serif font-bold text-stone-900 text-base tracking-tight leading-tight block">
                Companion
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 -mt-1 block">
                MHSSCE Student Portal
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Global Search Trigger Button */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-stone-100/80 hover:bg-stone-100 border border-stone-200/60 rounded-xl text-xs text-stone-500 transition-all group"
          >
            <span className="flex items-center gap-2 group-hover:text-stone-700">
              <Search size={15} className="text-stone-400 group-hover:text-emerald-700 transition-colors" />
              <span>Search classes, rooms, notes, events...</span>
            </span>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white border border-stone-200 rounded text-stone-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Role Badge, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search icon */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Persona quick switch badge */}
          <button
            onClick={onSwitchRole}
            title="Click to toggle between Student & Admin persona"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              user?.role === "admin"
                ? "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
                : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            {user?.role === "admin" ? <ShieldCheck size={14} className="text-amber-700" /> : <Sparkles size={14} className="text-emerald-700" />}
            <span className="capitalize">{user?.role || "student"}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* User Profile Capsule */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 hover:bg-stone-100 border border-transparent hover:border-stone-200 rounded-full transition-all text-left"
            aria-label="User Profile"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.avatar || user?.initials || "U"}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[100px]">
                {user?.name || "Student"}
              </p>
              <p className="text-[10px] text-stone-500 leading-tight">
                {user?.role === "admin" ? "Faculty" : user?.semester || "Sem 6"}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
