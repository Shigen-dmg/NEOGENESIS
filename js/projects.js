/* Project records and the local project-detail dialog. */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;

  const projects = [
    {
      id: "AS-X001", name: "Research Agent 001", status: "ACTIVE", year: "2026", visual: "agent",
      description: "A constrained research agent that maps sources, flags uncertainty, and preserves a traceable evidence path for human review.",
      technologies: ["LLM", "Retrieval", "Structured Outputs"],
      note: "The active prototype focuses on bounded research tasks and visible provenance. It is being evaluated for source coverage, unsupported claims, and the quality of its uncertainty reporting.",
      research: "AnthroSphere Experimental Agent 001"
    },
    {
      id: "AS-X002", name: "Mirror Protocol", status: "EXPERIMENT", year: "2026", visual: "mirror",
      description: "An experimental interface for comparing how language models describe identity, continuity, and their own apparent behavior.",
      technologies: ["JavaScript", "Model APIs", "Evaluation"],
      note: "Mirror Protocol is a research interface, not a diagnostic instrument. Sessions compare prompt conditions and surface response variance without assigning psychological states to the model.",
      research: null
    },
    {
      id: "AS-X003", name: "SME Flow Engine", status: "PROTOTYPE", year: "2026", visual: "flow",
      description: "A modular automation study for repetitive small-business operations, designed around human checkpoints and recoverable actions.",
      technologies: ["Automation", "Agents", "Human-in-the-loop"],
      note: "This prototype explores whether small automation units can remain understandable as workflows grow. Each consequential action requires an explicit human checkpoint.",
      research: null
    },
    {
      id: "AS-X000", name: "Synthetic Persona Atlas", status: "ARCHIVED", year: "2025", visual: "atlas",
      description: "An early catalog of recurring personalities, metaphors, and self-descriptions produced across controlled model conversations.",
      technologies: ["Qualitative Coding", "Embeddings", "Archive"],
      note: "Archived after the initial classification scheme proved too sensitive to prompt wording. The record is retained because that failure informed the current machine-psychology method.",
      research: null
    }
  ];

  grid.innerHTML = projects.map(project => `
    <article class="project-card">
      <div class="project-visual project-visual--${project.visual}" aria-label="Abstract interface placeholder for ${project.name}" role="img">
        <span class="project-visual-code mono">${project.id} / INTERFACE CAPTURE</span>
        <i></i><i></i><i></i><i></i>
      </div>
      <div class="project-card-copy">
        <div class="project-card-meta mono"><span>${project.id}</span><span class="project-status">${project.status}</span><span>${project.year}</span></div>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="tag-list">${project.technologies.map(tech => `<span>${tech}</span>`).join("")}</div>
        <div class="project-actions">
          <button type="button" data-view-project="${project.id}">VIEW PROJECT ↗</button>
          ${project.research ? `<a href="research.html?q=${encodeURIComponent(project.research)}">READ RESEARCH →</a>` : `<span>RESEARCH NOTE / FORTHCOMING</span>`}
        </div>
      </div>
    </article>`).join("");

  const dialog = document.createElement("dialog");
  dialog.className = "project-dialog";
  dialog.setAttribute("aria-label", "Project record");
  dialog.innerHTML = `<div data-project-dialog-content></div>`;
  document.body.appendChild(dialog);

  grid.addEventListener("click", event => {
    const trigger = event.target.closest("[data-view-project]");
    if (!trigger) return;
    const project = projects.find(item => item.id === trigger.dataset.viewProject);
    if (!project) return;
    dialog.querySelector("[data-project-dialog-content]").innerHTML = `
      <div class="project-dialog-top mono"><span>${project.id} / PROJECT RECORD</span><button type="button" data-close-project aria-label="Close project record">CLOSE ×</button></div>
      <div class="project-dialog-body">
        <div class="project-dialog-status mono"><span>STATUS</span><b>${project.status}</b><span>YEAR</span><b>${project.year}</b></div>
        <h2>${project.name}</h2>
        <p>${project.note}</p>
        <div class="tag-list">${project.technologies.map(tech => `<span>${tech}</span>`).join("")}</div>
      </div>`;
    dialog.showModal();
    dialog.querySelector("[data-close-project]").addEventListener("click", () => dialog.close(), { once: true });
  });
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
});
