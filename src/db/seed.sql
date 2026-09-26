-- ==============================================================================
-- COLLEGE COMPANION — SUPABASE INITIAL SEED DATA
-- Institution: M.H. Saboo Siddik College of Engineering (MHSSCE)
-- Department:  Information Technology (BE / Final Year, Semester VII)
-- Timetable:   SH 2026 Version 2 (Effective: 06-07-2026)
-- Classrooms:  303, 305, 306
-- ==============================================================================

-- 1. DEPARTMENTS
insert into public.departments (name, code) values
('Information Technology', 'IT')
on conflict (code) do nothing;

-- 2. FACULTY (Official IT Department Faculty)
insert into public.faculty (name, faculty_code, department, designation) values
('Dr. Zainab Mirza', 'ZM', 'Information Technology', 'Associate Professor'),
('Prof. Shrinidhi Gindi', 'SG', 'Information Technology', 'Assistant Professor'),
('Er. Sana Zahir A. Shaikh', 'SZS', 'Information Technology', 'Assistant Professor'),
('Er. Rasheed Noor', 'RN', 'Information Technology', 'Assistant Professor'),
('Er. Fardeen Shaikh', 'FS', 'Information Technology', 'Assistant Professor'),
('Dr. Uma Kale', 'UK', 'Information Technology', 'Professor'),
('Er. Ahlam Ansari', 'AA', 'Information Technology', 'Associate Professor & HOD')
on conflict (faculty_code) do update set
  name = excluded.name,
  designation = excluded.designation;

-- 3. SUBJECTS (Official Semester VII Curriculum)
insert into public.subjects (course_code, abbreviation, course_name, department, year, semester, subject_type) values
('ITC701', 'AIDS-II', 'AI and DS - II', 'Information Technology', 'BE', 'Semester 7', 'Theory'),
('ITC702', 'IOE', 'Internet of Everything', 'Information Technology', 'BE', 'Semester 7', 'Theory'),
('ITDO7014', 'STQA', 'Software Testing & Quality Assurance (DLOC 3)', 'Information Technology', 'BE', 'Semester 7', 'Elective'),
('ITDO7024', 'IRS', 'Information Retrieval System (DLOC 4)', 'Information Technology', 'BE', 'Semester 7', 'Elective'),
('ILO7016', 'CSL', 'Cyber Security & Laws', 'Information Technology', 'BE', 'Semester 7', 'Institute Elective'),
('ILO7017', 'DMMM', 'Disaster Management and Mitigation Measures', 'Information Technology', 'BE', 'Semester 7', 'Institute Elective'),
('ITL701', 'DS', 'Data Science Lab', 'Information Technology', 'BE', 'Semester 7', 'Practical'),
('ITL702', 'IOE', 'IOE Lab', 'Information Technology', 'BE', 'Semester 7', 'Practical'),
('ITL703', 'SAD', 'Secure Application Development', 'Information Technology', 'BE', 'Semester 7', 'Practical'),
('ITL704', 'ROSP', 'Recent Open Source Project Lab', 'Information Technology', 'BE', 'Semester 7', 'Practical'),
('ITP701', 'PROJECT I', 'Major Project I', 'Information Technology', 'BE', 'Semester 7', 'Project')
on conflict (course_code) do update set
  abbreviation = excluded.abbreviation,
  course_name = excluded.course_name;

-- 4. OFFICIAL TIMETABLE (SH 2026 Version 2, Effective: 06-07-2026)
-- Clean existing timetable before seeding
truncate table public.timetable restart identity cascade;

