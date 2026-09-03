/* Article-only behaviors: automatic contents, reading progress, related nodes. */
document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector(".article-body");
  const toc = document.querySelector("[data-table-of-contents]");
  const progress = document.querySelector("[data-reading-progress]");
  if (!body || !toc || !progress) return;

  const headings = [...body.querySelectorAll(":scope > h2")];
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = `section-${index + 1}`;
  });
  toc.innerHTML = headings.map((heading, index) => `<a href="#${heading.id}"><span>${String(index + 1).padStart(2, "0")}</span>${heading.textContent.replace(/^\d+\.\s*/, "")}</a>`).join("");
  const tocLinks = [...toc.querySelectorAll("a")];

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
  const relatedItems = (window.NEOGENESIS_RESEARCH || []).filter(item => item.id !== "NG-R001" && item.fieldSlug === "machine-psychology").slice(0, 2);
  related.innerHTML = relatedItems.map(item => `
    <article>
      <div class="mono"><span>${item.id}</span><span>${item.status}</span></div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="research.html?q=${encodeURIComponent(item.title)}">VIEW ABSTRACT RECORD ↗</a>
    </article>`).join("");
});
