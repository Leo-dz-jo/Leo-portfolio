
const SKILLS = [
  { name: 'JavaScript',    level: 90, tag: 'javascript' },
  { name: 'HTML / CSS',    level: 92, tag: 'web' },
  { name: 'Python',        level: 85, tag: 'python' },
  { name: 'VBA (Excel)',   level: 80, tag: 'vba' },
  { name: 'C++ (Arduino)', level: 75, tag: 'cpp' },
  { name: 'Rust (Tauri)',  level: 60, tag: 'rust' },
];


const PROJECTS = [
  {
    title: 'Timecard PWA', status: 'Deployed · offline-first', dev: false,
    tags: ['javascript', 'web'], demo: 'timecard',
    short: 'Client-side workforce management for Philippine businesses — geolocation clock-in, shift scheduling, and built-in SSS/PhilHealth/Pag-IBIG compliance.',
    long: 'A fully client-side workforce management app built for Philippine businesses. Handles geolocation-verified clock-in/out with photo verification, shift scheduling, and native compliance for SSS, PhilHealth, Pag-IBIG, and 13th-month pay. Packaged for native install via Electron and Capacitor, with jsPDF/SheetJS exports and hash-chained audit logging for tamper-evident record keeping. Runs entirely on IndexedDB — no server required.'
  },
  {
    title: 'Financial Command Center', status: 'Actively maintained', dev: false,
    tags: ['javascript', 'vba', 'web'], demo: 'financial',
    short: "Live dashboard tracking three companies' financials in parallel, mirrored by a companion Excel workbook with 3D charts and VBA animation.",
    long: "A live dashboard (HTML/Chart.js) tracking financial data for three companies in parallel — dark navy-and-gold interface, KPI cards, and a detail drawer. Mirrored by a companion Excel workbook with 3D charts, pivot-style crosstabs, and VBA-driven animation, spanning roughly 70 months of combined financial records. Peso-formatted throughout."
  },
  {
    title: 'dev-to-do', status: 'Deployed', dev: false,
    tags: ['rust', 'javascript', 'web'], demo: 'kanban',
    short: 'A Tauri desktop task manager with a terminal-dark aesthetic — 7-stage kanban, reminders, and an animated weekly progress chart.',
    long: 'A developer-focused desktop task manager built on Tauri, with a terminal-dark aesthetic matching a real dev environment. Features a 7-stage customizable kanban board, a reminders and snooze system, an animated weekly progress chart, and a navigable mini calendar. Packaged as a lightweight native desktop app.'
  },
  {
    title: 'MB_303 — Biometric Attendance', status: 'Deployed · hardware', dev: false,
    tags: ['cpp'], demo: 'biometric',
    short: 'A standalone fingerprint attendance terminal for EARIST Cavite — AS608 sensor, OLED display, RTC, and a servo-controlled gate.',
    long: 'A standalone biometric attendance terminal built for EARIST Cavite using an AS608 fingerprint sensor, SSD1306 OLED display, DS3231 real-time clock, SD card logging, and a servo-controlled gate. Includes fingerprint enrollment and verification, a lockout system for repeated failures, CSV attendance logging, and a serial-based RTC time-correction utility.'
  },
  {
    title: 'Excel Business Suite', status: 'Deployed', dev: false,
    tags: ['python', 'vba'], demo: 'excel',
    short: 'A multi-sheet business system covering inventory, sales, invoicing, and expenses — built with Python/openpyxl and peso formatting.',
    long: "A comprehensive multi-sheet business management system covering inventory, sales, invoicing, expenses, and financial statements. Built programmatically with Python and openpyxl, using chained SUMIFS/VLOOKUP formula logic and peso-formatted reporting throughout — designed to be handed to a non-technical business owner as a finished tool."
  },
  {
    title: 'React To-Do Suite', status: 'Deployed', dev: false,
    tags: ['javascript', 'web'], demo: 'reacttodo',
    short: 'A React/Vite productivity app with five coordinated views — List, Kanban, Dashboard, Goals, and Calendar.',
    long: "A React and Vite productivity application with five coordinated views: List, Kanban, Dashboard, Goals, and Calendar. Involved debugging fatal JSX errors, layout fixes, and building out consistent state handling across all five views so data stays in sync no matter which view it's edited from."
  },
  {
    title: 'Branch', status: 'In design', dev: true,
    tags: [], demo: 'branch',
    short: 'A concept for a developer-native to-do app that stores tasks as git objects, with dependency graphs between tasks.',
    long: 'A concept for a developer-native to-do app that stores tasks as git objects rather than database rows, with dependency graphs between tasks and inference-driven task generation. Currently in UI exploration ahead of committing to a framework — Flutter is the leading candidate given a preference for offline-first, cross-platform builds.'
  },
];

