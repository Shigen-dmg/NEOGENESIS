/* Search, field filters, tag filters, and sorting for research.html. */
document.addEventListener("DOMContentLoaded", () => {
  const results = document.querySelector("[data-research-results]");
  if (!results) return;

  const data = window.NEOGENESIS_RESEARCH || [];
  const search = document.querySelector("[data-research-search]");
  const tagSelect = document.querySelector("[data-tag-filter]");
  const sortSelect = document.querySelector("[data-sort]");
  const count = document.querySelector("[data-result-count]");
  const fieldButtons = [...document.querySelectorAll("[data-field]")];
  let activeField = "all";

  fieldButtons.forEach(button => {
    const field = button.dataset.field;
    const fieldCount = field === "all" ? data.length : data.filter(item => item.fieldSlug === field).length;
    const counter = button.querySelector("span");
    if (counter) counter.textContent = String(fieldCount).padStart(2, "0");
    button.setAttribute("aria-pressed", String(button.dataset.field === "all"));
  });

  const tags = [...new Set(data.flatMap(item => item.tags))].sort();
  tagSelect.insertAdjacentHTML("beforeend", tags.map(tag => `<option value="${tag}">${tag.toUpperCase()}</option>`).join(""));

  const formatDate = value => new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(new Date(`${value}T00:00:00`)).toUpperCase();

  const render = () => {
    const term = search.value.trim().toLowerCase();
    const selectedTag = tagSelect.value;
    const filtered = data
      .filter(item => activeField === "all" || item.fieldSlug === activeField)
      .filter(item => selectedTag === "all" || item.tags.includes(selectedTag))
      .filter(item => [item.id, item.title, item.description, item.field, ...item.tags].join(" ").toLowerCase().includes(term))
      .sort((a, b) => sortSelect.value === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));

    count.textContent = `${String(filtered.length).padStart(2, "0")} ${filtered.length === 1 ? "DOCUMENT" : "DOCUMENTS"} FOUND`;
    results.innerHTML = filtered.length ? filtered.map(item => `
      <article class="database-card">
        <div class="database-card-top mono">
          <span>${item.id}</span>
          <span>${item.fieldCode} / ${item.field.toUpperCase()}</span>
          <span>${formatDate(item.date)}</span>
        </div>
        <div class="database-card-body">
          <h2>${item.available ? `<a href="article.html?id=${item.id}">${item.title}</a>` : item.title}</h2>
          <p>${item.description}</p>
        </div>
        <div class="database-card-bottom">
          <div class="tag-list">${item.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
          <div class="database-card-status mono">
            <span>${item.readTime} MIN READ</span>
            <span>${item.status}</span>
            ${item.available ? `<a href="article.html?id=${item.id}" aria-label="Read ${item.title}">READ ↗</a>` : `<span>ABSTRACT RECORD</span>`}
          </div>
        </div>
      </article>`).join("") : `
      <div class="empty-state">
        <span class="empty-symbol" aria-hidden="true">∅</span>
        <h2>No signal detected.</h2>
        <p>Try a different term or clear the active filters.</p>
      </div>`;
  };

  fieldButtons.forEach(button => button.addEventListener("click", () => {
    activeField = button.dataset.field;
    fieldButtons.forEach(item => item.classList.toggle("is-active", item === button));
    fieldButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    render();
  }));
  search.addEventListener("input", render);
  tagSelect.addEventListener("change", render);
  sortSelect.addEventListener("change", render);
  document.querySelector("[data-clear-filters]").addEventListener("click", () => {
    activeField = "all";
    search.value = "";
    tagSelect.value = "all";
    sortSelect.value = "newest";
    fieldButtons.forEach(button => button.classList.toggle("is-active", button.dataset.field === "all"));
    fieldButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.field === "all")));
    window.history.replaceState({}, "", "research.html");
    render();
  });

  const params = new URLSearchParams(window.location.search);
  const initialField = params.get("field");
  const initialQuery = params.get("q");
  if (initialField && fieldButtons.some(button => button.dataset.field === initialField)) {
    activeField = initialField;
    fieldButtons.forEach(button => button.classList.toggle("is-active", button.dataset.field === initialField));
    fieldButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.field === initialField)));
  }
  if (initialQuery) search.value = initialQuery;
  render();
});
