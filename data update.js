// ========================================================
// Shared assistor data — used by script.js, reviews.js, chatbot.js
// ========================================================

const ASSISTORS = [
  {
    id: "mehdi",
    name: "Mehdi Akhlaqi",
    role: "Year 12 · Aspiring in Digital Technology",
    initials: "MA",
    services: ["NAP", "Stage 1", "Stage 2"],
    areas: ["Writing", "Grammar", "Pathway advising"],
    subjects: ["Digital Technology", "Essential Mathematics", "EAL"],
    bio: "Happy to support Stage 1 students and NAP students with language barriers, reading and writing. Also advises anyone considering a future in IT.",
    availability: "Mon 1pm · Wed L4 · Fri L1 & L3",
    location: "Library",
    email: "Mehdi.Akhlaqi21@schools.sa.edu.au"
  },
  {
    id: "ali",
    name: "Ali Rezaei",
    role: "Year 12 · Aspiring in Health Sciences",
    initials: "AR",
    services: ["Stage 1", "Stage 2"],
    areas: ["Speaking", "Pathway advising"],
    subjects: ["Biology", "Chemistry", "Mathematics"],
    bio: "Specialises in Stage 2 science subjects and exam prep. Big on building speaking confidence for oral assessments and presentations.",
    availability: "Tue L2 · Thu L3 & L4",
    location: "Learning Hub",
    email: "Ali.Rezaei21@schools.sa.edu.au"
  },
  {
    id: "yaqoob",
    name: "Yaqoob Ibrahimi",
    role: "Year 12 · Aspiring in Business & Law",
    initials: "YH",
    services: ["NAP", "Stage 1"],
    areas: ["Writing", "Grammar"],
    subjects: ["English", "Legal Studies", "Business Innovation"],
    bio: "Focused on essay structure, grammar fundamentals, and clear written English. Especially keen to help NAP students settle into written assessment tasks.",
    availability: "Mon L3 · Wed L1 · Fri 1pm",
    location: "Library",
    email: "Yaqoob.Hassani21@schools.sa.edu.au"
  },
  {
    id: "eshan",
    name: "Ehsan Rezaee",
    role: "Year 12 . Aspiring in Outdoor Eudcation",
    initials: "ER",
    service: ["NAP", "Stage 1"],
    areas: ["Writing", "Speaking"],
    subjects: ["Outdoor", "EAL"],
    bio: "Focused on teaching writing techs, grammar, speaking tech.",
    availability: "Mon L3 . Thu L2 . Fri L2",
    location: "Library",
    email: "Ehsan.Rezaee20@schools.sa.edu.au"
  }
  
];

function pillClass(service){
  return "pill-" + service.replace(/\s+/g, "");
}
