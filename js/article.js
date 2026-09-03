/* Article rendering, automatic contents, reading progress, and related nodes. */
document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector(".article-body");
  const toc = document.querySelector("[data-table-of-contents]");
  const progress = document.querySelector("[data-reading-progress]");
  if (!body || !toc || !progress) return;

  const research = window.NEOGENESIS_RESEARCH || [];
  const articles = window.NEOGENESIS_ARTICLES || {};
  const requestedId = (new URLSearchParams(window.location.search).get("id") || "NG-R001").toUpperCase();
  const item = research.find(record => record.id === requestedId) || research[0];
  const content = articles[item.id];

  const formatDate = value => new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(new Date(`${value}T00:00:00`)).toUpperCase();

  if (requestedId !== item.id) {
    window.history.replaceState({}, "", `article.html?id=${item.id}`);
  }

  // NG-R001 is hand-composed in article.html. Other records are rendered here.
  if (content) {
    document.title = `${item.title} — NEOGENESIS`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", item.description);
    document.querySelector("[data-article-register]").textContent = `ARCHIVE / ${item.id}`;
    document.querySelector("[data-article-field]").textContent = `${item.fieldCode} / ${item.field.toUpperCase()}`;
    document.querySelector("[data-article-title]").textContent = item.title;
    document.querySelector("[data-article-subtitle]").textContent = content.subtitle;
    document.querySelector("[data-article-author]").textContent = "SHIGEN / ANTHROSPHERE";
    document.querySelector("[data-article-date]").textContent = formatDate(item.date);
    document.querySelector("[data-article-time]").textContent = `${item.readTime} MINUTES`;
    document.querySelector("[data-article-status]").textContent = item.status;

    const cover = document.querySelector("[data-article-cover]");
    cover.src = content.cover;
    cover.alt = content.coverAlt;
    document.querySelector("[data-article-cover-caption]").textContent = content.coverCaption;

    body.innerHTML = `
      <section class="abstract" aria-labelledby="abstract-title">
        <p class="mono" id="abstract-title">ABSTRACT</p>
        <p>${content.abstract}</p>
        <div class="article-keywords mono">KEYWORDS / ${content.keywords.join(" / ")}</div>
      </section>
      ${content.sections.map((section, index) => `
        <h2>${String(index + 1).padStart(2, "0")}. ${section.title}</h2>
        ${section.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join("")}
        ${index === 0 ? `
          <blockquote>
            <p>“${content.quote}”</p>
            <cite class="mono">RESEARCH NOTE / ${item.id}</cite>
          </blockquote>` : ""}
        ${index === 2 ? `
          <figure class="article-plate article-plate--compact">
            <img src="${content.cover === "assets/latent-self-model.png" ? "assets/research-self-appearance.png" : "assets/latent-self-model.png"}" loading="lazy" alt="Abstract NEOGENESIS research plate with archival texture and diagnostic geometry">
            <figcaption class="mono"><span>FIG. 02 / INTERPRETIVE RESEARCH PLATE</span><span>NOT A MEASUREMENT / VISUAL ANALOGY</span></figcaption>
          </figure>` : ""}
        ${index === 3 ? `
          <div class="pull-stat">
            <span class="mono">PROPOSITION / ${item.id}</span>
            <p>${content.statement}</p>
          </div>` : ""}
      `).join("")}
      <section class="references" aria-labelledby="references-title">
        <h2 id="references-title">References &amp; further reading</h2>
        <ol>${content.references.map(reference => `<li>${reference}</li>`).join("")}</ol>
      </section>`;
  }

  const headings = [...body.querySelectorAll(":scope > h2")];
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = `section-${index + 1}`;
  });
  toc.innerHTML = headings.map((heading, index) => `<a href="#${heading.id}"><span>${String(index + 1).padStart(2, "0")}</span>${heading.textContent.replace(/^\d+\.\s*/, "")}</a>`).join("");
  const tocLinks = [...toc.querySelectorAll("a")];

  document.querySelector("[data-toc-document]").textContent = `DOC / ${item.id}`;
  const wordCount = body.innerText.trim().split(/\s+/).length;
  document.querySelector("[data-toc-words]").textContent = `WORDS / ${wordCount.toLocaleString("en-US")}`;
  document.querySelector("[data-toc-figures]").textContent = `FIGURES / ${String(document.querySelectorAll("article figure").length).padStart(2, "0")}`;

  const update = () => {
    const articleTop = body.getBoundingClientRect().top + window.scrollY;
    const articleHeight = body.offsetHeight - window.innerHeight;
    const amount = Math.max(0, Math.min(1, (window.scrollY - articleTop + 100) / Math.max(1, articleHeight)));
    progress.style.transform = `scaleX(${amount})`;

    let current = headings[0]?.id;
    headings.forEach(heading => {
      if (heading.getBoundingClientRect().top < window.innerHeight * .38) current = heading.id;
    });
    tocLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`));
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });

  const related = document.querySelector("[data-related-research]");
  const sameField = research.filter(record => record.id !== item.id && record.fieldSlug === item.fieldSlug);
  const fallback = research.filter(record => record.id !== item.id && record.fieldSlug !== item.fieldSlug);
  const relatedItems = [...sameField, ...fallback].slice(0, 2);
  related.innerHTML = relatedItems.map(record => `
    <article>
      <div class="mono"><span>${record.id}</span><span>${record.status}</span></div>
      <h3>${record.title}</h3>
      <p>${record.description}</p>
      <a href="article.html?id=${record.id}">READ RESEARCH ↗</a>
    </article>`).join("");
});
