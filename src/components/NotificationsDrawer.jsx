import React, { useState } from "react";
import { Bell, X, CheckCheck, Clock, Calendar, Briefcase, BookOpen, AlertTriangle } from "lucide-react";

export default function NotificationsDrawer({ isOpen, onClose, notifications, setNotifications, onNavigate }) {
  const [filter, setFilter] = useState("All");

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "All") return true;
    return n.category.toLowerCase() === filter.toLowerCase();
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "academic":
        return <Calendar size={15} className="text-emerald-700" />;
      case "placements":
        return <Briefcase size={15} className="text-lime-700" />;
      case "notes":
        return <BookOpen size={15} className="text-sky-700" />;
      default:
        return <Bell size={15} className="text-amber-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-stone-200 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 text-base flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-emerald-800 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-500">Live campus updates & alerts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Action & Filter Bar */}
          <div className="px-5 py-3 border-b border-stone-200 flex items-center justify-between bg-white gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[70%]">
              {["All", "Academic", "Placements", "Notes"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
                    filter === cat
                      ? "bg-emerald-900 text-white shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-800 font-semibold hover:text-emerald-950 flex items-center gap-1 transition-colors"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center text-stone-400">
                <Bell size={32} className="mx-auto text-stone-300 mb-2" />
                <p className="text-sm font-medium text-stone-600">No notifications here</p>
                <p className="text-xs text-stone-400 mt-0.5">You're all caught up with your campus feed!</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-4 rounded-xl transition-all ${
                    n.unread ? "bg-emerald-50/40 border border-emerald-100/80 mb-1" : "hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-semibold ${n.unread ? "text-stone-900 font-bold" : "text-stone-800"}`}>
                          {n.title}
                        </p>
                        <span className="text-[11px] text-stone-400 shrink-0 flex items-center gap-1">
                          <Clock size={11} />
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.body}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                          {n.category}
                        </span>
                        {n.category.toLowerCase() === "academic" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate?.("timetable");
                              onClose();
                            }}
                            className="text-[11px] text-emerald-800 font-semibold hover:underline"
                          >
                            Open Timetable →
                          </button>
                        )}
                        {n.category.toLowerCase() === "placements" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate?.("internships");
                              onClose();
                            }}
                            className="text-[11px] text-lime-800 font-semibold hover:underline"
                          >
                            View Drive →
                          </button>
                        )}
                        {n.category.toLowerCase() === "notes" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate?.("notes");
                              onClose();
                            }}
                            className="text-[11px] text-sky-800 font-semibold hover:underline"
                          >
                            Open Notes →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>MHSSCE Campus Alerts System</span>
            <button
              onClick={onClose}
              className="text-stone-600 font-medium hover:text-stone-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