-- --- MONDAY ---
insert into public.timetable (day_of_week, start_time, end_time, subject_id, room, session_type, batch, effective_from)
select 'Monday', '10:00'::time, '11:00'::time, id, 'Project Lab', 'Project', 'ALL', '2026-07-06'
from public.subjects where course_code = 'ITP701';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, room, session_type, batch, effective_from)
select 'Monday', '11:00'::time, '12:00'::time, id, 'Project Lab', 'Project', 'ALL', '2026-07-06'
from public.subjects where course_code = 'ITP701';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, room, session_type, batch, effective_from)
select 'Monday', '12:00'::time, '13:00'::time, id, 'Project Lab', 'Project', 'ALL', '2026-07-06'
from public.subjects where course_code = 'ITP701';

insert into public.timetable (day_of_week, start_time, end_time, room, session_type, batch, effective_from)
values ('Monday', '13:00'::time, '14:00'::time, 'Canteen / Campus', 'Break', 'ALL', '2026-07-06');

insert into public.timetable (day_of_week, start_time, end_time, subject_id, room, session_type, batch, effective_from)
select 'Monday', '14:00'::time, '16:00'::time, id, 'Project Lab', 'Project', 'ALL', '2026-07-06'
from public.subjects where course_code = 'ITP701';

-- --- TUESDAY ---
insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Tuesday', '09:00'::time, '11:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITDO7014' and f.faculty_code = 'FS';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Tuesday', '11:00'::time, '12:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITC701' and f.faculty_code = 'ZM';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Tuesday', '12:00'::time, '13:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITDO7024' and f.faculty_code = 'SZS';

insert into public.timetable (day_of_week, start_time, end_time, room, session_type, batch, effective_from)
values ('Tuesday', '13:00'::time, '14:00'::time, 'Canteen / Campus', 'Break', 'ALL', '2026-07-06');

-- Tuesday Practicals (14:00–16:00)
insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Tuesday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 1', 'Practical', 'A', 'IS', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL701' and f.faculty_code = 'ZM';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Tuesday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 2', 'Practical', 'B', 'WE', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL704' and f.faculty_code = 'FS';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Tuesday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 3', 'Practical', 'C', 'PL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL702' and f.faculty_code = 'SG';

-- --- WEDNESDAY ---
insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Wednesday', '09:00'::time, '11:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ILO7017' and f.faculty_code = 'UK';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, room, session_type, batch, effective_from)
select 'Wednesday', '09:00'::time, '11:00'::time, s.id, '306', 'Lecture', 'A', '2026-07-06'
from public.subjects s
where s.course_code = 'ILO7016';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Wednesday', '11:00'::time, '12:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITC701' and f.faculty_code = 'ZM';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Wednesday', '12:00'::time, '13:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITC702' and f.faculty_code = 'SG';

insert into public.timetable (day_of_week, start_time, end_time, room, session_type, batch, effective_from)
values ('Wednesday', '13:00'::time, '14:00'::time, 'Canteen / Campus', 'Break', 'ALL', '2026-07-06');

-- Wednesday Practicals (14:00–16:00)
insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Wednesday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 1', 'Practical', 'A', 'PL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL702' and f.faculty_code = 'SG';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Wednesday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 2', 'Practical', 'B', 'SE', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL703' and f.faculty_code = 'RN';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Wednesday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 3', 'Practical', 'C', 'WE', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL704' and f.faculty_code = 'FS';

-- --- THURSDAY ---
insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Thursday', '09:00'::time, '10:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ILO7017' and f.faculty_code = 'UK';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, room, session_type, batch, effective_from)
select 'Thursday', '09:00'::time, '10:00'::time, s.id, '305', 'Lecture', 'A', '2026-07-06'
from public.subjects s
where s.course_code = 'ILO7016';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Thursday', '10:00'::time, '12:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITC702' and f.faculty_code = 'SG';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Thursday', '12:00'::time, '13:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITDO7024' and f.faculty_code = 'SZS';

insert into public.timetable (day_of_week, start_time, end_time, room, session_type, batch, effective_from)
values ('Thursday', '13:00'::time, '14:00'::time, 'Canteen / Campus', 'Break', 'ALL', '2026-07-06');

