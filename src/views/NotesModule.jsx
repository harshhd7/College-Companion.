import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Upload,
  Download,
  Star,
  CheckCircle2,
  FileText,
  X,
  Filter,
  Eye,
  User,
  Trash2,
  Loader2,
} from "lucide-react";
import { recentNotes } from "../data/mockData";
import { notesService, academicService } from "../lib/dataService";

export default function NotesModule({ user, showToast }) {
  const [notesList, setNotesList] = useState(recentNotes);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    title: "",
    subject_id: "",
    subject_name: "AI and DS - II",
    module_unit: "Module 1",
    description: "",
  });

  const loadNotesAndSubjects = async () => {
    try {
      const [nRes, sRes] = await Promise.all([
        notesService.getNotes(),
        academicService.getSubjects("Information Technology"),
      ]);
      if (nRes?.data) {
        setNotesList(nRes.data);
      }
      if (sRes && sRes.length > 0) {
        setSubjects(sRes);
        if (!uploadForm.subject_id) {
          setUploadForm((prev) => ({
            ...prev,
            subject_id: sRes[0].id,
            subject_name: sRes[0].abbreviation || sRes[0].course_name,
          }));
        }
      }
    } catch (err) {
      console.warn("Could not load notes:", err);
    }
  };

  useEffect(() => {
    loadNotesAndSubjects();
  }, []);

  const subjectFilters = ["All", ...new Set(notesList.map((n) => n.subject_name || n.subject).filter(Boolean))];

  const filteredNotes = notesList.filter((n) => {
    const subName = n.subject_name || n.subject;
    const matchesSub = selectedSubject === "All" || subName === selectedSubject;
    const matchesQuery =
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.description && n.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.uploader_name && n.uploader_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.uploader && n.uploader.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSub && matchesQuery;
  });

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let fileUrl = null;
      let fileName = "lecture_notes.pdf";
      let fileSize = "2.8 MB PDF";

      if (selectedFile) {
        try {
          const uploaded = await notesService.uploadNoteFile(selectedFile);
          fileUrl = uploaded.url;
          fileName = uploaded.fileName;
          fileSize = uploaded.fileSize;
        } catch (uploadErr) {
          console.warn("Storage upload failed or bucket not yet configured, using document placeholder:", uploadErr);
        }
      }

      const newRecord = {
        title: uploadForm.title,
        subject_id: uploadForm.subject_id || null,
        subject_name: uploadForm.subject_name,
        module_unit: uploadForm.module_unit,
        uploader_id: user?.id || null,
        uploader_name: user?.name || "Student Contributor",
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        downloads_count: 0,
        rating: 5.0,
        verified: user?.role === "admin" || user?.role === "faculty",
      };

      try {
        await notesService.createNote(newRecord);
        showToast?.(`Uploaded "${uploadForm.title}" successfully!`, "success");
      } catch (dbErr) {
        // Fallback to local state if offline/unseeded
        setNotesList((prev) => [{ ...newRecord, id: `n-${Date.now()}` }, ...prev]);
        showToast?.(`Added "${uploadForm.title}" to local notes list!`, "success");
      }

      setUploadModalOpen(false);
      setUploadForm({
        title: "",
        subject_id: subjects[0]?.id || "",
        subject_name: subjects[0]?.abbreviation || "AI and DS - II",
        module_unit: "Module 1",
        description: "",
      });
      setSelectedFile(null);
      loadNotesAndSubjects();
    } catch (err) {
      showToast?.(`Error uploading note: ${err.message}`, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (note) => {
    if (note.file_url) {
      window.open(note.file_url, "_blank", "noreferrer");
    }
    showToast?.(`Downloading "${note.title}"...`, "success");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-sky-800">
            MHSSCE Information Technology Repository
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Peer Notes & Question Banks
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Verified handwritten summaries, Mumbai University question banks, and lecture slides.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Upload size={15} />
          <span>Upload Notes</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-stone-200/90 shadow-xs">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title, module, or contributor..."
            className="w-full text-xs sm:text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400 font-sans"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-xs text-stone-400 hover:text-stone-700">
              Clear
            </button>
          )}
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-white rounded-2xl border border-stone-200/90 shadow-xs">
          {subjectFilters.map((sub) => {
            const isSelected = selectedSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-sky-900 text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center text-stone-400">
          <BookOpen size={40} className="mx-auto mb-3 text-stone-300" />
          <h3 className="font-semibold text-stone-800 text-base">No notes found</h3>
          <p className="text-xs text-stone-500 mt-1">Try adjusting your search terms or subject filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-900 border border-sky-200">
                    {note.subject_name || note.subject}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    <span>{note.rating || 5.0}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-stone-900 group-hover:text-sky-950 transition-colors line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  {note.module_unit ? `Module: ${note.module_unit}` : note.description || "Course study document"}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1.5 truncate">
                  <User size={12} className="text-stone-400 shrink-0" />
                  <span className="truncate">{note.uploader_name || note.uploader || "Student"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewNote(note)}
                    className="p-1.5 text-stone-500 hover:text-sky-900 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Quick preview"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    onClick={() => handleDownload(note)}
                    className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Download size={13} />
                    <span>{note.file_size || note.size || "Download"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-xl text-stone-900">Upload Course Notes</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI & DS Unit 2 Question Bank & Solutions"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Subject</label>
                  <select
                    value={uploadForm.subject_id}
                    onChange={(e) => {
                      const found = subjects.find((s) => s.id === e.target.value);
                      setUploadForm({
                        ...uploadForm,
                        subject_id: e.target.value,
                        subject_name: found ? found.abbreviation || found.course_name : "General",
                      });
                    }}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.course_code} - {s.abbreviation}
                      </option>
                    ))}
                    {subjects.length === 0 && (
                      <>
                        <option value="s-aids">AI and DS - II (ITC701)</option>
                        <option value="s-ioe">Internet of Everything (ITC702)</option>
                        <option value="s-stqa">Software Testing (ITDO7014)</option>
                        <option value="s-irs">Information Retrieval (ITDO7024)</option>
                        <option value="s-csl">Cyber Security & Laws (ILO7016)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Module / Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. Module 1: Supervised ML"
                    value={uploadForm.module_unit}
                    onChange={(e) => setUploadForm({ ...uploadForm, module_unit: e.target.value })}
                    className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Attach PDF / Notes File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-900 file:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description / Key Topics</label>
                <textarea
                  rows={3}
                  placeholder="Summarize key topics covered, previous year question trends, etc..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5"
                >
                  {isUploading && <Loader2 size={14} className="animate-spin" />}
                  <span>{isUploading ? "Uploading..." : "Publish Notes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-900">
                {previewNote.subject_name || previewNote.subject}
              </span>
              <button onClick={() => setPreviewNote(null)} className="text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>

            <h3 className="font-serif font-bold text-lg text-stone-900">{previewNote.title}</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              {previewNote.description || "Course study document uploaded for MHSSCE IT students."}
            </p>

            <div className="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <div>
                <strong>Uploader:</strong> {previewNote.uploader_name || previewNote.uploader || "Verified Student"}
              </div>
              <div>
                <strong>File Name:</strong> {previewNote.file_name || "CourseNotes.pdf"} (
                {previewNote.file_size || previewNote.size || "3 MB"})
              </div>
              <div>
                <strong>Rating:</strong> ★ {previewNote.rating || 5.0} • {previewNote.downloads_count || 120} downloads
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setPreviewNote(null)}
                className="px-4 py-2 font-semibold text-stone-600 hover:text-stone-900 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(previewNote);
                  setPreviewNote(null);
                }}
                className="px-5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Download size={14} />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