const CODE_SAMPLES = [
  {
    lang: 'javascript', label: 'JavaScript', file: 'timecard-pwa/audit-log.js',
    code:
`// Hash-chained audit log entry — Timecard PWA
function appendAuditEntry(log, entry) {
  const prevHash = log.length ? log[log.length - 1].hash : '0';
  const payload = JSON.stringify({ ...entry, prevHash });
  entry.hash = sha256(payload);
  entry.prevHash = prevHash;
  log.push(entry);
  return log;
}`
  },
  {
    lang: 'python', label: 'Python', file: 'excel-suite/invoices.py',
    code:
`# Invoice sheet builder — Excel Business Suite
from openpyxl import Workbook

def build_invoice_sheet(wb, invoices):
    ws = wb.create_sheet("Invoices")
    ws.append(["Invoice #", "Client", "Amount (PHP)", "Status"])
    for inv in invoices:
        ws.append([inv.number, inv.client, inv.amount, inv.status])
        cell = ws.cell(row=ws.max_row, column=3)
        cell.number_format = '"\u20b1"#,##0.00'
    return ws`
  },
  {
    lang: 'cpp', label: 'C++', file: 'mb303/enroll.ino',
    code:
`// Fingerprint enrollment — MB_303 biometric attendance
uint8_t enrollFingerprint(uint8_t id) {
  int p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
  }
  finger.image2Tz(1);
  Serial.println(F("Remove finger, place again..."));
  delay(2000);
  while (finger.getImage() != FINGERPRINT_OK) {}
  finger.image2Tz(2);
  if (finger.createModel() != FINGERPRINT_OK) return 0;
  return finger.storeModel(id);
}`
  },
  {
    lang: 'vbnet', label: 'VBA', file: 'financial-dashboard/AnimateKPI.bas',
    code:
`' KPI card count-up animation — Financial Command Center
Sub AnimateKPICard(rng As Range, targetValue As Double)
    Dim steps As Integer: steps = 20
    Dim i As Integer
    For i = 1 To steps
        rng.Value = targetValue * (i / steps)
        DoEvents
        Sleep 15
    Next i
    rng.Value = targetValue
End Sub`
  },
];


const PROFILE = {
  name: 'Leo',
  handle: 'leo',
  tagline: 'Software that keeps working when the wi-fi doesn\'t.',
  subhead: "I build client-deployable tools for real businesses — payroll systems, financial dashboards, and embedded hardware that run offline-first. Try the terminal below, it actually works.",
  
  photo: 'https://scontent.fmnl4-6.fna.fbcdn.net/v/t39.30808-6/771802341_1019175290950974_5726325441736874680_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1440&ctp=s1440x1440&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEj_N8AMyIm6holA-9QlEi3h8tTYlDkJ2aHy1NiUOQnZnchpchXWBBLUm0VYeEEOnmudwPR1TxcdMJuAfqfi__q&_nc_ohc=LiB_U9VjxoYQ7kNvwFqJMF7&_nc_oc=AdrPjSGYXjRqpS8J2T2YH0j6yMGaq-YW9wQNeNIgCzvHaGevVYVApXsoMQV6720c38HzXOrjw0rlDC4-6NsCX2mb&_nc_zt=23&_nc_ht=scontent.fmnl4-6.fna&_nc_gid=3Hgz9EjX3JSYRO_i1kFhiw&_nc_ss=7b2a8&oh=00_AQHFwVPsJzAWAqaTZDyXQ_-PgeIStvMosZmLYAG3IixZ_w&oe=6A8E34E1',           // used by the big circle photo in the hero section
  timelinePhoto: 'https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-6/600506875_826126606922511_1935257823027312932_n.jpg?stp=dst-jpg_tt6&cstp=mx1252x1267&ctp=s1252x1267&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFcLdGQdaOG5w4FR9S2snqfpfQgoufZrDql9CCi59msOtUekJ0HJ66gcxf1Z6fapjyWlEQQh-RQw5y-Fvv0wpjj&_nc_ohc=AwtTO706xqYQ7kNvwE7Ml3U&_nc_oc=Adr12BP14i_m8g4xcjwnLSPvpGCqOzrrDzzY8IXf0h07q6dDNscuzoCoLJ3GUh3R2wUIuDi6lKmcO0A9-2VRGdAM&_nc_zt=23&_nc_ht=scontent.fmnl4-5.fna&_nc_gid=Im3MY2lYsQwbsSx3AvM3NQ&_nc_ss=7b2a8&oh=00_AQGiW4Knz53nfHDrhg7kIWqNGZNYcDZxOD3GZCMgaG_u9g&oe=6A8E2784',   // used by the small circle photo in the Timeline section — set separately from the one above
  email: 'bregana.jhonleonex@ncst.edu.ph',
  github: 'https://github.com/Leo-dz-jo',
  githubUsername: 'Leo-dz-jo',       
  formEndpoint: 'https://formspree.io/f/mppapjvw',         
  location: 'Bulihan,silang cavite, PH',
};