-- Thursday Practicals (14:00–16:00)
insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Thursday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 1', 'Practical', 'B', 'IS', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL701' and f.faculty_code = 'ZM';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Thursday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 2', 'Practical', 'C', 'SE', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL703' and f.faculty_code = 'RN';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Thursday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 3', 'Practical', 'A', 'WE', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL704' and f.faculty_code = 'FS';

-- --- FRIDAY ---
insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Friday', '10:00'::time, '11:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITDO7014' and f.faculty_code = 'FS';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Friday', '11:00'::time, '12:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITC701' and f.faculty_code = 'ZM';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, effective_from)
select 'Friday', '12:00'::time, '13:00'::time, s.id, f.id, '303', 'Lecture', 'ALL', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITDO7024' and f.faculty_code = 'SZS';

insert into public.timetable (day_of_week, start_time, end_time, room, session_type, batch, effective_from)
values ('Friday', '13:00'::time, '14:00'::time, 'Canteen / Campus', 'Break', 'ALL', '2026-07-06');

-- Friday Practicals (14:00–16:00)
insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Friday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 1', 'Practical', 'B', 'DB', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL702' and f.faculty_code = 'SG';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Friday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 2', 'Practical', 'C', 'IS', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL701' and f.faculty_code = 'ZM';

insert into public.timetable (day_of_week, start_time, end_time, subject_id, faculty_id, room, session_type, batch, practical_group, effective_from)
select 'Friday', '14:00'::time, '16:00'::time, s.id, f.id, 'Lab 3', 'Practical', 'A', 'WE', '2026-07-06'
from public.subjects s, public.faculty f
where s.course_code = 'ITL703' and f.faculty_code = 'RN';

-- 5. EXAM SCHEDULES (Separate Table - Official Internal Assessment Test 1 Data)
truncate table public.exam_schedules restart identity cascade;

-- SE Semester III
insert into public.exam_schedules (date, start_time, end_time, course_code, course_name, department, year, semester, exam_type, faculty_in_charge) values
('2026-08-27', '10:15'::time, '11:15'::time, '2343111', 'Applied Mathematics Thinking - I', 'Information Technology', 'SE', 'Semester 3', 'In-Sem', 'Mrs. Shely Abraham'),
('2026-08-27', '11:45'::time, '12:45'::time, '2343112', 'Advance Data Structure & Analysis', 'Information Technology', 'SE', 'Semester 3', 'In-Sem', 'Er. Swati Gurav'),
('2026-08-28', '10:15'::time, '11:15'::time, '2343113', 'Database Management System & Application', 'Information Technology', 'SE', 'Semester 3', 'In-Sem', 'Dr. Shabina Sayyed'),
('2026-08-28', '11:45'::time, '12:45'::time, '2343114', 'Automata Theory', 'Information Technology', 'SE', 'Semester 3', 'In-Sem', 'Er. Rasheed Noor'),
('2026-08-29', '10:15'::time, '11:15'::time, 'OECL301', 'Cyber Security (OE)', 'Information Technology', 'SE', 'Semester 3', 'In-Sem', 'Er. Rasheed Noor');

-- TE Semester V
insert into public.exam_schedules (date, start_time, end_time, course_code, course_name, department, year, semester, exam_type, faculty_in_charge) values
('2026-08-27', '14:15'::time, '15:15'::time, '2345111', 'Software Engineering & Agile Practices', 'Information Technology', 'TE', 'Semester 5', 'In-Sem', 'Er. Farzana Khan'),
('2026-08-27', '15:45'::time, '16:45'::time, '2345112', 'Artificial Intelligence & Machine Learning', 'Information Technology', 'TE', 'Semester 5', 'In-Sem', 'Er. Farzana Khan'),
('2026-08-28', '14:15'::time, '15:15'::time, '2345113', 'Web Technology', 'Information Technology', 'TE', 'Semester 5', 'In-Sem', 'Dr. Shabina Sayyed'),
('2026-08-28', '15:45'::time, '16:45'::time, '2345114', 'UI/UX Design', 'Information Technology', 'TE', 'Semester 5', 'In-Sem', 'Er. Fardeen Shaikh'),
('2026-08-29', '11:45'::time, '12:45'::time, 'MDC501', 'Wireless & Mobile Communication (MDM)', 'Information Technology', 'TE', 'Semester 5', 'In-Sem', 'Er. Swati Gurav');

