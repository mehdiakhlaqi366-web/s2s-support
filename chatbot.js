// ========================================================
// Guide bot — rule-based assistant (Ali's feature)
// No external API; matches keywords to helpful, scripted
// answers and guides students toward the right page/person.
// ========================================================

const BOT_NAME = "Sana";

const INTRO_SUGGESTIONS = [
  "I need help with writing",
  "I'm a NAP student",
  "Who can help with Stage 2?",
  "How do I book a session?"
];

// Each rule: keywords to match (any one triggers it) + reply + optional follow-up suggestions
const RULES = [
  {
    keywords: ["nap", "new arrival", "language barrier", "eal"],
    reply: "For NAP support, Mehdi and Yaqoob both help with language barriers, reading and writing. Mehdi's in the Library, Yaqoob's in Room G12 — check the directory for their exact availability.",
    suggestions: ["Take me to the directory", "What's NAP again?"]
  },
  {
    keywords: ["what's nap", "what is nap", "nap again", "explain nap"],
    reply: "NAP stands for the New Arrivals Program — support for students who are newer to Australian schooling, especially around language and settling in.",
    suggestions: ["Who can help with NAP?"]
  },
  {
    keywords: ["stage 1"],
    reply: "All three of us help with Stage 1! Mehdi covers Digital Tech, Essential Maths and EAL. Yaqoob covers English, Legal Studies and Business. Ali helps with Stage 1 sciences and maths too.",
    suggestions: ["Take me to the directory", "Who can help with Stage 2?"]
  },
  {
    keywords: ["stage 2"],
    reply: "For Stage 2, Mehdi covers Digital Technology, and Ali specialises in Stage 2 sciences (Biology, Chemistry) plus exam prep. Have a look at the directory to compare availability.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["writing", "essay", "structure"],
    reply: "For writing and essay structure, Yaqoob is the go-to — he focuses on essay structure and grammar. Mehdi also helps with writing for NAP and Stage 1 students.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["speaking", "oral", "presentation", "confidence"],
    reply: "Ali specialises in building speaking confidence — great for oral assessments and presentations.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["grammar"],
    reply: "Both Mehdi and Yaqoob can help with grammar — Yaqoob's particular focus is grammar fundamentals and clear written English.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["pathway", "subject advice", "what subjects", "career"],
    reply: "For pathway and subject advising, Mehdi (IT/Digital Tech direction) and Ali (Health Sciences direction) both offer guidance on choosing subjects for what comes next.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["book", "booking", "session", "appointment", "how do i"],
    reply: "There's no formal booking system — just check an assistor's availability on their card in the directory, then email them directly to arrange a time.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["directory", "find", "who can help", "assistor", "search"],
    reply: "You can browse and filter all three assistors on the Find an Assistor page — search by subject, or filter by service and support area.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["mehdi"],
    reply: "Mehdi supports NAP, Stage 1 and Stage 2 students, focused on Digital Technology, Essential Maths and EAL. He's in the Library on Mon 1pm, Wed L4, and Fri L1 & L3.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["ali"],
    reply: "Ali helps with Stage 1 and Stage 2 sciences and maths, plus speaking confidence and pathway advice. He's in the Learning Hub Tue L2 and Thu L3 & L4.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["yaqoob"],
    reply: "Yaqoob supports NAP and Stage 1 students with writing and grammar, plus English, Legal Studies and Business. He's in Room G12 on Mon L3, Wed L1, and Fri 1pm.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["review", "rate", "rating", "feedback"],
    reply: "You can leave a star rating and a short comment for any assistor right on their card in the directory — tap the ★ Rate button.",
    suggestions: ["Take me to the directory"]
  },
  {
    keywords: ["thank", "thanks", "cheers"],
    reply: "You're welcome! Good luck with your studies 🙂",
    suggestions: INTRO_SUGGESTIONS
  },
  {
    keywords: ["hi", "hello", "hey"],
    reply: `Hi! I'm ${BOT_NAME}, here to help you find the right assistor. What do you need help with?`,
    suggestions: INTRO_SUGGESTIONS
  }
];

const FALLBACK_REPLY = "I'm not totally sure about that one — but you can browse every assistor's specialties on the Find an Assistor page, or try asking about NAP, Stage 1, Stage 2, writing, speaking, or grammar.";

function findReply(userText){
  const text = userText.toLowerCase();
  for(const rule of RULES){
    if(rule.keywords.some(k => text.includes(k))){
      return rule;
    }
  }
  return { reply: FALLBACK_REPLY, suggestions: ["Take me to the directory"] };
}

// ---------- DOM wiring ----------

function initChatWidget(){
  const launcher = document.getElementById("chatLauncher");
  const panel = document.getElementById("chatPanel");
  const messages = document.getElementById("chatMessages");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");

  if(!launcher || !panel) return;

  let opened = false;

  function appendMessage(text, sender){
    const div = document.createElement("div");
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function appendSuggestions(list){
    if(!list || list.length === 0) return;
    const wrap = document.createElement("div");
    wrap.className = "chat-suggestions";
    list.forEach(s => {
      const btn = document.createElement("button");
      btn.className = "chat-suggestion-btn";
      btn.type = "button";
      btn.textContent = s;
      btn.addEventListener("click", () => handleUserInput(s));
      wrap.appendChild(btn);
    });
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleUserInput(text){
    if(!text.trim()) return;
    appendMessage(text, "user");

    if(text === "Take me to the directory"){
      setTimeout(() => {
        appendMessage("Heading there now!", "bot");
        setTimeout(() => { window.location.href = "support.html"; }, 500);
      }, 250);
      return;
    }

    const { reply, suggestions } = findReply(text);
    setTimeout(() => {
      appendMessage(reply, "bot");
      appendSuggestions(suggestions);
    }, 350);
  }

  launcher.addEventListener("click", () => {
    opened = !opened;
    panel.hidden = !opened;
    launcher.classList.toggle("open", opened);
    launcher.setAttribute("aria-expanded", String(opened));
    if(opened && messages.childElementCount === 0){
      appendMessage(`Hi! I'm ${BOT_NAME} 👋 I can help you find the right assistor for NAP, Stage 1, or Stage 2 support. What are you after?`, "bot");
      appendSuggestions(INTRO_SUGGESTIONS);
    }
    if(opened) input.focus();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = input.value;
    input.value = "";
    handleUserInput(text);
  });
}

document.addEventListener("DOMContentLoaded", initChatWidget);
