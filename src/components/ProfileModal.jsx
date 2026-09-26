import React, { useState } from "react";
import { X, User, Mail, ShieldCheck, Award, BookOpen, GraduationCap, Phone, MapPin, Calendar, Clock, LogOut } from "lucide-react";

export default function ProfileModal({ isOpen, onClose, user, onUpdateUser, onLogout, onSwitchRole, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    rollNumber: user?.rollNumber || "",
    department: user?.department || "Information Technology",
    semester: user?.semester || "Semester 7",
  });

  if (!isOpen || !user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      ...formData,
      initials: (formData.name || "U").charAt(0).toUpperCase(),
    });
    setIsEditing(false);
    showToast?.("Profile updated successfully!", "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800/60 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 border-2 border-emerald-400/50 flex items-center justify-center text-2xl font-bold font-serif text-white shadow-inner">
              {user.avatar || user.initials || "HD"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif">{user.name}</h2>
                {user.role === "admin" ? (
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                    <ShieldCheck size={12} /> Admin
                  </span>
                ) : (
                  <span className="bg-emerald-400/20 text-emerald-200 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-emerald-400/30">
                    Student
                  </span>
                )}
              </div>
              <p className="text-emerald-200 text-xs mt-0.5">{user.email}</p>
              <p className="text-emerald-300/80 text-xs mt-1">
                {user.department || "Information Technology"} • {user.semester || "Semester 7"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Academic Records */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                Cumulative GPA
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-bold text-stone-900">
                  {user.cgpa != null ? user.cgpa : "Pending Entry"}
                </span>
                {user.cgpa != null && <span className="text-xs text-stone-500">/ 10.0</span>}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {user.cgpa != null ? "Official verified record" : "Official grade record not yet entered"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                Semester Attendance
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-bold text-stone-900">
                  {user.attendancePercentage != null ? `${user.attendancePercentage}%` : "Not Recorded"}
                </span>
                {user.attendancePercentage != null && (
                  <span className="text-xs text-emerald-600 font-semibold">(Min 75%)</span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {user.attendancePercentage != null ? "University compliance verified" : "Subject register under compilation"}
              </p>
            </div>
          </div>

          {/* Student Credentials Sheet */}
          {!isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Academic Record
                </h4>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-emerald-800 font-semibold hover:underline"
                >
                  Edit Information
                </button>
              </div>

              <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 bg-white text-xs">
                <div className="flex items-center justify-between p-3">
                  <span className="text-stone-500">Roll / PRN Number</span>
                  <span className="font-semibold text-stone-900 font-mono">
                    {user.rollNumber || "Not Provided"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-stone-500">Academic Branch</span>
                  <span className="font-semibold text-stone-900">{user.department || "Information Technology"}</span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-stone-500">Current Semester</span>
                  <span className="font-semibold text-stone-900">{user.semester || "Semester 7"}</span>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-stone-500">Student Batch</span>
                  <span className="font-semibold text-stone-900">{user.batch || "A"}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Edit Student Details
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-xs text-stone-600 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 font-medium">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 font-medium">Roll / PRN Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 21IT042"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full mt-1 p-2 text-xs border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-800 text-white rounded-lg text-xs font-medium hover:bg-emerald-900 transition-colors"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* Assigned Faculty Mentor Section (if assigned) */}
          {user.mentor && (
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={16} className="text-emerald-800" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Assigned Faculty Mentor
                </h4>
              </div>
              <p className="text-sm font-bold text-stone-900">{user.mentor.name}</p>
              <p className="text-xs text-stone-500">{user.mentor.designation}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-200 text-xs">
                <div className="flex items-center gap-1.5 text-stone-600">
                  <MapPin size={13} className="text-stone-400 shrink-0" />
                  <span className="truncate">{user.mentor.cabin}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600">
                  <Clock size={13} className="text-stone-400 shrink-0" />
                  <span className="truncate">{user.mentor.hours}</span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <a
                  href={`mailto:${user.mentor.email}`}
                  className="flex-1 py-1.5 text-center bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-1"
                >
                  <Mail size={13} /> Email Mentor
                </a>
                <button
                  onClick={() => showToast?.(`Booked inquiry request with ${user.mentor.name}`, "success")}
                  className="flex-1 py-1.5 text-center bg-emerald-800 text-white rounded-lg text-xs font-medium hover:bg-emerald-900 flex items-center justify-center gap-1"
                >
                  <Calendar size={13} /> Book Slot
                </button>
              </div>
            </div>
          )}

          {/* Role Switcher */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-stone-800">Quick Persona Switch</p>
              <p className="text-stone-500 text-[11px]">
                Currently viewing as: <strong className="capitalize">{user.role}</strong>
              </p>
            </div>
            <button
              onClick={onSwitchRole}
              className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-medium transition-colors"
            >
              Switch to {user.role === "admin" ? "Student" : "Admin"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 transition-colors"
          >
            <LogOut size={15} /> Sign Out of Portal
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
