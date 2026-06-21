// ========================================================
// Directory: search + filter + card rendering + reviews
// ========================================================

const cardGrid = document.getElementById("cardGrid");
const resultsMeta = document.getElementById("resultsMeta");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const resetFiltersBtn = document.getElementById("resetFilters");

const state = {
  query: "",
  service: "all",
  area: "all"
};

function reviewsBlockTemplate(a){
  const list = getReviewsFor(a.id);
  const itemsHtml = list.length
    ? list.slice().reverse().map(r => `
        <div class="review-item">
          <span class="review-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</span>
          ${r.comment ? `<span class="review-comment">${escapeHtml(r.comment)}</span>` : ""}
        </div>`).join("")
    : `<p class="review-empty">No reviews yet — be the first to leave one.</p>`;

  return `
    <button class="reviews-toggle" data-toggle-reviews="${a.id}">
      ${list.length ? `Show ${list.length} review${list.length === 1 ? "" : "s"}` : "No reviews yet"}
    </button>
    <div class="reviews-list" id="reviewsList-${a.id}" hidden>${itemsHtml}</div>
  `;
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function cardTemplate(a){
  const servicePills = a.services.map(s => `<span class="service-pill ${pillClass(s)}">${s}</span>`).join("");
  const tags = [...a.areas, ...a.subjects].map(t => `<span class="tag">${t}</span>`).join("");
  const avg = averageRating(a.id);
  const count = getReviewsFor(a.id).length;

  return `
    <article class="assistor-card" data-id="${a.id}">
      <div class="card-top">
        <div class="card-photo">${a.initials}</div>
        <div>
          <div class="card-name">${a.name}</div>
          <div class="card-role">${a.role}</div>
        </div>
      </div>
      <div class="card-rating">
        <span class="stars-display">${starsDisplay(avg)}</span>
        <span class="rating-count">${avg ? avg.toFixed(1) + " · " : ""}${count} review${count === 1 ? "" : "s"}</span>
      </div>
      <div class="service-pills">${servicePills}</div>
      <p class="card-bio">${a.bio}</p>
      <div class="tag-cloud">${tags}</div>
      <div class="card-meta">
        <span><strong>Subjects:</strong> ${a.subjects.join(", ")}</span>
        <span><strong>Available:</strong> ${a.availability}</span>
        <span><strong>Find them:</strong> ${a.location}</span>
      </div>
      ${reviewsBlockTemplate(a)}
      <div class="card-actions">
        <a class="card-cta" href="mailto:${a.email}">Email ${a.name.split(" ")[0]}</a>
        <button class="review-btn" data-review="${a.id}" data-name="${a.name}">★ Rate</button>
      </div>
    </article>
  `;
}

function matchesQuery(a, query){
  if(!query) return true;
  const haystack = [
    a.name, a.role, a.bio,
    ...a.services, ...a.areas, ...a.subjects
  ].join(" ").toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).every(term => haystack.includes(term));
}

function render(){
  const filtered = ASSISTORS.filter(a => {
    const serviceOk = state.service === "all" || a.services.includes(state.service);
    const areaOk = state.area === "all" || a.areas.includes(state.area);
    const queryOk = matchesQuery(a, state.query);
    return serviceOk && areaOk && queryOk;
  });

  cardGrid.innerHTML = filtered.map(cardTemplate).join("");
  wireCardEvents();

  if(filtered.length === 0){
    cardGrid.hidden = true;
    emptyState.hidden = false;
    resultsMeta.textContent = "No matches";
  } else {
    cardGrid.hidden = false;
    emptyState.hidden = true;
    const noun = filtered.length === 1 ? "assistor" : "assistors";
    const isFiltered = state.service !== "all" || state.area !== "all" || state.query !== "";
    resultsMeta.textContent = isFiltered
      ? `Showing ${filtered.length} of ${ASSISTORS.length} ${noun}`
      : `Showing all ${ASSISTORS.length} assistors`;
  }
}

function wireCardEvents(){
  document.querySelectorAll("[data-toggle-reviews]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.toggleReviews;
      const list = document.getElementById(`reviewsList-${id}`);
      const isHidden = list.hidden;
      list.hidden = !isHidden;
      const count = getReviewsFor(id).length;
      btn.textContent = isHidden
        ? `Hide review${count === 1 ? "" : "s"}`
        : (count ? `Show ${count} review${count === 1 ? "" : "s"}` : "No reviews yet");
    });
  });

  document.querySelectorAll("[data-review]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.__openReviewModal(btn.dataset.review, btn.dataset.name);
    });
  });
}

function setChipGroup(groupName, value){
  state[groupName] = value;
  document.querySelectorAll(`.chip-row[data-filter-group="${groupName}"] .chip`).forEach(chip => {
    chip.setAttribute("aria-pressed", String(chip.dataset.value === value));
  });
  render();
}

document.querySelectorAll(".chip-row").forEach(row => {
  const groupName = row.dataset.filterGroup;
  row.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    setChipGroup(groupName, chip.dataset.value);
  });
});

searchInput.addEventListener("input", e => {
  state.query = e.target.value;
  clearSearchBtn.hidden = state.query.length === 0;
  render();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  state.query = "";
  clearSearchBtn.hidden = true;
  searchInput.focus();
  render();
});

resetFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearSearchBtn.hidden = true;
  state.query = "";
  setChipGroup("service", "all");
  setChipGroup("area", "all");
});

initReviewModal(render);
render();
