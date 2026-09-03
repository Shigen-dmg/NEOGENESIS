/* Shared site chrome and restrained system interactions. */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");

  if (header) {
    header.innerHTML = `
      <nav class="nav-shell" aria-label="Primary navigation">
        <a class="brand" href="index.html">NEO<span>/</span>GENESIS</a>
        <div class="nav-links" id="nav-links">
          <a href="research.html" ${page === "research" ? 'aria-current="page"' : ""}>RESEARCH</a>
          <a href="index.html#fields">FIELDS</a>
          <a href="projects.html" ${page === "projects" ? 'aria-current="page"' : ""}>ANTHROSPHERE LAB</a>
          <a href="about.html" ${page === "about" ? 'aria-current="page"' : ""}>ABOUT</a>
          <button class="nav-mobile-search" type="button" data-open-search>SEARCH&nbsp; [ / ]</button>
        </div>
        <button class="nav-search" type="button" data-open-search aria-label="Open research search">SEARCH&nbsp; [ / ]</button>
        <button class="menu-toggle" type="button" aria-controls="nav-links" aria-expanded="false">MENU +</button>
      </nav>`;

    const toggle = header.querySelector(".menu-toggle");
    const links = header.querySelector(".nav-links");
    toggle?.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "CLOSE −" : "MENU +";
    });
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-shell">
        <p class="footer-word">NEOGENESIS</p>
        <div class="footer-grid">
          <div>
            <p>INDEPENDENT RESEARCH ARCHIVE</p>
            <p>MACHINE PSYCHOLOGY / AI / CULTURE / TECHNOLOGY</p>
            <p>SINGAPORE — EARTH</p>
          </div>
          <div>
            <a href="research.html">RESEARCH</a>
            <a href="projects.html">ANTHROSPHERE</a>
            <a href="about.html">ABOUT</a>
            <a href="about.html#contact">CONTACT</a>
          </div>
          <div>
            <p>2026 → UNKNOWN</p>
            <p class="status-dot">SYSTEM STATUS: ONLINE</p>
            <p>LAST UPDATED / 03.09.26</p>
          </div>
        </div>
      </div>`;
  }

  const research = window.NEOGENESIS_RESEARCH || [];
  const formatDate = value => new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  }).format(new Date(`${value}T00:00:00`)).toUpperCase();

  const homeResearch = document.querySelector("[data-home-research]");
  if (homeResearch) {
    homeResearch.innerHTML = research.slice(0, 6).map((item, index) => `
      <article class="research-row">
        <div class="research-seq mono">${String(index + 1).padStart(2, "0")}</div>
        <div class="research-main">
          <div class="research-topline mono">
            <span>${item.id}</span><span>${item.fieldCode} / ${item.field.toUpperCase()}</span>
          </div>
          <h3>${item.available ? `<a href="article.html?id=${item.id}">${item.title}</a>` : item.title}</h3>
          <p>${item.description}</p>
          <div class="tag-list">${item.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
        </div>
        <div class="research-aside mono">
          <span>${formatDate(item.date)}</span>
          <span>${item.readTime} MIN READ</span>
          <span class="status-label">${item.status}</span>
        </div>
      </article>`).join("");
  }

  const counters = document.querySelector("[data-counters]");
  if (counters) {
    const experiments = research.filter(item => item.status === "EXPERIMENT").length + 2;
    counters.innerHTML = `<span><b>${String(research.length).padStart(2, "0")}</b> RESEARCH DOCUMENTS</span><span><b>04</b> ACTIVE FIELDS</span><span><b>${String(experiments).padStart(2, "0")}</b> EXPERIMENTS</span>`;
  }

  const randomButtons = document.querySelectorAll("[data-random-research]");
  randomButtons.forEach(button => button.addEventListener("click", () => {
    const item = research[Math.floor(Math.random() * research.length)];
    if (!item) return;
    window.location.href = item.available
      ? `article.html?id=${item.id}`
      : `research.html?q=${encodeURIComponent(item.title)}`;
  }));

  // Native dialog keeps the global archive search keyboard accessible.
  const searchDialog = document.createElement("dialog");
  searchDialog.className = "command-dialog";
  searchDialog.setAttribute("aria-label", "Research command search");
  searchDialog.innerHTML = `
    <form method="dialog" class="command-shell">
      <div class="command-top mono"><span>NEOGENESIS / COMMAND SEARCH</span><button value="close" aria-label="Close search">ESC</button></div>
      <label class="sr-only" for="command-input">Search research</label>
      <input id="command-input" type="search" autocomplete="off" placeholder="SEARCH THE ARCHIVE…">
      <div class="command-results" data-command-results></div>
      <p class="command-hint mono">TYPE TO FILTER / ENTER TO OPEN / ↑↓ TO MOVE</p>
    </form>`;
  document.body.appendChild(searchDialog);
  const commandInput = searchDialog.querySelector("input");
  const commandResults = searchDialog.querySelector("[data-command-results]");
  let commandMatches = [];
  let activeResult = 0;

  const renderCommands = () => {
    const term = commandInput.value.trim().toLowerCase();
    commandMatches = research.filter(item => [item.id, item.title, item.field, ...item.tags].join(" ").toLowerCase().includes(term)).slice(0, 6);
    activeResult = Math.min(activeResult, Math.max(0, commandMatches.length - 1));
    commandResults.innerHTML = commandMatches.length ? commandMatches.map((item, index) => `
      <button type="button" class="command-result ${index === activeResult ? "is-active" : ""}" data-command-index="${index}">
        <span><b>${item.title}</b><small class="mono">${item.id} / ${item.field.toUpperCase()}</small></span><i>↗</i>
      </button>`).join("") : `<p class="command-empty">No matching research node.</p>`;
  };
  const openCommand = () => {
    if (searchDialog.open) return;
    searchDialog.showModal(); commandInput.value = ""; renderCommands(); requestAnimationFrame(() => commandInput.focus());
  };
  const followCommand = index => {
    const item = commandMatches[index];
    if (!item) return;
    window.location.href = item.available ? `article.html?id=${item.id}` : `research.html?q=${encodeURIComponent(item.title)}`;
  };
  document.querySelectorAll("[data-open-search]").forEach(button => button.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.remove("is-open");
    const menuToggle = document.querySelector(".menu-toggle");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.textContent = "MENU +";
    openCommand();
  }));
  document.addEventListener("keydown", event => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
    if ((event.key === "/" && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
      event.preventDefault(); openCommand();
    }
  });
  commandInput.addEventListener("input", () => { activeResult = 0; renderCommands(); });
  commandInput.addEventListener("keydown", event => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandMatches.length) return;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      activeResult = (activeResult + direction + commandMatches.length) % commandMatches.length;
      renderCommands();
    }
    if (event.key === "Enter") { event.preventDefault(); followCommand(activeResult); }
  });
  commandResults.addEventListener("click", event => {
    const button = event.target.closest("[data-command-index]");
    if (button) followCommand(Number(button.dataset.commandIndex));
  });

  const canvas = document.querySelector("[data-hero-canvas]");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let nodes = [];
    let frame = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      nodes = Array.from({ length: Math.min(42, Math.floor(canvas.clientWidth / 28)) }, (_, index) => ({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        vx: (Math.random() - .5) * .11,
        vy: (Math.random() - .5) * .11,
        hot: index % 17 === 0
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.clientWidth) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.clientHeight) node.vy *= -1;
        nodes.slice(i + 1).forEach(other => {
          const distance = Math.hypot(node.x - other.x, node.y - other.y);
          if (distance < 145) {
            ctx.strokeStyle = `rgba(239,238,232,${.12 * (1 - distance / 145)})`;
            ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke();
          }
        });
        ctx.fillStyle = node.hot ? "#ff3b18" : "rgba(239,238,232,.5)";
        ctx.fillRect(node.x - 1, node.y - 1, node.hot ? 4 : 2, node.hot ? 4 : 2);
      });
      frame = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
  }
});
