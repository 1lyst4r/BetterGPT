(async function () {
  if (window.__bettergptStarted) return;
  window.__bettergptStarted = true;

  const app = {
    state: await window.BetterGPT.storage.load(),
    panel: null,
    button: null,
    observer: null,
    async persist(options) {
      const shouldRender = !options || options.render !== false;
      window.BetterGPT.themes.apply(app.state);
      if (app.panel && shouldRender) app.panel.render();
      if (app.panel) app.panel.refreshMeta();
      window.BetterGPT.features.apply(app);
      await window.BetterGPT.storage.save(app.state);
    },
    update(id, value) {
      app.state.settings[id] = value;
      app.persist({ render: false });
    },
    open(category) {
      app.panel.open(category);
      app.button?.classList.add("is-active");
    },
    close() {
      app.panel.close();
      app.button?.classList.remove("is-active");
    },
    toggle() {
      if (app.panel.wrap.classList.contains("is-open")) app.close();
      else app.open();
    }
  };

  function createButton() {
    const button = document.createElement("button");
    button.className = "bgpt-top-button bgpt-fixed-launcher";
    button.type = "button";
    button.setAttribute("aria-label", "BetterGPT");
    button.innerHTML = `${window.BetterGPT.icon("bettergpt")}<span>BetterGPT</span>`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      app.toggle();
    });
    return button;
  }

  function createSidebarButton() {
    const button = createButton();
    button.className = "bgpt-nav-button";
    return button;
  }

  function createNavItem(reference) {
    const button = createSidebarButton();
    const tag = reference && reference.tagName;
    const rowTags = new Set(["LI", "DIV"]);
    if (!tag || !rowTags.has(tag)) return button;
    const row = document.createElement(tag.toLowerCase());
    row.className = reference.className || "";
    row.setAttribute("data-bettergpt-row", "true");
    row.appendChild(button);
    app.button = button;
    return row;
  }

  function placeButton() {
    const oldRow = document.querySelector("[data-bettergpt-row]");
    if (oldRow && document.documentElement.contains(oldRow)) return;
    if (app.button && document.documentElement.contains(app.button)) return;

    app.button = createButton();
    document.body.appendChild(app.button);

    const upgrade = window.BetterGPT.dom.findUpgradePlanItem();
    if (upgrade) positionNearUpgrade(upgrade);
  }

  function positionNearUpgrade(upgrade) {
    const rect = upgrade.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    app.button.style.top = `${Math.max(8, rect.top + (rect.height - 34) / 2)}px`;
    app.button.style.right = `${Math.max(88, window.innerWidth - rect.left + 8)}px`;
  }

  function syncButtonPosition() {
    if (!app.button) return;
    cancelAnimationFrame(syncButtonPosition.frame);
    syncButtonPosition.frame = requestAnimationFrame(() => {
      const upgrade = window.BetterGPT.dom.findUpgradePlanItem();
      if (upgrade) positionNearUpgrade(upgrade);
    });
  }

  function watch() {
    app.observer = new MutationObserver(() => {
      clearTimeout(watch.timer);
      watch.timer = setTimeout(() => {
        placeButton();
        syncButtonPosition();
        window.BetterGPT.features.apply(app);
      }, 120);
    });
    app.observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function shortcuts(event) {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "b") {
      event.preventDefault();
      app.toggle();
    }
  }

  app.panel = window.BetterGPT.createPanel(app);
  window.BetterGPT.themes.apply(app.state);
  placeButton();
  watch();
  window.BetterGPT.features.apply(app);
  document.addEventListener("keydown", shortcuts);
  window.addEventListener("resize", syncButtonPosition, { passive: true });
  window.addEventListener("scroll", syncButtonPosition, { passive: true });
})();
