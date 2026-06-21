// ========================================================
// Review system — star ratings + comments per assistor
// Stored in localStorage so ratings persist between visits
// on this device. Seeded with a few starter reviews so the
// directory doesn't look empty on first load.
// ========================================================

const REVIEWS_KEY = "s2s_reviews_v1";

const SEED_REVIEWS = {
  mehdi: [
    { stars: 5, comment: "Helped me restructure my Digital Tech folio, made way more sense after." },
    { stars: 4, comment: "Patient with my English, explained grammar rules clearly." }
  ],
  ali: [
    { stars: 5, comment: "Calmed me down before my Biology oral, gave great tips on pacing." }
  ],
  yaqoob: [
    { stars: 5, comment: "Fixed so many small grammar mistakes I didn't even notice in my essay." },
    { stars: 5, comment: "Really clear on how to structure a Legal Studies response." },
    { stars: 3, comment: "Useful session, ran a little short on time." }
  ]
};

function loadReviews(){
  try{
    const raw = localStorage.getItem(REVIEWS_KEY);
    if(!raw) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(SEED_REVIEWS));
      return structuredClone(SEED_REVIEWS);
    }
    return JSON.parse(raw);
  } catch(e){
    return structuredClone(SEED_REVIEWS);
  }
}

function saveReviews(reviews){
  try{
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  } catch(e){ /* storage unavailable — review just won't persist */ }
}

function getReviewsFor(assistorId){
  const reviews = loadReviews();
  return reviews[assistorId] || [];
}

function addReview(assistorId, stars, comment){
  const reviews = loadReviews();
  if(!reviews[assistorId]) reviews[assistorId] = [];
  reviews[assistorId].push({ stars, comment: comment.trim() });
  saveReviews(reviews);
}

function averageRating(assistorId){
  const list = getReviewsFor(assistorId);
  if(list.length === 0) return null;
  const sum = list.reduce((acc, r) => acc + r.stars, 0);
  return sum / list.length;
}

function starsDisplay(avg){
  if(avg === null) return "☆☆☆☆☆";
  const rounded = Math.round(avg);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

// ---------- Modal wiring (shared across pages that include the directory) ----------

let currentReviewAssistorId = null;
let currentReviewStars = 0;

function initReviewModal(onSubmitCallback){
  const modal = document.getElementById("reviewModal");
  if(!modal) return; // page doesn't have the directory/modal

  const closeBtn = document.getElementById("reviewModalClose");
  const cancelBtn = document.getElementById("reviewCancel");
  const form = document.getElementById("reviewForm");
  const nameSpan = document.getElementById("reviewAssistorName");
  const stars = document.querySelectorAll("#starInput .star");
  const submitBtn = document.getElementById("reviewSubmit");
  const commentBox = document.getElementById("reviewComment");

  function closeModal(){
    modal.hidden = true;
    currentReviewAssistorId = null;
    currentReviewStars = 0;
    stars.forEach(s => s.classList.remove("active"));
    commentBox.value = "";
    submitBtn.disabled = true;
  }

  function openModal(assistorId, assistorName){
    currentReviewAssistorId = assistorId;
    nameSpan.textContent = assistorName;
    modal.hidden = false;
    commentBox.focus();
  }

  stars.forEach(star => {
    star.addEventListener("click", () => {
      currentReviewStars = Number(star.dataset.star);
      stars.forEach(s => {
        s.classList.toggle("active", Number(s.dataset.star) <= currentReviewStars);
      });
      submitBtn.disabled = currentReviewStars === 0;
    });
  });

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape" && !modal.hidden) closeModal(); });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if(currentReviewStars === 0 || !currentReviewAssistorId) return;
    addReview(currentReviewAssistorId, currentReviewStars, commentBox.value);
    closeModal();
    if(onSubmitCallback) onSubmitCallback();
  });

  // expose opener for card buttons
  window.__openReviewModal = openModal;
}