const TRANSLATIONS = {
  en: {
    nav_skills: 'Skills', nav_work: 'Work', nav_timeline: 'Timeline', nav_code: 'Code',
    nav_github: 'GitHub', nav_about: 'About', nav_contact: 'Contact',
    hero_sub: PROFILE.subhead,
    cta_work: 'View builds ↓', cta_contact: 'Get in touch',
    about_label: '01 — About', about_title: 'Built for the field, not the demo.',
    skills_label: '02 — Languages', skills_title: "What I've built with",
    work_label: '03 — Selected work', work_title: 'Projects',
    timeline_label: '04 — Path', timeline_title: 'How this built up',
    gh_label: '05 — Live', gh_title: 'GitHub activity',
    uth_label: '06 — Under the hood', uth_title: 'Not just a list of languages',
    contact_title: 'Have something that needs building?',
    contact_sub: 'Open to freelance projects — workforce tools, dashboards, or the occasional embedded system. Tell me what it needs to do.',
    form_name: 'Name', form_email: 'Your email', form_msg: 'What do you need built?',
    form_send: 'Send message',
  },
  fil: {
    nav_skills: 'Kasanayan', nav_work: 'Trabaho', nav_timeline: 'Takdang-panahon', nav_code: 'Code',
    nav_github: 'GitHub', nav_about: 'Tungkol', nav_contact: 'Makipag-ugnayan',
    hero_sub: "Gumagawa ako ng mga tool na madaling i-deploy para sa tunay na negosyo — payroll system, financial dashboard, at embedded hardware na gumagana kahit walang internet. Subukan ang terminal sa ibaba, gumagana talaga ito.",
    cta_work: 'Tingnan ang mga proyekto ↓', cta_contact: 'Makipag-ugnayan',
    about_label: '01 — Tungkol', about_title: 'Ginawa para sa totoong gamit, hindi lang demo.',
    skills_label: '02 — Wika', skills_title: 'Ginamit kong mga teknolohiya',
    work_label: '03 — Mga proyekto', work_title: 'Mga Proyekto',
    timeline_label: '04 — Landas', timeline_title: 'Paano ito nabuo',
    gh_label: '05 — Live', gh_title: 'Aktibidad sa GitHub',
    uth_label: '06 — Sa ilalim ng ibabaw', uth_title: 'Hindi lang listahan ng wika',
    contact_title: 'May kailangan ka bang ipagawa?',
    contact_sub: 'Bukas ako sa mga freelance na proyekto — workforce tools, dashboard, o embedded system. Sabihin mo lang kung ano ang kailangan.',
    form_name: 'Pangalan', form_email: 'Iyong email', form_msg: 'Ano ang kailangan mong ipagawa?',
    form_send: 'Ipadala ang mensahe',
  },
};