-- BE Semester VII
insert into public.exam_schedules (date, start_time, end_time, course_code, course_name, department, year, semester, exam_type, faculty_in_charge) values
('2026-08-27', '10:15'::time, '11:15'::time, 'ITC701', 'AI and DS - II', 'Information Technology', 'BE', 'Semester 7', 'In-Sem', 'Dr. Zainab Mirza'),
('2026-08-27', '11:45'::time, '12:45'::time, 'ITC702', 'Internet of Everything', 'Information Technology', 'BE', 'Semester 7', 'In-Sem', 'Prof. Shrinidhi Gindi'),
('2026-08-28', '10:15'::time, '11:15'::time, 'ITDO7014', 'Software Testing & Quality Assurance (DLOC 3)', 'Information Technology', 'BE', 'Semester 7', 'In-Sem', 'Er. Fardeen Shaikh'),
('2026-08-28', '11:45'::time, '12:45'::time, 'ITDO7024', 'Information Retrieval System (DLOC 4)', 'Information Technology', 'BE', 'Semester 7', 'In-Sem', 'Er. Sana Zahir A. Shaikh'),
('2026-08-29', '10:15'::time, '11:15'::time, 'ILO7016', 'Cyber Security & Laws (ILOC)', 'Information Technology', 'BE', 'Semester 7', 'In-Sem', 'Er. Ahlam Ansari'),
('2026-08-29', '11:45'::time, '12:45'::time, 'ILO7017', 'Disaster Management and Mitigation Measures (ILOC)', 'Information Technology', 'BE', 'Semester 7', 'In-Sem', 'Dr. Uma Kale');

-- 6. CAMPUS CLUBS
insert into public.clubs (name, category, lead, description, recruitment_status, contact_email, member_count) values
('ACM MHSSCE Student Chapter', 'Technical & Research', 'Aditi Kulkarni', 'Premier computing society organizing hackathons, open-source sprints, and peer-to-peer coding sessions.', 'Open', 'acm@mhssce.ac.in', 120),
('Google Developer Student Club (GDSC)', 'Google Technologies & Cloud', 'Farhan Shaikh', 'Hands-on tech bootcamps in Android, Cloud, AI, and Flutter with official Google certificate programs.', 'Open', 'gdsc@mhssce.ac.in', 185),
('RoboCon MHSSCE', 'Robotics & Hardware', 'Omkar Patil', 'National robotics team designing autonomous navigation bots, pneumatic actuators, and mechanical rigs.', 'Open', 'robocon@mhssce.ac.in', 45),
('Rotaract Club of MHSSCE', 'Social & Youth Leadership', 'Pooja Iyer', 'Social welfare, blood donation drives, beach cleanups, leadership bootcamps, and youth mentorship.', 'Open', 'rotaract@mhssce.ac.in', 210);

-- 7. ANNOUNCEMENTS
insert into public.announcements (title, category, content, urgent) values
('BE IT Sem VII Timetable (SH 2026 Version 2) Effective from 06-07-2026', 'Academics', 'The finalized timetable for BE Information Technology Semester VII is now active. Lectures will be held in Rooms 303, 305, and 306. Practical batch allocations (A, B, C) are updated.', true),
('Major Project I Review Schedule', 'Projects', 'All BE IT project batches must report to Project Lab on Mondays from 10:00 AM to 16:00 PM for guide consultation and problem statement finalization.', false);
