import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Trash2,
  Edit2,
  CameraOff,
  Filter,
  Search,
  RefreshCw,
  MapPin,
  Building,
  Image as ImageIcon,
  Check,
  Ban
} from "lucide-react";
import { lostFoundService } from "../lib/dataService";
import LostFoundDetailModal from "./LostFoundDetailModal";

export default function LostFoundAdminModeration({ showToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("all"); // 'pending' | 'approved' | 'claimed' | 'rejected' | 'all'
  const [searchQuery, setSearchQuery] = useState("");
  const [detailItem, setDetailItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await lostFoundService.getItems({ isAdmin: true });
      if (res?.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn("Failed to load admin lost & found items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await lostFoundService.approveItem(id);
      showToast?.("Report approved! Published to public student directory.", "success");
      loadData();
    } catch (err) {
      showToast?.(`Approval error: ${err.message}`, "error");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (e.g. Inappropriate photo, duplicate report, insufficient location details):");
    if (reason === null) return;
    try {
      await lostFoundService.rejectItem(id, reason);
      showToast?.("Report rejected and quarantined from public view.", "info");
      loadData();
    } catch (err) {
      showToast?.(`Rejection error: ${err.message}`, "error");
    }
  };

  const handleMarkClaimed = async (id) => {
    try {
      await lostFoundService.markClaimed(id);
      showToast?.("Item marked as claimed.", "success");
      loadData();
    } catch (err) {
      showToast?.(`Error: ${err.message}`, "error");
    }
  };

  const handleMarkResolved = async (id) => {
    try {
      await lostFoundService.markResolved(id);
      showToast?.("Item marked as resolved / handed to security.", "success");
      loadData();
    } catch (err) {
      showToast?.(`Error: ${err.message}`, "error");
    }
  };

  const handleDeleteImage = async (itemId, imageUrl) => {
    if (!window.confirm("Remove this photograph? (If inappropriate, student can re-upload a compliant photo)")) return;
    try {
      await lostFoundService.removeImageFromItem(itemId, imageUrl);
      showToast?.("Inappropriate photograph removed from report.", "info");
      loadData();
    } catch (err) {
      showToast?.(`Image removal failed: ${err.message}`, "error");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Permanently delete this Lost & Found report?")) return;
    try {
      await lostFoundService.deleteItem(id);
      showToast?.("Report permanently deleted.", "info");
      loadData();
    } catch (err) {
      showToast?.(`Delete failed: ${err.message}`, "error");
    }
  };

  // Counts
  const pendingCount = items.filter((i) => i.moderation_status === "Pending").length;
  const approvedCount = items.filter((i) => i.moderation_status === "Approved").length;
  const claimedCount = items.filter((i) => i.moderation_status === "Claimed" || i.moderation_status === "Resolved").length;
  const rejectedCount = items.filter((i) => i.moderation_status === "Rejected").length;

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "pending" && item.moderation_status === "Pending") ||
      (filterTab === "approved" && item.moderation_status === "Approved") ||
      (filterTab === "claimed" && (item.moderation_status === "Claimed" || item.moderation_status === "Resolved")) ||
      (filterTab === "rejected" && item.moderation_status === "Rejected");

    const matchesQuery =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              Campus Security & Moderation
            </span>
            <span className="text-xs text-stone-500 font-medium">Lost & Found Queue</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Lost & Found Moderation Desk
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Audit student item photographs, approve genuine campus reports, reject spam/inappropriate uploads, and record item handovers.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto transition-colors"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-emerald-700" : ""} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: `All Reports (${items.length})` },
            { key: "pending", label: `Pending (${pendingCount})`, badge: pendingCount > 0 },
            { key: "approved", label: `Approved & Live (${approvedCount})` },
            { key: "claimed", label: `Claimed (${claimedCount})` },
            { key: "rejected", label: `Rejected (${rejectedCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === tab.key
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-white text-stone-600 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, students, rooms..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* List / Cards */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center text-stone-400 space-y-2">
            <CheckCircle2 size={32} className="mx-auto text-emerald-700" />
            <p className="text-sm font-semibold text-stone-700">No reports found in this view</p>
            <p className="text-xs text-stone-400">All student reports have been processed.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const hasPhoto = Boolean(item.primary_image_url);
            const isPending = item.moderation_status === "Pending";
            const isRejected = item.moderation_status === "Rejected";

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isPending
                    ? "border-amber-300 ring-1 ring-amber-200"
                    : isRejected
                    ? "border-rose-200 bg-stone-50/50"
                    : "border-stone-200"
                }`}
              >
                {/* Photo & Item Basic Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Item Photo Thumbnail */}
                  <div
                    onClick={() => setDetailItem(item)}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200 cursor-pointer group"
                  >
                    {hasPhoto ? (
                      <>
                        <img
                          src={item.primary_image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {item.image_count > 1 && (
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                            +{item.image_count - 1}
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-2 text-center">
                        <CameraOff size={18} />
                        <span className="text-[9px] mt-1 font-semibold leading-tight">No photo</span>
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          item.type === "Lost"
                            ? "bg-rose-100 text-rose-900"
                            : "bg-emerald-100 text-emerald-900"
                        }`}
                      >
                        {item.type}
                      </span>

                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {item.category || "General"}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.moderation_status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.moderation_status === "Pending"
                            ? "bg-amber-100 text-amber-900"
                            : item.moderation_status === "Rejected"
                            ? "bg-rose-100 text-rose-900"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {item.moderation_status || "Approved"}
                      </span>

                      <span className="text-[11px] text-stone-400 font-mono">
                        {item.date || "Recent"}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-stone-900 truncate">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-600 flex items-center gap-1 truncate">
                      <MapPin size={12} className="text-stone-400 shrink-0" />
                      <span>{item.location || `${item.room_number || ""} • ${item.floor_number || ""} • ${item.department || ""}`}</span>
                    </p>

                    <p className="text-[11px] text-stone-500">
                      Reporter: <strong className="text-stone-700">{item.reporter_name || "Student"}</strong> ({item.contact})
                    </p>

                    {item.additional_note && (
                      <p className="text-[11px] text-stone-500 italic truncate max-w-lg">
                        &quot;{item.additional_note}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 w-full md:w-auto justify-end flex-wrap">
                  <button
                    onClick={() => setDetailItem(item)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="View Full Spec"
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">Inspect</span>
                  </button>

                  {isPending && (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Check size={13} />
                      <span>Approve</span>
                    </button>
                  )}

                  {!isRejected && (
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Reject from public view"
                    >
                      <Ban size={13} />
                      <span>Reject</span>
                    </button>
                  )}

                  {item.status === "Open" && (
                    <button
                      onClick={() => handleMarkClaimed(item.id)}
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Mark Claimed
                    </button>
                  )}

                  {hasPhoto && (
                    <button
                      onClick={() => handleDeleteImage(item.id, item.primary_image_url)}
                      className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-xl"
                      title="Remove inappropriate image"
                    >
                      <CameraOff size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete report permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Item Detail Modal */}
      {detailItem && (
        <LostFoundDetailModal
          item={detailItem}
          isOpen={Boolean(detailItem)}
          onClose={() => setDetailItem(null)}
          onClaim={() => {}}
        />
      )}
    </div>
  );
}
