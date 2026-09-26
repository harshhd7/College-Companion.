import { supabase } from "./supabase";
import {
  timetable as mockTimetable,
  days,
  upcomingEvents as mockEvents,
  recentNotes as mockNotes,
  placementForms as mockPlacements,
  studyGroups as mockStudyGroups,
  lostFoundItems as mockLostFound,
  campusClubs as mockClubs,
  campusAnnouncements as mockAnnouncements,
  notificationsList as mockNotifications,
} from "../data/mockData";

// ==========================================
// 1. TIMETABLE SERVICE
// ==========================================
export const timetableService = {
  // Fetch weekly timetable with joined subject and faculty details
  async getWeeklySchedule({ batch = "ALL", department = "Information Technology", semester = "Semester 7" } = {}) {
    if (!supabase) return { data: null, error: null, fallback: true };
    try {
      let query = supabase
        .from("timetable")
        .select(`
          id,
          day_of_week,
          start_time,
          end_time,
          room,
          session_type,
          batch,
          practical_group,
          department,
          year,
          semester,
          effective_from,
          subjects:subject_id (
            id,
            course_code,
            abbreviation,
            course_name,
            subject_type
          ),
          faculty:faculty_id (
            id,
            name,
            faculty_code,
            designation
          )
        `)
        .order("start_time", { ascending: true });

      if (department) query = query.eq("department", department);
      if (semester) query = query.eq("semester", semester);

      const { data, error } = await query;
      if (error) throw error;

      // Group into days: { Monday: [...], Tuesday: [...], ... }
      const grouped = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
      };

      (data || []).forEach((row) => {
        // Filter batch: if student has a specific batch (A, B, C), include if session is 'ALL' or matches student's batch
        const isBatchMatch =
          !batch ||
          batch === "ALL" ||
          row.batch === "ALL" ||
          row.batch === batch;

        if (isBatchMatch && grouped[row.day_of_week]) {
          grouped[row.day_of_week].push(row);
        }
      });

      return { data: grouped, raw: data, error: null, fallback: false };
    } catch (err) {
      console.warn("timetableService.getWeeklySchedule failed, fallback mode:", err);
      return { data: null, error: err, fallback: true };
    }
  },

  // Admin create timetable entry
  async createEntry(entry) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("timetable").insert([entry]).select().single();
    if (error) throw error;
    return data;
  },

  // Admin update timetable entry
  async updateEntry(id, updates) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("timetable").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  // Admin delete timetable entry
  async deleteEntry(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("timetable").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==========================================
// 2. EXAM SCHEDULE SERVICE
// ==========================================
export const examService = {
  async getExams({ department = "Information Technology", year = "BE", semester = "Semester 7" } = {}) {
    if (!supabase) return { data: [], fallback: true };
    try {
      let query = supabase
        .from("exam_schedules")
        .select("*")
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      if (department) query = query.eq("department", department);
      if (year && year !== "ALL") query = query.eq("year", year);
      if (semester && semester !== "ALL") query = query.eq("semester", semester);

      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], fallback: false };
    } catch (err) {
      console.warn("examService.getExams failed:", err);
      return { data: [], fallback: true };
    }
  },

  async createExam(exam) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("exam_schedules").insert([exam]).select().single();
    if (error) throw error;
    return data;
  },

  async updateExam(id, updates) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("exam_schedules").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteExam(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("exam_schedules").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==========================================
// 3. SUBJECTS & FACULTY & DEPARTMENTS
// ==========================================
export const academicService = {
  async getDepartments() {
    if (!supabase) return [{ id: "it-dept", name: "Information Technology", code: "IT" }];
    const { data } = await supabase.from("departments").select("*").order("name");
    return data || [];
  },

  async getSubjects(department = "Information Technology") {
    if (!supabase) return [];
    let q = supabase.from("subjects").select("*").order("course_code");
    if (department) q = q.eq("department", department);
    const { data } = await q;
    return data || [];
  },

  async getFaculty(department = "Information Technology") {
    if (!supabase) return [];
    let q = supabase.from("faculty").select("*").order("name");
    if (department) q = q.eq("department", department);
    const { data } = await q;
    return data || [];
  },

  async createSubject(subject) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("subjects").insert([subject]).select().single();
    if (error) throw error;
    return data;
  },

  async createFaculty(fac) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("faculty").insert([fac]).select().single();
    if (error) throw error;
    return data;
  },
};

