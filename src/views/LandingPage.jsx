import React from "react";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Briefcase,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { initialUser, adminUser } from "../data/mockData";

export default function LandingPage({ onLogin, onGoToAuth }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center shadow-xs">
              <GraduationCap size={22} className="text-emerald-300" />
            </div>
            <div>
              <span className="font-serif font-bold text-stone-900 text-lg tracking-tight block">
                College Companion
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 -mt-1 block">
                Campus Student Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onGoToAuth(false)}
              className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onGoToAuth(true)}
              className="text-xs sm:text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <Sparkles size={13} className="text-emerald-700" />
            <span>Redesigned for Academic Year 2026</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
            The unified student portal for your <span className="text-emerald-900 underline decoration-emerald-500/40 underline-offset-8">campus life</span>.
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Say goodbye to messy WhatsApp notices and lost PDF circulars. Access your daily timetable, peer study notes, verified placement drives, campus events, and faculty advisor info in one clean, responsive workspace.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onGoToAuth(false)}
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Launch Student Portal</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onLogin(initialUser)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-100 text-emerald-950 border border-stone-300 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Instant Student Demo</span>
            </button>
          </div>

          {/* Reviewer Quick Access Pills */}
          <div className="mt-8 p-3 rounded-2xl bg-white border border-stone-200 shadow-xs inline-flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Quick Evaluator Access:</span>
            <button
              onClick={() => onLogin(initialUser)}
              className="px-3 py-1 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-semibold rounded-lg border border-emerald-200 transition-colors"
            >
              Demo Student Profile
            </button>
            <button
              onClick={() => onLogin(adminUser)}
              className="px-3 py-1 bg-stone-100 text-stone-800 hover:bg-stone-200 font-semibold rounded-lg border border-stone-200 transition-colors flex items-center gap-1"
            >
              <ShieldCheck size={13} className="text-amber-700" />
              Demo Faculty Admin
            </button>
          </div>
        </div>

        {/* Feature Grid Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Calendar size={20} />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">Live Timetable</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Period-wise schedule with current lecture tracking, room navigation hints (Room 303, IT Labs), and faculty details.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center mb-4">
              <BookOpen size={20} />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">Peer Course Notes</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Verified chapter summaries, previous year university question banks, and lab manuals organized by unit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-lime-50 text-lime-800 flex items-center justify-center mb-4">
              <Briefcase size={20} />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">Placement Drives</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Official registration forms for TCS, Infosys, Accenture, with deadline reminders and eligibility filters.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 College Companion • MHSSCE Final Year Engineering Project</p>
          <div className="flex items-center gap-4 text-stone-600">
            <span>Fast Navigation</span>
            <span>•</span>
            <span>Mobile-First</span>
            <span>•</span>
            <span>Zero Slop</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
