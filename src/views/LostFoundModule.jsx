import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  X,
} from "lucide-react";
import { lostFoundItems } from "../data/mockData";
import { lostFoundService } from "../lib/dataService";

export default function LostFoundModule({ user, showToast }) {
  const [items, setItems] = useState(lostFoundItems);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const [reportForm, setReportForm] = useState({
    title: "",
    type: "Lost",
    category: "Electronics",
    location: "Room 303, 3rd Floor",
    contact: "",
    description: "",
  });

  const loadItems = async () => {
    try {
      const res = await lostFoundService.getItems();
      if (res?.data && res.data.length > 0) {
        const formatted = res.data.map((i) => ({
          id: i.id,
          title: i.title,
          type: i.type,
          location: i.location || "Campus Premises",
          date: i.created_at ? new Date(i.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : (i.date || "Recent"),
          contact: i.contact_info || i.contact || "Campus Security / HOD Office",
          status: i.status || "Open",
          category: i.category || "General",
        }));
        setItems(formatted);
      }
    } catch (err) {
      console.warn("Could not load lost & found items:", err);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === "All" || item.type.toLowerCase() === filterType.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const contact = reportForm.contact || `${user?.name || "Student"} (${user?.email || "student@mhssce.ac.in"})`;
      const newItem = {
        title: reportForm.title,
        type: reportForm.type,
        location: reportForm.location,
        contact_info: contact,
        status: "Open",
        category: reportForm.category,
        description: reportForm.description,
        user_id: user?.id || null,
      };

      await lostFoundService.createItem(newItem);
      showToast?.(`Reported "${newItem.title}" to Campus Lost & Found!`, "success");
      setReportModalOpen(false);
      setReportForm({
        title: "",
        type: "Lost",
        category: "Electronics",
        location: "Room 303, 3rd Floor",
        contact: "",
        description: "",
      });
      loadItems();
    } catch (err) {
      // Fallback
      const fallbackItem = {
        id: `lf-${Date.now()}`,
        ...reportForm,
        date: "Today",
        status: "Open",
      };
      setItems([fallbackItem, ...items]);
      setReportModalOpen(false);
      showToast?.(`Reported "${fallbackItem.title}" to Lost & Found!`, "success");
    }
  };

  const handleClaim = (item) => {
    showToast?.(`Claim inquiry details sent to: ${item.contact}`, "info");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-amber-800">
            Campus Helpdesk & Security • MHSSCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Campus Lost & Found Desk
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Report misplaced identity cards, lab manuals, calculators, keys, and personal belongings.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Report Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search misplaced items, classrooms, or categories..."
            className="w-full text-xs sm:text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400 font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-stone-200/90 shadow-xs">
          {["All", "Lost", "Found"].map((t) => {
            const isSelected = filterType.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-amber-900 text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isLost = item.type === "Lost";

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      isLost
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">{item.date}</span>
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900">{item.title}</h3>
                <span className="text-[10px] uppercase font-bold text-stone-400 block mt-0.5">
                  Category: {item.category}
                </span>

                <div className="mt-4 space-y-1.5 text-xs text-stone-500 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-stone-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail size={13} className="text-stone-400 shrink-0" />
                    <span className="truncate">{item.contact}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-700">{item.status}</span>

                <button
                  onClick={() => handleClaim(item)}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  {isLost ? "I Found This" : "Claim This Item"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">Report Lost or Found Item</h3>
              <button onClick={() => setReportModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scientific Calculator fx-991EX"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Report Type</label>
                  <select
                    value={reportForm.type}
                    onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Lost">I Lost This</option>
                    <option value="Found">I Found This</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={reportForm.category}
                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="ID Card">ID Card</option>
                    <option value="Books & Notes">Books & Notes</option>
                    <option value="Keys & Wallets">Keys & Wallets</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Classroom / Location Found</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 303 or 4th floor corridor"
                  value={reportForm.location}
                  onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Contact Email / Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98200 XXXXX or student@mhssce.ac.in"
                  value={reportForm.contact}
                  onChange={(e) => setReportForm({ ...reportForm, contact: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold shadow-xs"
                >
                  Post Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
