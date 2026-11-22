(() => {
  const $ = (id) => document.getElementById(id);
  const cards = $("cards");
  const search = $("search");
  const empty = $("empty");
  const resultCount = $("result-count");
  const dialog = $("detail-dialog");
  const dialogContent = $("dialog-content");
  let entries = [];
  let activeFilter = "all";

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);

  const statusLabel = (status) => ({
    official:"Officially sourced", community:"Community reported",
    historical:"Historical", unverified:"Unverified"
  }[status] || "Unverified");

  function render() {
    const term = search.value.trim().toLowerCase();
    const visible = entries.filter((item) => {
      const haystack = [item.name,item.description,item.category,item.unlock?.summary].join(" ").toLowerCase();
      return (activeFilter === "all" || item.status === activeFilter) && haystack.includes(term);
    }).sort((a,b) => a.name.localeCompare(b.name));

    cards.innerHTML = visible.map((item) => `
      <article class="achievement-card" tabindex="0" role="button" data-id="${escapeHTML(item.id)}" aria-label="View ${escapeHTML(item.name)} details">
        <div class="card-top"><span class="category">${escapeHTML(item.category)}</span><span class="status ${escapeHTML(item.status)}">${escapeHTML(statusLabel(item.status))}</span></div>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${escapeHTML(item.description)}</p>
        <div class="card-bottom"><span>${escapeHTML(item.system.replaceAll("_"," ").toUpperCase())}</span><span>VIEW RECORD ↗</span></div>
      </article>`).join("");
    empty.hidden = visible.length !== 0;
    resultCount.textContent = `${visible.length} RECORD${visible.length === 1 ? "" : "S"} FOUND`;
    cards.querySelectorAll(".achievement-card").forEach((card) => {
      card.addEventListener("click", () => showDetail(card.dataset.id));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); showDetail(card.dataset.id); }
      });
    });
  }

  function showDetail(id) {
    const item = entries.find((entry) => entry.id === id);
    if (!item) return;
    const sources = (item.sources || []).map((source) =>
      `<p><a class="source-link" href="${escapeHTML(source.url)}" target="_blank" rel="noreferrer">${escapeHTML(source.title)} ↗</a> <span class="category">(${escapeHTML(source.type)})</span></p>`
    ).join("");
    dialogContent.innerHTML = `
      <div class="dialog-kicker">${escapeHTML(statusLabel(item.status))} / ${escapeHTML(item.category)}</div>
      <h2 class="dialog-title">${escapeHTML(item.name)}</h2>
      <p class="dialog-description">${escapeHTML(item.description)}</p>
      <div class="unlock-box"><strong>Unlock requirement</strong><br>${escapeHTML(item.unlock?.summary || "Not yet documented.")}</div>
      <div class="category">AVAILABILITY: ${escapeHTML(item.availability || "unknown")}</div>
      ${item.notes ? `<p class="dialog-description">${escapeHTML(item.notes)}</p>` : ""}
      <h3>Sources</h3>${sources || "<p>No source recorded.</p>"}
    `;
    dialog.showModal();
  }

  document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((node) => node.classList.toggle("active", node === button));
    render();
  }));
  search.addEventListener("input", render);
  $("close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  fetch("data/achievements.json")
    .then((response) => { if (!response.ok) throw new Error("Could not load dataset"); return response.json(); })
    .then((data) => {
      entries = data.achievements || [];
      $("total-count").textContent = String(entries.length).padStart(2,"0");
      $("official-count").textContent = String(entries.filter((item) => item.status === "official").length).padStart(2,"0");
      render();
    })
    .catch(() => {
      resultCount.textContent = "DATASET COULD NOT BE LOADED";
      empty.hidden = false;
      empty.textContent = "The catalogue data could not be loaded. Please refresh or inspect the repository.";
    });
})();
