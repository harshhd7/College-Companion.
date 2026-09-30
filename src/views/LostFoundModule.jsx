import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  Building,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  X,
  Camera,
  CameraOff,
  Image as ImageIcon,
  Upload,
  Star,
  Trash2,
  Eye,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { lostFoundItems as initialMockItems } from "../data/mockData";
import { lostFoundService } from "../lib/dataService";
import { compressImage, uploadLostFoundImage, formatBytes } from "../lib/imageUtils";
import LostFoundCameraModal from "../components/LostFoundCameraModal";
import LostFoundDetailModal from "../components/LostFoundDetailModal";

export default function LostFoundModule({ user, showToast }) {
  const [items, setItems] = useState(initialMockItems);
  const [filterType, setFilterType] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Camera modal state
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  // Photos state inside Report Form: array of { id, file, dataUrl, originalSize, compressedSize }
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Hidden file input references
  const galleryInputRef = useRef(null);
  const nativeCameraInputRef = useRef(null);

  // Comprehensive Student Report Form State
  const [reportForm, setReportForm] = useState({
    title: "",
    type: "Lost",
    category: "Electronics",
    item_date: new Date().toISOString().split("T")[0],
    department: user?.department || "Information Technology",
    branch: "Information Technology",
    building: "Main Building",
    floor_number: "3rd Floor",
    room_number: "303",
    lab_name: "",
    location_description: "",
    contact: user?.email || "",
    contact_method: "Email / Phone",
    additional_note: "",
    adminNoPhotoOverride: false,
  });

  const loadItems = async () => {
    try {
      const res = await lostFoundService.getItems({
        userId: user?.id,
        isAdmin: user?.role === "admin",
      });
      if (res?.data && res.data.length > 0) {
        setItems(res.data);
      }
    } catch (err) {
      console.warn("Could not load lost & found items:", err);
    }
  };

  useEffect(() => {
    loadItems();
  }, [user]);

  // Handle image files selection from Gallery or Native Camera Input
  const handleFilesSelected = async (filesList) => {
    if (!filesList || filesList.length === 0) return;

    const files = Array.from(filesList);
    const remainingSlots = 5 - uploadedPhotos.length;

    if (remainingSlots <= 0) {
      showToast?.("Maximum 5 photographs permitted per report.", "info");
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    setCompressing(true);

    try {
      const compressedList = [];
      for (const file of filesToProcess) {
        if (!file.type.startsWith("image/")) continue;
        const result = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
        compressedList.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          file: result.file,
          dataUrl: result.dataUrl,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          savingsPercent: result.savingsPercent,
        });
      }

      setUploadedPhotos((prev) => [...prev, ...compressedList]);
      showToast?.(`Added and compressed ${compressedList.length} photograph(s).`, "success");
    } catch (err) {
      console.error("Compression error:", err);
      showToast?.("Could not process photograph. Please try another image.", "error");
    } finally {
      setCompressing(false);
    }
  };

  // Handle single photo captured from WebRTC Live Camera Modal
  const handleCameraPhotoCaptured = async (file, dataUrl) => {
    if (uploadedPhotos.length >= 5) {
      showToast?.("Maximum 5 photographs permitted per report.", "info");
      return;
    }

    setCompressing(true);
    try {
      const result = await compressImage(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
      setUploadedPhotos((prev) => [
        ...prev,
        {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          file: result.file,
          dataUrl: result.dataUrl || dataUrl,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          savingsPercent: result.savingsPercent,
        },
      ]);
      showToast?.("Item photo captured and optimized!", "success");
    } catch (err) {
      // Fallback with original capture
      setUploadedPhotos((prev) => [
        ...prev,
        {
          id: `photo-${Date.now()}`,
          file,
          dataUrl,
          originalSize: file.size,
          compressedSize: file.size,
          savingsPercent: 0,
        },
      ]);
    } finally {
      setCompressing(false);
    }
  };

  const handleRemovePhoto = (photoId) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleSetPrimaryPhoto = (index) => {
    if (index === 0) return;
    setUploadedPhotos((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
    showToast?.("Primary photograph updated!", "info");
  };

  // Filter items based on search and category
  const filteredItems = items.filter((item) => {
    const matchesType = filterType === "All" || item.type?.toLowerCase() === filterType.toLowerCase();
    const matchesCategory = categoryFilter === "All" || item.category?.toLowerCase() === categoryFilter.toLowerCase();

    const matchesQuery =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.room_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.floor_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lab_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesCategory && matchesQuery;
  });

  // Handle Form Submission with Supabase Storage upload
  const handleReportSubmit = async (e) => {
    e.preventDefault();

    // Section 11 Validation: Require at least 1 real photo unless admin override
    if (uploadedPhotos.length === 0 && !reportForm.adminNoPhotoOverride && user?.role !== "admin") {
      showToast?.("At least 1 item photograph is required to identify the item.", "error");
      return;
    }

    try {
      setUploadProgress("Uploading photographs to Supabase Storage (bucket: lost-found)...");
      const itemId = `lf-${Date.now()}`;
      const uploadedUrls = [];

      // Upload each compressed photo to Supabase Storage bucket 'lost-found'
      for (let i = 0; i < uploadedPhotos.length; i++) {
        setUploadProgress(`Uploading photo ${i + 1} of ${uploadedPhotos.length}...`);
        const p = uploadedPhotos[i];
        const res = await uploadLostFoundImage(p.file, user?.id || "student", itemId);
        uploadedUrls.push(res.publicUrl || p.dataUrl);
      }

      const primaryUrl = uploadedUrls.length > 0 ? uploadedUrls[0] : null;
      const additionalUrls = uploadedUrls.slice(1);

      // Composite location line
      const locationParts = [];
      if (reportForm.room_number) locationParts.push(`Room ${reportForm.room_number}`);
      if (reportForm.lab_name) locationParts.push(reportForm.lab_name);
      if (reportForm.floor_number) locationParts.push(reportForm.floor_number);
      if (reportForm.department) locationParts.push(reportForm.department);
      const compositeLocation = locationParts.join(" • ") || "Campus Premises";

      const newItemPayload = {
        title: reportForm.title,
        type: reportForm.type,
        category: reportForm.category,
        item_date: reportForm.item_date,
        department: reportForm.department,
        branch: reportForm.branch,
        building: reportForm.building,
        floor_number: reportForm.floor_number,
        room_number: reportForm.room_number,
        lab_name: reportForm.lab_name,
        location_description: reportForm.location_description,
        location: compositeLocation,
        contact: reportForm.contact || `${user?.name || "Student"} (${user?.email || "student@mhssce.ac.in"})`,
        contact_method: reportForm.contact_method,
        additional_note: reportForm.additional_note,
        primary_image_url: primaryUrl,
        additional_image_urls: additionalUrls,
        image_count: uploadedUrls.length,
        status: "Open",
        moderation_status: "Approved",
        reporter_id: user?.id || null,
        reporter_name: user?.name || "Student",
      };

      await lostFoundService.createItem(newItemPayload);

      showToast?.(`Reported "${newItemPayload.title}" with ${uploadedUrls.length} photograph(s)!`, "success");
      setReportModalOpen(false);
      setUploadedPhotos([]);
      setUploadProgress(null);

      // Reset form
      setReportForm({
        title: "",
        type: "Lost",
        category: "Electronics",
        item_date: new Date().toISOString().split("T")[0],
        department: user?.department || "Information Technology",
        branch: "Information Technology",
        building: "Main Building",
        floor_number: "3rd Floor",
        room_number: "303",
        lab_name: "",
        location_description: "",
        contact: user?.email || "",
        contact_method: "Email / Phone",
        additional_note: "",
        adminNoPhotoOverride: false,
      });

      loadItems();
    } catch (err) {
      console.error("Submission failed:", err);
      showToast?.(`Submission failed: ${err.message}`, "error");
      setUploadProgress(null);
    }
  };

  const handleClaim = (item) => {
    showToast?.(`Handover inquiry logged for "${item.title}". Contact: ${item.contact}`, "info");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              Campus Security & Helpdesk • MHSSCE
            </span>
            <span className="text-xs text-stone-500 font-medium">Real Photo Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Campus Lost & Found Desk
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Report misplaced identity cards, calculators, lab manuals, and valuables with real photographs to confirm ownership and expedite retrieval.
          </p>
        </div>

        <button
          onClick={() => setReportModalOpen(true)}
          className="px-5 py-3 bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Camera size={16} />
          <span>Report Item</span>
        </button>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, categories, rooms (e.g. 303), or labs..."
            className="w-full text-xs sm:text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400 font-sans"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-stone-200/90 shadow-xs shrink-0 overflow-x-auto">
          {["All", "Lost", "Found"].map((t) => {
            const isSelected = filterType.toLowerCase() === t.toLowerCase();
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-stone-900 text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Category Dropdown */}
        <div className="bg-white p-1 rounded-2xl border border-stone-200/90 shadow-xs shrink-0 flex items-center px-3">
          <Tag size={14} className="text-stone-400 mr-2 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold text-stone-700 bg-transparent outline-none py-1.5 pr-2"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="ID Card">ID Cards</option>
            <option value="Books & Notes">Books & Notes</option>
            <option value="Keys & Wallets">Keys & Wallets</option>
            <option value="Other">Other / Personal</option>
          </select>
        </div>
      </div>

      {/* 3. Items Grid (Compliant with Section 7 ASCII Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isLost = item.type === "Lost";
          const hasPhoto = Boolean(item.primary_image_url);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* 3.1 LARGE ITEM PHOTO */}
                <div
                  onClick={() => setSelectedItem(item)}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 border-b border-stone-100 cursor-pointer"
                >
                  {hasPhoto ? (
                    <>
                      <img
                        src={item.primary_image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.image_count > 1 && (
                        <span className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                          <Camera size={11} />
                          <span>{item.image_count} photos</span>
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 p-4 text-center text-stone-400">
                      <CameraOff size={28} className="text-stone-300 mb-1.5" />
                      <span className="text-xs font-semibold text-stone-600">No photo available</span>
                      <span className="text-[10px] text-stone-400 mt-0.5">Admin-approved listing</span>
                    </div>
                  )}
                </div>

                {/* 3.2 Card Content */}
                <div className="p-5 space-y-3">
                  {/* Status & Date Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${
                        isLost
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">
                      {item.date || "Today"}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-amber-950 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] uppercase font-bold text-stone-400 mt-0.5">
                      Category: {item.category || "Other"}
                    </p>
                  </div>

                  {/* Structured Location */}
                  <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                    <div className="flex items-center gap-2 text-stone-800 font-medium">
                      <MapPin size={13} className="text-emerald-700 shrink-0" />
                      <span className="truncate">
                        {item.room_number ? `Room ${item.room_number}` : item.lab_name || "Campus Wing"} • {item.floor_number || "3rd Floor"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-500">
                      <Building size={13} className="text-stone-400 shrink-0" />
                      <span className="truncate">
                        {item.department || "IT Department"} • {item.building || "Main Building"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3.3 Card Footer: Status & View Details */}
              <div className="px-5 pb-5 pt-1 flex items-center justify-between gap-3 border-t border-stone-100/60">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {item.status || "Open"}
                </span>

                <button
                  onClick={() => setSelectedItem(item)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. STUDENT REPORT MODAL (Enhanced with Real Photos & Mobile Camera) */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                  Report Lost or Found Item
                </h3>
                <p className="text-xs text-stone-500">
                  Upload clear photographs to verify ownership and classroom placement.
                </p>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              {/* Type Toggle: Lost / Found */}
              <div>
                <label className="font-bold text-stone-700 block mb-1.5">Item Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReportForm({ ...reportForm, type: "Lost" })}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all border ${
                      reportForm.type === "Lost"
                        ? "bg-rose-50 border-rose-300 text-rose-900 shadow-2xs ring-1 ring-rose-200"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    I Lost This Item
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportForm({ ...reportForm, type: "Found" })}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all border ${
                      reportForm.type === "Found"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs ring-1 ring-emerald-200"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    I Found This Item
                  </button>
                </div>
              </div>

              {/* Item Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Casio fx-991EX Calculator"
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category *</label>
                  <select
                    value={reportForm.category}
                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                    className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-600"
                  >
                    <option value="Electronics">Electronics (Calculator, Charger, Pods)</option>
                    <option value="ID Card">ID Card & Documents</option>
                    <option value="Books & Notes">Books, Journals & Notes</option>
                    <option value="Keys & Wallets">Keys & Wallets</option>
                    <option value="Bags & Bottles">Bags & Water Bottles</option>
                    <option value="Other">Other Belongings</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Date Misplaced / Found</label>
                <input
                  type="date"
                  value={reportForm.item_date}
                  onChange={(e) => setReportForm({ ...reportForm, item_date: e.target.value })}
                  className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>

              {/* LOCATION HIERARCHY */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
                <span className="font-bold text-stone-800 block text-xs uppercase tracking-wider">
                  Location Hierarchy (MHSSCE Campus):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Department</label>
                    <select
                      value={reportForm.department}
                      onChange={(e) => setReportForm({ ...reportForm, department: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Information Technology">Information Technology</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Campus Central">Campus Central / General</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Building</label>
                    <select
                      value={reportForm.building}
                      onChange={(e) => setReportForm({ ...reportForm, building: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Main Building">Main Building</option>
                      <option value="Annex Building">Annex Building</option>
                      <option value="Workshop Complex">Workshop Complex</option>
                      <option value="Auditorium Block">Auditorium Block</option>
                      <option value="Canteen / Grounds">Canteen / Campus Grounds</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Floor Number</label>
                    <select
                      value={reportForm.floor_number}
                      onChange={(e) => setReportForm({ ...reportForm, floor_number: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor (IT Wing)</option>
                      <option value="4th Floor">4th Floor</option>
                      <option value="5th Floor">5th Floor</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Room Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 303, 305, 306"
                      value={reportForm.room_number}
                      onChange={(e) => setReportForm({ ...reportForm, room_number: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Lab Name (If in Lab)</label>
                    <input
                      type="text"
                      placeholder="e.g. IS Lab, WE Lab, PL Lab"
                      value={reportForm.lab_name}
                      onChange={(e) => setReportForm({ ...reportForm, lab_name: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-600 block mb-1">Contact Method</label>
                    <select
                      value={reportForm.contact_method}
                      onChange={(e) => setReportForm({ ...reportForm, contact_method: e.target.value })}
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Email / Phone">Email / Phone</option>
                      <option value="In-Person / Staff Room">In-Person / Staff Room</option>
                      <option value="Security Gate Counter">Security Gate Counter</option>
                      <option value="HOD Office">HOD Office</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-stone-600 block mb-1">
                    Specific Location Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Left bench near window row 2, under table terminal 14..."
                    value={reportForm.location_description}
                    onChange={(e) => setReportForm({ ...reportForm, location_description: e.target.value })}
                    className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* 4. PHOTOS SECTION */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                      <Camera size={14} className="text-emerald-700" />
                      <span>Item Photographs (Up to 5) *</span>
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Take a real photo with camera or choose from gallery. 1st image is Primary.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-stone-500">
                    {uploadedPhotos.length} / 5
                  </span>
                </div>

                {/* Photo Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* Take Photo Button (Live Camera Modal) */}
                  <button
                    type="button"
                    onClick={() => setCameraModalOpen(true)}
                    disabled={uploadedPhotos.length >= 5 || compressing}
                    className="py-2.5 px-3 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors disabled:opacity-50"
                  >
                    <Camera size={14} />
                    <span>Take Photo</span>
                  </button>

                  {/* Choose from Gallery */}
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadedPhotos.length >= 5 || compressing}
                    className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <ImageIcon size={14} className="text-stone-600" />
                    <span>From Gallery</span>
                  </button>

                  {/* Upload File / Fallback */}
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    disabled={uploadedPhotos.length >= 5 || compressing}
                    className="py-2.5 px-3 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Upload size={14} className="text-stone-600" />
                    <span>Upload File</span>
                  </button>
                </div>

                {/* Hidden File Inputs */}
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = "";
                  }}
                />

                <input
                  ref={nativeCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = "";
                  }}
                />

                {/* Compressing Indicator */}
                {compressing && (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <RefreshCw size={13} className="animate-spin text-emerald-700" />
                    <span>Optimizing and compressing photograph for fast upload...</span>
                  </div>
                )}

                {/* Thumbnails Preview Grid */}
                {uploadedPhotos.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      Preview & Arrangement:
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {uploadedPhotos.map((photo, index) => {
                        const isPrimary = index === 0;

                        return (
                          <div
                            key={photo.id}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 bg-stone-900 group ${
                              isPrimary
                                ? "border-emerald-600 ring-2 ring-emerald-200"
                                : "border-stone-200"
                            }`}
                          >
                            <img
                              src={photo.dataUrl}
                              alt={`Item photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Primary Badge */}
                            {isPrimary && (
                              <div className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                                <Star size={9} fill="currentColor" />
                                <span>Primary</span>
                              </div>
                            )}

                            {/* Size Savings Badge */}
                            <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-xs text-stone-200 text-[8px] font-mono px-1 rounded">
                              {formatBytes(photo.compressedSize)}
                            </div>

                            {/* Action Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                              {!isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryPhoto(index)}
                                  className="p-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white"
                                  title="Make Primary Photo"
                                >
                                  <Star size={12} />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(photo.id)}
                                className="p-1 rounded bg-rose-700 hover:bg-rose-600 text-white"
                                title="Remove Photo"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Note & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Contact Email / Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. harshdesaihd007@gmail.com"
                    value={reportForm.contact}
                    onChange={(e) => setReportForm({ ...reportForm, contact: e.target.value })}
                    className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Identifying Features / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Scratched backside, sticker on cover, brand name..."
                    value={reportForm.additional_note}
                    onChange={(e) => setReportForm({ ...reportForm, additional_note: e.target.value })}
                    className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center gap-2 font-medium">
                  <RefreshCw size={14} className="animate-spin text-emerald-700" />
                  <span>{uploadProgress}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={compressing || Boolean(uploadProgress)}
                  className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 size={15} />
                  <span>Submit Verified Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. LIVE WEBRTC CAMERA MODAL */}
      <LostFoundCameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onPhotoCaptured={handleCameraPhotoCaptured}
        onFallbackToGallery={() => galleryInputRef.current?.click()}
      />

      {/* 6. ITEM DETAIL & LIGHTBOX MODAL */}
      <LostFoundDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onClaim={handleClaim}
        user={user}
      />
    </div>
  );
}
