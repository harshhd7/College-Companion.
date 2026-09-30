import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CameraOff,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Tag
} from "lucide-react";

export default function LostFoundDetailModal({ item, isOpen, onClose, onClaim, user }) {
  if (!isOpen || !item) return null;

  // Build full gallery: primary + additionals
  const allImages = [
    ...(item.primary_image_url ? [item.primary_image_url] : []),
    ...(item.additional_image_urls || []),
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isLost = item.type === "Lost";
  const hasPhotos = allImages.length > 0;
  const currentPhotoUrl = hasPhotos ? allImages[activeImageIndex] : null;

  const handleNextPhoto = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevPhoto = () => {
    setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  isLost
                    ? "bg-rose-100 text-rose-900 border border-rose-300"
                    : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                }`}
              >
                {item.type}
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {item.date || "Recent"}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-200/70 text-stone-700">
                {item.status || "Open"}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {/* 1. Large Photo Showcase & Thumbnails */}
            <div className="space-y-2.5">
              {hasPhotos ? (
                <div className="relative rounded-2xl overflow-hidden bg-stone-950 aspect-[16/10] flex items-center justify-center group">
                  <img
                    src={currentPhotoUrl}
                    alt={item.title}
                    className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
                    onClick={() => setLightboxOpen(true)}
                  />

                  {/* Enlarge Button Overlay */}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                    title="Enlarge Photo"
                  >
                    <Maximize2 size={16} />
                  </button>

                  {/* Navigation Arrows if Multiple Images */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={handleNextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>

                      {/* Photo Index Indicator */}
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold text-white">
                        {activeImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 aspect-[16/8] flex flex-col items-center justify-center p-6 text-center text-stone-400">
                  <CameraOff size={32} className="mb-2 text-stone-400" />
                  <p className="text-xs font-semibold text-stone-600">No photograph available</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    This report was submitted without an attached image.
                  </p>
                </div>
              )}

              {/* Additional Thumbnails Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-emerald-600 ring-2 ring-emerald-200"
                          : "border-stone-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-[8px] font-bold text-emerald-200 text-center uppercase py-0.2">
                          Main
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Item Title & Category */}
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <Tag size={13} className="text-stone-400" />
                <span className="uppercase font-bold tracking-wider text-[10px]">
                  Category: {item.category || "General"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
                {item.title}
              </h2>
            </div>

            {/* 3. Detailed Location Hierarchy */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                Detailed Location Information:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">Department</span>
                  <strong className="text-stone-800 font-semibold">{item.department || "Information Technology"}</strong>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px]">Branch</span>
                  <strong className="text-stone-800 font-semibold">{item.branch || "Information Technology"}</strong>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px]">Building</span>
                  <strong className="text-stone-800 font-semibold">{item.building || "Main Building"}</strong>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px]">Floor Number</span>
                  <strong className="text-stone-800 font-semibold">{item.floor_number || "3rd Floor"}</strong>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px]">Room Number</span>
                  <strong className="text-stone-800 font-semibold">{item.room_number || "Room 303"}</strong>
                </div>

                <div>
                  <span className="text-stone-400 block text-[10px]">Lab / Hall</span>
                  <strong className="text-stone-800 font-semibold">{item.lab_name || "—"}</strong>
                </div>
              </div>

              {item.location_description && (
                <div className="pt-2 border-t border-stone-200/60 text-xs text-stone-700">
                  <span className="font-semibold text-stone-900">Specific Spot: </span>
                  {item.location_description}
                </div>
              )}
            </div>

            {/* 4. Description / Note */}
            {item.additional_note && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                  Description / Identifying Note:
                </span>
                <p className="text-xs text-stone-700 bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60 leading-relaxed">
                  {item.additional_note}
                </p>
              </div>
            )}

            {/* 5. Contact Information */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                Verification & Handover Contact:
              </span>
              <div className="flex items-center gap-2 font-medium">
                <Mail size={13} className="text-emerald-700" />
                <span>{item.contact || "Campus Security / IT Staff Room"}</span>
              </div>
              {item.contact_method && (
                <p className="text-[11px] text-emerald-800">
                  Preferred Method: {item.contact_method}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClaim(item);
                onClose();
              }}
              className="py-2.5 px-5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>{isLost ? "I Have Found This" : "Claim This Item"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox View */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="w-full flex items-center justify-between p-4 text-white max-w-5xl">
            <span className="text-xs font-mono">
              Photo {activeImageIndex + 1} of {allImages.length} • {item.title}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhotoUrl}
              alt={item.title}
              className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-4 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-4 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
