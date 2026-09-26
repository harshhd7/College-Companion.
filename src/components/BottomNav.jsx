import React from "react";
import { Home, Calendar, BookOpen, Briefcase, Menu } from "lucide-react";

export default function BottomNav({ activeView, onNavigate, onOpenMenu }) {
  const tabs = [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "timetable", label: "Classes", icon: Calendar },
    { key: "notes", label: "Notes", icon: BookOpen },
    { key: "internships", label: "Careers", icon: Briefcase },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile Navigation Bar"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeView === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onNavigate(t.key)}
              className={`flex flex-col items-center justify-center h-full w-full py-1 relative transition-colors ${
                isActive ? "text-emerald-800" : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {isActive && (
                <span className="absolute top-1.5 w-6 h-1 bg-emerald-800 rounded-full animate-in fade-in zoom-in-50 duration-200" />
              )}
              <Icon size={20} className={`mt-1 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? "font-bold text-emerald-900" : ""}`}>
                {t.label}
              </span>
            </button>
          );
        })}

        {/* More Menu Button */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center h-full w-full py-1 text-stone-400 hover:text-stone-700"
        >
          <Menu size={20} className="mt-1" />
          <span className="text-[10px] mt-1 font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
