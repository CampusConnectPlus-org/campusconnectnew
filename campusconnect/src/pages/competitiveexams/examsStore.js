export const COMPETITIVE_EXAMS_STORAGE_KEY = "competitiveExamsData";

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n|,/)
    .map((v) => v.trim())
    .filter(Boolean);
};

const normalizeExam = (exam = {}) => ({
  id: exam.id || `${(exam.title || "exam").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
  title: exam.title || "",
  tag: exam.tag || "",
  category: exam.category || "core",
  branch: exam.branch || "",
  level: exam.level || "",
  timing: exam.timing || "",
  difficulty: exam.difficulty || "Medium",
  officialSite: exam.officialSite || "",
  highlight: exam.highlight || "",
  items: normalizeList(exam.items),
  syllabus: normalizeList(exam.syllabus),
  papers: exam.papers || "",
  dates: normalizeList(exam.dates),
  roadmap: normalizeList(exam.roadmap),
});

export const DEFAULT_COMPETITIVE_EXAMS = [
  {
    id: "gate",
    title: "GATE",
    tag: "Graduate Aptitude Test in Engineering",
    category: "core",
    branch: "All branches",
    level: "PSU + M.Tech",
    timing: "Once a year",
    difficulty: "High",
    officialSite: "https://gate2026.iitg.ac.in/",
    highlight: "Best for PSU shortlisting, M.Tech admissions, and research opportunities.",
    items: ["Eligibility: Final year / graduates", "Focus: Core concepts + aptitude", "Outcome: PSU calls, higher studies"],
    syllabus: ["Engineering Mathematics", "General Aptitude", "Core branch subjects", "Previous year concepts and formulas"],
    papers: "Practice at least 10 years of questions and sectional mock tests.",
    dates: ["Notification release: usually mid-year", "Application: within notification window", "Exam: once a year", "Result: after evaluation window"],
    roadmap: ["Month 1-2: revise concepts", "Month 3-4: solve topic-wise questions", "Month 5: full mocks + revision", "Last month: previous year papers"],
  },
  {
    id: "ese-ies",
    title: "ESE / IES",
    tag: "Engineering Services Examination",
    category: "core",
    branch: "Civil, Mechanical, Electrical, Electronics",
    level: "Government service",
    timing: "Once a year",
    difficulty: "Very High",
    officialSite: "https://upsc.gov.in/examinations/engineering-services-examination",
    highlight: "Ideal for students targeting Group A technical government posts.",
    items: ["Eligibility: Engineering degree", "Stages: Prelims, Mains, Interview", "Focus: Deep technical preparation"],
    syllabus: ["Engineering discipline core", "General studies", "Aptitude and reasoning", "Personality test preparation"],
    papers: "Use stage-wise previous papers for prelims and mains.",
    dates: ["Notification: yearly", "Prelims: first stage", "Mains: shortlisted candidates", "Interview: final stage"],
    roadmap: ["Build basics first", "Follow standard engineering notes", "Add GS and aptitude practice", "Take full-length mocks"],
  },
  {
    id: "psu",
    title: "PSU Recruitment",
    tag: "GATE-based / direct recruitment",
    category: "jobs",
    branch: "All major branches",
    level: "Public sector jobs",
    timing: "Throughout the year",
    difficulty: "Medium to High",
    officialSite: "https://careers.ntpc.co.in/",
    highlight: "Track companies like ONGC, IOCL, NTPC, BHEL, GAIL, and others.",
    items: ["Eligibility varies by company", "Often uses GATE score", "Prepare resume + interview basics"],
    syllabus: ["Core branch knowledge", "Aptitude", "HR interview basics", "Technical interview concepts"],
    papers: "Use GATE-based mock papers and company-specific interview questions.",
    dates: ["Openings: as vacancies arise", "Shortlisting: after GATE or written test", "Interview: company dependent", "Joining: after document verification"],
    roadmap: ["Keep a job tracker", "Prepare resume early", "Revise core topics", "Practice interview answers"],
  },
  {
    id: "ssc-je",
    title: "SSC JE",
    tag: "Junior Engineer examination",
    category: "govt",
    branch: "Civil, Electrical, Mechanical",
    level: "Central govt jobs",
    timing: "Annual/periodic",
    difficulty: "Medium",
    officialSite: "https://ssc.nic.in/",
    highlight: "Strong option for engineering graduates and diploma holders.",
    items: ["Eligibility: Diploma / degree depending on post", "Focus: Technical + reasoning", "Best for stable govt roles"],
    syllabus: ["Civil / Electrical / Mechanical basics", "Reasoning", "General awareness", "Technical MCQs"],
    papers: "Practice official paper patterns and topic-wise quizzes.",
    dates: ["Notification: periodic", "Application: after vacancy notice", "Exam: as scheduled", "Final result: after merit list"],
    roadmap: ["Start with technical basics", "Add reasoning practice daily", "Revise formulas", "Attempt timed full tests"],
  },
  {
    id: "state-ae-je",
    title: "State AE / JE",
    tag: "Assistant Engineer / Junior Engineer",
    category: "govt",
    branch: "State-specific",
    level: "State govt jobs",
    timing: "Varies by state",
    difficulty: "Medium",
    officialSite: "https://psc.nic.in/",
    highlight: "Keep an eye on state PSC, irrigation, PWD, and electricity boards.",
    items: ["Eligibility: State rules", "Focus: Technical subjects + GK", "Track official notifications"],
    syllabus: ["Branch subjects", "State GK", "Reasoning and aptitude", "Notification-specific topics"],
    papers: "Use the official state paper pattern and local exam groups for practice.",
    dates: ["Notification: state-wise", "Application: limited window", "Exam: as announced", "Result: merit-based"],
    roadmap: ["Track your state PSC daily", "Build subject notes", "Revise state GK", "Take mock tests with timer"],
  },
  {
    id: "isro",
    title: "ISRO",
    tag: "Space research and technical posts",
    category: "research",
    branch: "Selected engineering branches",
    level: "Research jobs",
    timing: "As per openings",
    difficulty: "High",
    officialSite: "https://www.isro.gov.in/Careers.html",
    highlight: "Great for students who want applied research and national missions.",
    items: ["Eligibility: Branch-specific", "Written test + interview", "Strong fundamentals matter most"],
    syllabus: ["Core engineering basics", "Problem solving", "Lab/project concepts", "Interview-ready fundamentals"],
    papers: "Solve technical objective questions and interview-based preparation sheets.",
    dates: ["Notification: as openings come", "Test: after shortlisting", "Interview: final round", "Offer: after final approval"],
    roadmap: ["Strengthen core concepts", "Prepare project explanations", "Practice aptitude", "Revise branch fundamentals"],
  },
  {
    id: "drdo",
    title: "DRDO",
    tag: "Defence research and technical roles",
    category: "research",
    branch: "Engineering + science disciplines",
    level: "Research jobs",
    timing: "As per openings",
    difficulty: "High",
    officialSite: "https://www.drdo.gov.in/careers",
    highlight: "Good for students aiming for defense R&D, labs, and applied technology roles.",
    items: ["Eligibility: Post depends on role", "Focus: Technical depth + aptitude", "Track official recruitment notices"],
    syllabus: ["Branch-specific technical topics", "Research aptitude", "Problem solving", "Applied engineering concepts"],
    papers: "Focus on technical tests and interview preparation around core concepts.",
    dates: ["Vacancies: notification-based", "Screening: after application", "Interview: shortlisted candidates", "Final merit: after approval"],
    roadmap: ["Read core textbooks", "Practice applied questions", "Follow current research trends", "Revise concepts for interview"],
  },
  {
    id: "rrb-je",
    title: "RRB JE",
    tag: "Railway Junior Engineer",
    category: "govt",
    branch: "Civil, Electrical, Mechanical, Electronics",
    level: "Railway jobs",
    timing: "Periodic",
    difficulty: "Medium",
    officialSite: "https://indianrailways.gov.in/",
    highlight: "A strong engineering-focused government option with wide branch coverage.",
    items: ["Eligibility: Diploma / degree depending on notification", "Focus: Technical + general awareness", "Good for stable railway roles"],
    syllabus: ["Branch technical subjects", "General awareness", "Reasoning", "Quantitative aptitude"],
    papers: "Use railway exam question sets and mock papers for timed practice.",
    dates: ["Notification: periodic", "Application: notification window", "Exam: scheduled by board", "Result: merit list"],
    roadmap: ["Study branch basics", "Practice reasoning daily", "Use mock papers", "Revise railway-specific GK"],
  },
  {
    id: "barc-oces-dgfs",
    title: "BARC OCES/DGFS",
    tag: "Scientific officer recruitment",
    category: "research",
    branch: "Engineering and science graduates",
    level: "Research jobs",
    timing: "Annual",
    difficulty: "High",
    officialSite: "https://www.barc.gov.in/careers/",
    highlight: "One of the best choices for students who want high-end technical and research careers.",
    items: ["Eligibility: Branch-specific", "Focus: Concepts + aptitude + interview", "Excellent for core engineering students"],
    syllabus: ["Technical core subjects", "Aptitude", "Scientific reasoning", "Interview discussion points"],
    papers: "Practice scientific aptitude papers and branch-specific objective questions.",
    dates: ["Application: annual", "Screening: written test", "Interview: shortlisted candidates", "Final list: after merit"],
    roadmap: ["Revise core engineering", "Build concept clarity", "Practice aptitude", "Prepare for interview questions"],
  },
].map(normalizeExam);

export const getCompetitiveExams = () => {
  try {
    const raw = localStorage.getItem(COMPETITIVE_EXAMS_STORAGE_KEY);
    if (!raw) return DEFAULT_COMPETITIVE_EXAMS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_COMPETITIVE_EXAMS;
    return parsed.map(normalizeExam);
  } catch {
    return DEFAULT_COMPETITIVE_EXAMS;
  }
};

export const saveCompetitiveExams = (exams) => {
  const normalized = (Array.isArray(exams) ? exams : []).map(normalizeExam);
  localStorage.setItem(COMPETITIVE_EXAMS_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("competitive-exams-updated"));
};