// ==========================================
// 4. NOTES SERVICE & STORAGE
// ==========================================
export const notesService = {
  async getNotes({ subjectId = null, searchQuery = "" } = {}) {
    if (!supabase) return { data: mockNotes, fallback: true };
    try {
      let query = supabase
        .from("notes")
        .select(`
          id,
          title,
          subject_id,
          subject_name,
          module_unit,
          uploader_id,
          uploader_name,
          file_url,
          file_name,
          file_size,
          downloads_count,
          rating,
          verified,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (subjectId && subjectId !== "All") {
        query = query.eq("subject_id", subjectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        return { data: mockNotes, fallback: true };
      }
      return { data, fallback: false };
    } catch (err) {
      console.warn("notesService.getNotes error:", err);
      return { data: mockNotes, fallback: true };
    }
  },

  async uploadNoteFile(file) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `notes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("notes")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("notes").getPublicUrl(filePath);
    return { url: data.publicUrl, fileName: file.name, fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB` };
  },

  async createNote(note) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("notes").insert([note]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteNote(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  async verifyNote(id, verified = true) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("notes").update({ verified }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
};

// ==========================================
// 5. EVENTS SERVICE
// ==========================================
export const eventsService = {
  async getEvents() {
    if (!supabase) return { data: mockEvents, fallback: true };
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return { data: mockEvents, fallback: true };
      return { data, fallback: false };
    } catch (err) {
      console.warn("eventsService.getEvents error:", err);
      return { data: mockEvents, fallback: true };
    }
  },

  async createEvent(event) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("events").insert([event]).select().single();
    if (error) throw error;
    return data;
  },

  async updateEvent(id, updates) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("events").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteEvent(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==========================================
// 6. CLUBS SERVICE
// ==========================================
export const clubsService = {
  async getClubs() {
    if (!supabase) return { data: mockClubs, fallback: true };
    try {
      const { data, error } = await supabase.from("clubs").select("*").order("name");
      if (error) throw error;
      if (!data || data.length === 0) return { data: mockClubs, fallback: true };
      return { data, fallback: false };
    } catch (err) {
      console.warn("clubsService.getClubs error:", err);
      return { data: mockClubs, fallback: true };
    }
  },

  async joinClub(clubId, userId) {
    if (!supabase) return true;
    const { data, error } = await supabase
      .from("club_members")
      .insert([{ club_id: clubId, user_id: userId, role: "member" }]);
    if (error && error.code !== "23505") throw error; // ignore duplicate
    return true;
  },

  async leaveClub(clubId, userId) {
    if (!supabase) return true;
    const { error } = await supabase
      .from("club_members")
      .delete()
      .eq("club_id", clubId)
      .eq("user_id", userId);
    if (error) throw error;
    return true;
  },

  async createClub(club) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("clubs").insert([club]).select().single();
    if (error) throw error;
    return data;
  },

  async updateClub(id, updates) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("clubs").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteClub(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("clubs").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==========================================
// 7. OPPORTUNITIES SERVICE
// ==========================================
export const opportunitiesService = {
  async getOpportunities() {
    if (!supabase) return { data: mockPlacements, fallback: true };
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("deadline", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return { data: mockPlacements, fallback: true };
      return { data, fallback: false };
    } catch (err) {
      console.warn("opportunitiesService.getOpportunities error:", err);
      return { data: mockPlacements, fallback: true };
    }
  },

  async createOpportunity(opp) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("opportunities").insert([opp]).select().single();
    if (error) throw error;
    return data;
  },

  async updateOpportunity(id, updates) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("opportunities").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteOpportunity(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==========================================
// 8. LOST & FOUND SERVICE
// ==========================================
export const lostFoundService = {
  async getItems() {
    if (!supabase) return { data: mockLostFound, fallback: true };
    try {
      const { data, error } = await supabase
        .from("lost_and_found")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return { data: mockLostFound, fallback: true };
      return { data, fallback: false };
    } catch (err) {
      console.warn("lostFoundService.getItems error:", err);
      return { data: mockLostFound, fallback: true };
    }
  },

  async createItem(item) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("lost_and_found").insert([item]).select().single();
    if (error) throw error;
    return data;
  },

  async updateItemStatus(id, status) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("lost_and_found").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteItem(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("lost_and_found").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==========================================
// 9. STUDY GROUPS SERVICE
// ==========================================
export const studyGroupsService = {
  async getGroups() {
    if (!supabase) return { data: mockStudyGroups, fallback: true };
    try {
      const { data, error } = await supabase
        .from("study_groups")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return { data: mockStudyGroups, fallback: true };
      return { data, fallback: false };
    } catch (err) {
      console.warn("studyGroupsService.getGroups error:", err);
      return { data: mockStudyGroups, fallback: true };
    }
  },

  async createGroup(grp) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("study_groups").insert([grp]).select().single();
    if (error) throw error;
    return data;
  },

  async joinGroup(groupId, userId) {
    if (!supabase) return true;
    const { error } = await supabase.from("study_group_members").insert([{ group_id: groupId, user_id: userId }]);
    if (error && error.code !== "23505") throw error;
    return true;
  },

  async leaveGroup(groupId, userId) {
    if (!supabase) return true;
    const { error } = await supabase.from("study_group_members").delete().eq("group_id", groupId).eq("user_id", userId);
    if (error) throw error;
    return true;
  },

  async deleteGroup(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("study_groups").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==========================================
// 10. ANNOUNCEMENTS & FAQS & NOTIFICATIONS
// ==========================================
export const communicationService = {
  async getAnnouncements() {
    if (!supabase) return { data: mockAnnouncements, fallback: true };
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return { data: mockAnnouncements, fallback: true };
      return { data, fallback: false };
    } catch (err) {
      console.warn("communicationService.getAnnouncements error:", err);
      return { data: mockAnnouncements, fallback: true };
    }
  },

  async createAnnouncement(ann) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("announcements").insert([ann]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteAnnouncement(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  async getFaqs() {
    if (!supabase) return { data: [], fallback: true };
    try {
      const { data, error } = await supabase.from("faqs").select("*").order("category");
      if (error) throw error;
      return { data: data || [], fallback: false };
    } catch (err) {
      return { data: [], fallback: true };
    }
  },

  async createFaq(faq) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from("faqs").insert([faq]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteFaq(id) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  async getNotifications(userId) {
    if (!supabase || !userId) return { data: mockNotifications, fallback: true };
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return { data: mockNotifications, fallback: true };
      return { data, fallback: false };
    } catch (err) {
      return { data: mockNotifications, fallback: true };
    }
  },

  async markNotificationRead(id) {
    if (!supabase) return true;
    const { error } = await supabase.from("notifications").update({ unread: false }).eq("id", id);
    if (error) throw error;
    return true;
  },
};

// ==========================================
// 11. MENTORSHIP SERVICE
// ==========================================
export const mentorService = {
  async getMentors() {
    if (!supabase) return { data: [], fallback: true };
    try {
      const { data, error } = await supabase
        .from("mentors")
        .select(`
          id,
          max_mentees,
          cabin,
          office_hours,
          faculty:faculty_id (
            id,
            name,
            faculty_code,
            designation,
            department
          )
        `);
      if (error) throw error;
      return { data: data || [], fallback: false };
    } catch (err) {
      return { data: [], fallback: true };
    }
  },

  async getSlots(mentorId) {
    if (!supabase) return [];
    const { data } = await supabase
      .from("mentor_slots")
      .select("*")
      .eq("mentor_id", mentorId)
      .eq("is_available", true)
      .gte("slot_date", new Date().toISOString().split("T")[0])
      .order("slot_date", { ascending: true });
    return data || [];
  },

  async bookSlot(slotId, studentId, purpose) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase
      .from("mentor_bookings")
      .insert([{ slot_id: slotId, student_id: studentId, purpose, status: "Pending" }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ==========================================
// 12. ADMIN METRICS & PROFILES SERVICE
// ==========================================
export const adminService = {
  async getLiveStats() {
    if (!supabase) {
      return {
        totalStudents: 140,
        totalNotes: 24,
        totalEvents: 4,
        totalClubs: 4,
        totalOpportunities: 6,
        totalTimetableEntries: 22,
        totalExams: 16,
        isLive: false,
      };
    }

    try {
      const [
        studentsRes,
        notesRes,
        eventsRes,
        clubsRes,
        oppsRes,
        timetableRes,
        examsRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("notes").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("clubs").select("id", { count: "exact", head: true }),
        supabase.from("opportunities").select("id", { count: "exact", head: true }),
        supabase.from("timetable").select("id", { count: "exact", head: true }),
        supabase.from("exam_schedules").select("id", { count: "exact", head: true }),
      ]);

      return {
        totalStudents: studentsRes.count ?? 0,
        totalNotes: notesRes.count ?? 0,
        totalEvents: eventsRes.count ?? 0,
        totalClubs: clubsRes.count ?? 0,
        totalOpportunities: oppsRes.count ?? 0,
        totalTimetableEntries: timetableRes.count ?? 0,
        totalExams: examsRes.count ?? 0,
        isLive: true,
      };
    } catch (err) {
      console.warn("adminService.getLiveStats error:", err);
      return {
        totalStudents: 0,
        totalNotes: 0,
        totalEvents: 0,
        totalClubs: 0,
        totalOpportunities: 0,
        totalTimetableEntries: 0,
        totalExams: 0,
        isLive: false,
      };
    }
  },

  async getAllProfiles() {
    if (!supabase) return [];
    const { data } = await supabase.from("profiles").select("*").order("full_name");
    return data || [];
  },

  async updateProfileRole(profileId, newRole) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", profileId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
