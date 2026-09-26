import React, { useState } from "react";
import { Plus } from "lucide-react";
import CampusEventsFeed from "../components/CampusEventsFeed";
import { eventsService } from "../lib/dataService";

export default function EventsModule({ user, showToast }) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [newEventForm, setNewEventForm] = useState({
    title: "",
    category: "Workshop",
    event_date: "2026-08-20",
    start_time: "10:00",
    end_time: "13:00",
    venue: "Information Security (IS) Lab",
    description: "",
  });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventsService.createEvent({
        ...newEventForm,
        created_by: user?.id || null,
      });
      showToast?.(`Event "${newEventForm.title}" published!`, "success");
      setCreateModalOpen(false);
      setNewEventForm({
        title: "",
        category: "Workshop",
        event_date: "2026-08-20",
        start_time: "10:00",
        end_time: "13:00",
        venue: "Information Security (IS) Lab",
        description: "",
      });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      showToast?.(`Error creating event: ${err.message}`, "error");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Admin Action Bar */}
      {(user?.role === "admin" || user?.role === "event_admin") && (
        <div className="flex items-center justify-between bg-stone-900 text-white px-6 py-3.5 rounded-2xl">
          <div className="text-xs">
            <span className="font-bold text-amber-400">Staff Console:</span> You have administrative permissions to publish verified workshops, seminars, and hackathons.
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            <span>Publish New Event</span>
          </button>
        </div>
      )}

      {/* Main Campus Events Feed with Filterable List View */}
      <CampusEventsFeed key={refreshKey} user={user} showToast={showToast} />

      {/* CREATE EVENT MODAL (ADMIN) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
              Publish Campus Workshop / Seminar
            </h3>
            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Learning Transformer Workshop"
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newEventForm.category}
                    onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEventForm.event_date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, event_date: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Venue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Information Security (IS) Lab / Room 303"
                  value={newEventForm.venue}
                  onChange={(e) => setNewEventForm({ ...newEventForm, venue: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Session overview, prerequisites, target audience..."
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
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
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold shadow-xs"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
