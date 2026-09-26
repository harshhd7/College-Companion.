import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User, HelpCircle } from "lucide-react";

export default function Chatbot({ user, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "bot",
      text: `Hi ${user?.name ? user.name.split(" ")[0] : "there"}! I'm your MHSSCE IT College Companion assistant. How can I help you navigate Semester VII lectures, labs, or exam schedules today?`,
    },
  ]);

  const quickPrompts = [
    "Where is Room 303?",
    "Today's schedule",
    "Where is IS Lab?",
    "IAT-1 Exam Schedule",
    "Attendance eligibility rule",
  ];

  const faqs = {
    "303": "Room 303 is the primary BE Information Technology lecture hall located on the 3rd Floor of the IT Department Wing.",
    "305": "Room 305 is the IT Department Elective Lecture Hall located on the 3rd Floor.",
    "306": "Room 306 is the IT Department Elective Lecture Hall on the 3rd Floor, used for CSL (Cyber Security & Laws).",
    "is lab": "The Information Security (IS) Lab is situated on the 3rd Floor of the IT Department Wing.",
    "we lab": "The Web Engineering (WE) Lab is situated on the 3rd Floor of the IT Department Wing.",
    "pl lab": "The Programming Languages (PL) Lab is situated on the 3rd Floor of the IT Department Wing.",
    "schedule": "On Tuesdays, you have STQA at 9:00 AM (Room 303, Er. Fardeen Shaikh), AIDS-II at 11:00 AM (Room 303, Dr. Zainab Mirza), IRS at 12:00 PM (Room 303, Er. Sana Zahir A. Shaikh), and Practicals from 2:00 PM to 4:00 PM (DS Lab / ROSP Lab / IOE Lab across Batches A, B, C).",
    "today": "On Tuesdays, you have STQA at 9:00 AM (Room 303, Er. Fardeen Shaikh), AIDS-II at 11:00 AM (Room 303, Dr. Zainab Mirza), IRS at 12:00 PM (Room 303, Er. Sana Zahir A. Shaikh), and Practicals from 2:00 PM to 4:00 PM (DS Lab / ROSP Lab / IOE Lab across Batches A, B, C).",
    "exam": "Official BE IT Semester VII IAT-1 examinations commence on August 27, 2026: ITC701 (AI and DS - II) and ITC702 (Internet of Everything) in Room 303.",
    "iat": "BE IT Semester VII IAT-1 begins August 27, 2026: Day 1: AIDS-II & IOE. Day 2: STQA & IRS. Day 3: CSL / DMMM.",
    "tcs": "TCS System Engineer / Digital Cadre registration form closes on September 25, 2026. The package offered is ₹7.2 – ₹9.0 LPA.",
    "attendance": "The university mandates a minimum of 75% aggregate attendance per subject to be eligible to appear for semester end examinations without penalty.",
    "codegeist": "Codegeist Hackathon starts on Sep 05, 2026 at 9:00 AM in the Main Auditorium with a cash prize pool of ₹1,50,000.",
    "notes": "You can find verified unit notes for AI and DS - II (ITC701), Internet of Everything (ITC702), STQA (ITDO7014), IRS (ITDO7024), and CSL (ILO7016) in the 'Notes' tab.",
    "admission": "Admissions for the 2026 academic cycle are managed through the centralized portal. Visit the administration block counter 1 for inquiries.",
    "hello": "Hello! Ask me anything about BE IT Semester VII timetable, exam schedules, faculty, room locations, or notes!",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText) return;

    const userMsg = { id: Date.now().toString(), role: "user", text: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let reply =
        "I'm not completely certain about that specific query. You can ask me about class locations (e.g. 'Where is Room 303'), today's timetable, exam dates, or IT department labs!";

      for (const [key, val] of Object.entries(faqs)) {
        if (lower.includes(key)) {
          reply = val;
          break;
        }
      }

      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "bot", text: reply }]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
      {isOpen && (
        <div className="bg-white w-[calc(100vw-2rem)] sm:w-96 h-[480px] rounded-2xl shadow-2xl border border-stone-200 flex flex-col mb-3 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-emerald-200">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">Campus Assistant</h4>
                <p className="text-[11px] text-emerald-300">MHSSCE IT Semester VII Hub</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    <Bot size={13} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-emerald-800 text-white rounded-tr-xs shadow-xs"
                      : "bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs shadow-2xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic pl-8">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Checking records...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-stone-100/70 border-t border-stone-200/60 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="text-[11px] px-2.5 py-1 bg-white border border-stone-200 text-stone-700 hover:text-emerald-800 hover:border-emerald-300 rounded-full shrink-0 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-stone-200 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything (e.g. 'Room 303 location')..."
              className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-1 focus:ring-emerald-700 font-sans"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="px-3 py-2 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 disabled:opacity-40 transition-colors flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-900 hover:bg-emerald-800 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-emerald-700/50"
        aria-label="Toggle Assistant Chat"
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
}
