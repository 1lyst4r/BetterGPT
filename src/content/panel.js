(function () {
  function createPanel(app) {
    const icon = window.BetterGPT.icon;
    const wrap = document.createElement("div");
    wrap.className = "bgpt-shell";
    wrap.innerHTML = `
      <div class="bgpt-scrim" data-close></div>
      <aside class="bgpt-panel" role="dialog" aria-modal="true" aria-label="BetterGPT settings">
        <header class="bgpt-header">
          <div class="bgpt-brand">${icon("bettergpt")}<div><strong>BetterGPT</strong><span data-enabled>0 features enabled</span></div></div>
          <button class="bgpt-icon-button" type="button" data-close aria-label="Close BetterGPT">${icon("close")}</button>
        </header>
        <label class="bgpt-search">${icon("search")}<input type="search" placeholder="Search settings..." data-search></label>
        <div class="bgpt-body">
          <nav class="bgpt-categories" data-categories></nav>
          <main class="bgpt-content" data-content></main>
        </div>
      </aside>
    `;

    const refs = {
      wrap,
      content: wrap.querySelector("[data-content]"),
      categories: wrap.querySelector("[data-categories]"),
      search: wrap.querySelector("[data-search]"),
      enabled: wrap.querySelector("[data-enabled]")
    };

    let category = "appearance";
    let query = "";

    function setting(id) {
      return window.BetterGPT.config.settings.find((item) => item.id === id);
    }

    function value(id) {
      return app.state.settings[id];
    }

    function groups(items) {
      return items.reduce((all, item) => {
        all[item.group] = all[item.group] || [];
        all[item.group].push(item);
        return all;
      }, {});
    }

    function renderCategories() {
      refs.categories.innerHTML = window.BetterGPT.config.categories.map((item) => `
        <button type="button" class="${item.id === category ? "is-active" : ""}" data-category="${item.id}">
          ${icon(item.icon)}<span>${item.label}</span>
        </button>
      `).join("");
      refs.categories.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          category = button.dataset.category;
          query = "";
          refs.search.value = "";
          render();
        });
      });
    }

    function renderControl(item) {
      const current = value(item.id);
      if (item.type === "toggle") {
        return `<button class="bgpt-toggle ${current ? "is-on" : ""}" type="button" role="switch" aria-checked="${current}" data-setting="${item.id}"><span></span></button>`;
      }
      if (item.type === "select") {
        return `<select data-setting="${item.id}">${item.options.map((option) => `<option value="${option.value}" ${option.value === current ? "selected" : ""}>${option.label}</option>`).join("")}</select>`;
      }
      if (item.type === "range") {
        return `<div class="bgpt-range"><input type="range" min="${item.min}" max="${item.max}" step="${item.step}" value="${current}" data-setting="${item.id}"><output>${current}${item.unit || ""}</output></div>`;
      }
      if (item.type === "color") {
        return `<input type="color" value="${current}" data-setting="${item.id}">`;
      }
      if (item.type === "textarea") {
        return `<textarea rows="7" spellcheck="false" data-setting="${item.id}">${String(current || "")}</textarea>`;
      }
      if (item.type === "file") {
        return `<button type="button" class="bgpt-secondary" data-file="${item.id}">${icon("upload")}<span>Choose image</span></button>`;
      }
      return `<input type="text" value="${String(current || "").replace(/"/g, "&quot;")}" data-setting="${item.id}">`;
    }

    function renderSettings(items) {
      const byGroup = groups(items);
      return Object.entries(byGroup).map(([name, groupItems]) => `
        <section class="bgpt-section">
          <h2>${name}</h2>
          ${groupItems.map((item) => `
            <div class="bgpt-row">
              <div>
                <label>${item.label}${item.experimental ? '<small>Experimental</small>' : ""}</label>
                <p>${item.description}</p>
              </div>
              ${renderControl(item)}
            </div>
          `).join("")}
        </section>
      `).join("");
    }

    function renderThemeEditor() {
      const theme = window.BetterGPT.themes.getTheme(app.state);
      const colors = ["bg", "surface", "text", "muted", "accent", "button", "buttonHover", "user", "assistant", "input", "border"];
      return `
        <section class="bgpt-section">
          <h2>Custom theme creator</h2>
          <div class="bgpt-theme-preview" style="--preview-bg:${theme.colors.bg || "var(--bgpt-surface, #fff)"};--preview-accent:${theme.colors.accent || "var(--bgpt-accent)"}">
            <span></span><strong>Live preview</strong><p>Theme changes apply immediately when saved.</p>
          </div>
          <div class="bgpt-color-grid">
            ${colors.map((name) => `<label><span>${name}</span><input type="color" data-theme-color="${name}" value="${normalizeColor(theme.colors[name])}"></label>`).join("")}
          </div>
          <div class="bgpt-actions">
            <button type="button" data-save-theme>${icon("plus")}<span>Save as custom theme</span></button>
            <button type="button" data-export-theme>${icon("download")}<span>Export theme</span></button>
            <button type="button" data-import-theme>${icon("upload")}<span>Import theme</span></button>
          </div>
        </section>
      `;
    }

    function renderPrompts() {
      return `
        <section class="bgpt-section">
          <h2>Prompt manager</h2>
          <div class="bgpt-prompt-editor">
            <input type="text" placeholder="Prompt name" data-prompt-name>
            <input type="text" placeholder="Category" data-prompt-category>
            <textarea rows="5" placeholder="Prompt text" data-prompt-text></textarea>
            <button type="button" data-add-prompt>${icon("plus")}<span>Add prompt</span></button>
          </div>
          <div class="bgpt-list">
            ${app.state.prompts.map((prompt) => `
              <article>
                <div><strong>${escapeHtml(prompt.name)}</strong><span>${escapeHtml(prompt.category || "General")}</span></div>
                <p>${escapeHtml(prompt.text).slice(0, 160)}</p>
                <div class="bgpt-actions">
                  <button type="button" data-insert-prompt="${prompt.id}">${icon("arrowRight")}<span>Insert</span></button>
                  <button type="button" data-copy-prompt="${prompt.id}">${icon("copy")}<span>Copy</span></button>
                  <button type="button" data-delete-prompt="${prompt.id}">${icon("trash")}<span>Delete</span></button>
                </div>
              </article>
            `).join("")}
          </div>
        </section>
        ${app.state.settings["productivity.quickActions"] ? `
        <section class="bgpt-section">
          <h2>Quick actions</h2>
          <div class="bgpt-action-grid">
            ${app.state.quickActions.map((action) => `<button type="button" data-action="${action.id}">${icon(action.icon)}<span>${escapeHtml(action.name)}</span></button>`).join("")}
          </div>
        </section>
        ` : `
        <section class="bgpt-section">
          <h2>Quick actions</h2>
          <p class="bgpt-hint">Quick actions are turned off. Enable "Quick actions" above to use them.</p>
        </section>
        `}
      `;
    }

    function renderTools() {
      if (!app.state.settings["tools.enabled"]) {
        return `
          <section class="bgpt-section">
            <h2>Utility shelf</h2>
            <p class="bgpt-hint">Tools are turned off. Enable "Enable tools" above to use the utility shelf.</p>
          </section>
        `;
      }
      const toolLabels = {
        json: "JSON formatter",
        markdown: "Markdown preview",
        counter: "Character and word counter",
        regex: "Regex tester",
        base64: "Base64 encoder/decoder",
        url: "URL encoder/decoder",
        timestamp: "Timestamp converter"
      };
      const defaultTool = app.state.settings["tools.defaultTool"] || "json";
      return `
        <section class="bgpt-section">
          <h2>Utility shelf</h2>
          <div class="bgpt-tool">
            <select data-tool>
              ${Object.entries(toolLabels).map(([value, label]) => `<option value="${value}" ${value === defaultTool ? "selected" : ""}>${label}</option>`).join("")}
            </select>
            <input type="text" placeholder="Regex pattern or mode when needed" data-tool-extra>
            <textarea rows="7" placeholder="Paste text here" data-tool-input></textarea>
            <div class="bgpt-actions"><button type="button" data-run-tool>${icon("bolt")}<span>Run</span></button><button type="button" data-copy-tool>${icon("copy")}<span>Copy result</span></button></div>
            <pre data-tool-output></pre>
          </div>
        </section>
      `;
    }

    function renderNotifications() {
      return `
        <section class="bgpt-section">
          <h2>Test notifications</h2>
          <p class="bgpt-hint">Try your current notification and sound settings.</p>
          <div class="bgpt-actions">
            <button type="button" data-test-notification>${icon("bell")}<span>Send test notification</span></button>
            <button type="button" data-test-sound>${icon("bolt")}<span>Play test sound</span></button>
          </div>
        </section>
      `;
    }

    function renderConvoList(items, kind) {
      return `
        <div class="bgpt-list">
          ${items.map((item) => `
            <article>
              <div><strong>${escapeHtml(item.title)}</strong></div>
              <div class="bgpt-actions">
                <button type="button" data-open-convo="${escapeHtml(item.href)}">${icon("arrowRight")}<span>Open</span></button>
                <button type="button" data-remove-convo="${item.id}" data-convo-kind="${kind}">${icon("trash")}<span>Remove</span></button>
              </div>
            </article>
          `).join("")}
        </div>
      `;
    }

    function renderNavigation() {
      const pins = app.state.pins || [];
      const favorites = app.state.favorites || [];
      return `
        <section class="bgpt-section">
          <h2>Pinned conversations</h2>
          ${pins.length ? renderConvoList(pins, "pin") : `<p class="bgpt-hint">Hover a conversation in the sidebar and use the pin button to save it here.</p>`}
        </section>
        <section class="bgpt-section">
          <h2>Favorite conversations</h2>
          ${favorites.length ? renderConvoList(favorites, "favorite") : `<p class="bgpt-hint">Hover a conversation in the sidebar and use the star button to save it here.</p>`}
        </section>
      `;
    }

    function renderSystem() {
      const diagnostics = {
        version: chrome.runtime.getManifest().version,
        chrome: navigator.userAgent.match(/Chrome\/([\d.]+)/)?.[1] || "Unknown",
        enabledFeatures: enabledCount(),
        sidebar: Boolean(window.BetterGPT.dom.findSidebar()),
        codexItem: Boolean(window.BetterGPT.dom.findCodexItem()),
        url: location.origin
      };
      return `
        <section class="bgpt-section">
          <h2>Settings</h2>
          <div class="bgpt-actions">
            <button type="button" data-export-settings>${icon("download")}<span>Export settings</span></button>
            <button type="button" data-import-settings>${icon("upload")}<span>Import settings</span></button>
            <button type="button" data-reset-settings>${icon("trash")}<span>Reset all settings</span></button>
          </div>
        </section>
        <section class="bgpt-section">
          <h2>Backup and restore</h2>
          <div class="bgpt-actions">
            <button type="button" data-create-backup>${icon("plus")}<span>Create backup</span></button>
            <button type="button" data-export-backup>${icon("download")}<span>Export backup</span></button>
            <button type="button" data-import-backup>${icon("upload")}<span>Import backup</span></button>
          </div>
        </section>
        <section class="bgpt-section">
          <h2>Diagnostics</h2>
          <pre class="bgpt-diagnostics">${escapeHtml(JSON.stringify(diagnostics, null, 2))}</pre>
          <button type="button" data-copy-diagnostics>${icon("copy")}<span>Copy diagnostics</span></button>
        </section>
      `;
    }

    function normalizeColor(value) {
      return /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#10a37f";
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
    }

    function enabledCount() {
      return window.BetterGPT.config.settings.filter((item) => item.type === "toggle" && app.state.settings[item.id]).length;
    }

    function refreshMeta() {
      refs.enabled.textContent = `${enabledCount()} features enabled`;
    }

    function render() {
      renderCategories();
      refreshMeta();
      const all = window.BetterGPT.config.settings.filter((item) => !query ? item.category === category : `${item.label} ${item.description} ${item.group}`.toLowerCase().includes(query));
      refs.content.innerHTML = [
        renderSettings(all),
        category === "appearance" && !query ? renderThemeEditor() : "",
        category === "productivity" && !query ? renderPrompts() : "",
        category === "navigation" && !query ? renderNavigation() : "",
        category === "tools" && !query ? renderTools() : "",
        category === "notifications" && !query ? renderNotifications() : "",
        category === "system" && !query ? renderSystem() : ""
      ].join("");
      bindControls();
    }

    function bindControls() {
      refs.content.querySelectorAll("[data-setting]").forEach((control) => {
        const item = setting(control.dataset.setting);
        const event = item.type === "range" ? "input" : "change";
        if (item.type === "toggle") {
          control.addEventListener("click", () => {
            const next = !app.state.settings[item.id];
            control.classList.toggle("is-on", next);
            control.setAttribute("aria-checked", String(next));
            app.update(item.id, next);
            const speed = Number(app.state.settings["system.animSpeed"]) || 220;
            setTimeout(() => { if (refs.wrap.classList.contains("is-open")) render(); }, speed);
          });
        } else {
          control.addEventListener(event, () => {
            if (item.type === "range") {
              control.closest(".bgpt-range")?.querySelector("output")?.replaceChildren(`${control.value}${item.unit || ""}`);
              app.update(item.id, Number(control.value));
            } else {
              app.update(item.id, control.value);
            }
          });
        }
      });
      refs.content.querySelectorAll("[data-file]").forEach((button) => {
        button.addEventListener("click", async () => {
          const file = await window.BetterGPT.dom.pickFile("image/png,image/jpeg,image/webp,image/gif");
          if (!file) return;
          app.state.settings[button.dataset.file] = await window.BetterGPT.dom.readFile(file);
          app.state.settings["appearance.image.enabled"] = true;
          app.persist();
        });
      });
      refs.content.querySelector("[data-save-theme]")?.addEventListener("click", () => {
        const colors = {};
        refs.content.querySelectorAll("[data-theme-color]").forEach((input) => { colors[input.dataset.themeColor] = input.value; });
        const custom = { id: crypto.randomUUID(), name: `Custom ${app.state.customThemes.length + 1}`, version: 1, colors, effects: { blur: 0, opacity: 1, radius: 12 } };
        app.state.customThemes.push(custom);
        app.state.settings["appearance.theme"] = custom.id;
        app.persist();
      });
      refs.content.querySelector("[data-export-theme]")?.addEventListener("click", () => {
        window.BetterGPT.dom.download("bettergpt-theme.json", JSON.stringify(window.BetterGPT.themes.getTheme(app.state), null, 2));
      });
      refs.content.querySelector("[data-import-theme]")?.addEventListener("click", async () => {
        try {
          const file = await window.BetterGPT.dom.pickFile("application/json");
          if (!file) return;
          const theme = window.BetterGPT.storage.validateTheme(JSON.parse(await window.BetterGPT.dom.readFile(file, true)));
          if (!theme) return;
          app.state.customThemes.push(theme);
          app.state.settings["appearance.theme"] = theme.id;
          app.persist();
        } catch (error) {
          console.warn("BetterGPT theme import failed", error);
        }
      });
      refs.content.querySelector("[data-add-prompt]")?.addEventListener("click", () => {
        const name = refs.content.querySelector("[data-prompt-name]").value.trim();
        const text = refs.content.querySelector("[data-prompt-text]").value.trim();
        if (!name || !text) return;
        app.state.prompts.push({ id: crypto.randomUUID(), name, text, category: refs.content.querySelector("[data-prompt-category]").value.trim() || "General", favorite: false });
        app.persist();
      });
      refs.content.querySelectorAll("[data-insert-prompt]").forEach((button) => button.addEventListener("click", () => {
        const prompt = app.state.prompts.find((item) => item.id === button.dataset.insertPrompt);
        if (prompt) window.BetterGPT.dom.appendComposerText(prompt.text);
      }));
      refs.content.querySelectorAll("[data-copy-prompt]").forEach((button) => button.addEventListener("click", () => {
        const prompt = app.state.prompts.find((item) => item.id === button.dataset.copyPrompt);
        if (prompt) navigator.clipboard.writeText(prompt.text);
      }));
      refs.content.querySelectorAll("[data-delete-prompt]").forEach((button) => button.addEventListener("click", () => {
        app.state.prompts = app.state.prompts.filter((item) => item.id !== button.dataset.deletePrompt);
        app.persist();
      }));
      refs.content.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
        const action = app.state.quickActions.find((item) => item.id === button.dataset.action);
        if (action) window.BetterGPT.dom.appendComposerText(action.prompt);
      }));
      refs.content.querySelector("[data-run-tool]")?.addEventListener("click", runTool);
      refs.content.querySelector("[data-copy-tool]")?.addEventListener("click", () => navigator.clipboard.writeText(refs.content.querySelector("[data-tool-output]").textContent || ""));
      refs.content.querySelector("[data-export-settings]")?.addEventListener("click", () => window.BetterGPT.dom.download("bettergpt-settings.json", JSON.stringify(app.state, null, 2)));
      refs.content.querySelector("[data-import-settings]")?.addEventListener("click", importSettings);
      refs.content.querySelector("[data-reset-settings]")?.addEventListener("click", () => { app.state = window.BetterGPT.storage.defaults(); app.persist(); });
      refs.content.querySelector("[data-create-backup]")?.addEventListener("click", () => { app.state.backups.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), state: JSON.parse(JSON.stringify(app.state)) }); app.persist(); });
      refs.content.querySelector("[data-export-backup]")?.addEventListener("click", () => window.BetterGPT.dom.download("bettergpt-backup.json", JSON.stringify(app.state, null, 2)));
      refs.content.querySelector("[data-import-backup]")?.addEventListener("click", importBackup);
      refs.content.querySelector("[data-copy-diagnostics]")?.addEventListener("click", () => navigator.clipboard.writeText(refs.content.querySelector(".bgpt-diagnostics").textContent));
      refs.content.querySelector("[data-test-notification]")?.addEventListener("click", () => window.BetterGPT.features.sendTestNotification(app));
      refs.content.querySelector("[data-test-sound]")?.addEventListener("click", () => window.BetterGPT.features.playTestSound());
      refs.content.querySelectorAll("[data-open-convo]").forEach((button) => button.addEventListener("click", () => {
        window.location.href = button.dataset.openConvo;
        app.close();
      }));
      refs.content.querySelectorAll("[data-remove-convo]").forEach((button) => button.addEventListener("click", () => {
        const id = button.dataset.removeConvo;
        if (button.dataset.convoKind === "pin") app.state.pins = app.state.pins.filter((item) => item.id !== id);
        else app.state.favorites = app.state.favorites.filter((item) => item.id !== id);
        app.persist();
      }));
    }

    function runTool() {
      const tool = refs.content.querySelector("[data-tool]").value;
      const input = refs.content.querySelector("[data-tool-input]").value;
      const extra = refs.content.querySelector("[data-tool-extra]").value;
      const out = refs.content.querySelector("[data-tool-output]");
      const tools = window.BetterGPT.tools;
      if (tool === "json") out.textContent = tools.jsonTool(input);
      if (tool === "markdown") out.innerHTML = tools.markdownTool(input);
      if (tool === "counter") out.textContent = tools.counterTool(input);
      if (tool === "regex") out.textContent = tools.regexTool(input, extra);
      if (tool === "base64") out.textContent = tools.base64Tool(input, /decode/i.test(extra) ? "decode" : "encode");
      if (tool === "url") out.textContent = tools.urlTool(input, /decode/i.test(extra) ? "decode" : "encode");
      if (tool === "timestamp") out.textContent = tools.timestampTool(input);
    }

    async function importSettings() {
      try {
        const file = await window.BetterGPT.dom.pickFile("application/json");
        if (!file) return;
        const payload = JSON.parse(await window.BetterGPT.dom.readFile(file, true));
        const clean = window.BetterGPT.storage.validateSettings(payload);
        if (!clean) return;
        app.state.settings = { ...app.state.settings, ...clean };
        app.persist();
      } catch (error) {
        console.warn("BetterGPT settings import failed", error);
      }
    }

    async function importBackup() {
      try {
        const file = await window.BetterGPT.dom.pickFile("application/json");
        if (!file) return;
        const payload = JSON.parse(await window.BetterGPT.dom.readFile(file, true));
        if (!payload || !payload.settings) return;
        const clean = window.BetterGPT.storage.validateSettings(payload);
        app.state = { ...app.state, ...payload, settings: { ...app.state.settings, ...clean } };
        app.persist();
      } catch (error) {
        console.warn("BetterGPT backup import failed", error);
      }
    }

    refs.search.addEventListener("input", () => {
      query = refs.search.value.trim().toLowerCase();
      render();
    });
    wrap.querySelectorAll("[data-close]").forEach((node) => node.addEventListener("click", () => app.close()));

    refs.open = (nextCategory) => {
      category = nextCategory || category;
      render();
      wrap.classList.add("is-open");
    };
    refs.close = () => wrap.classList.remove("is-open");
    refs.render = render;
    refs.refreshMeta = refreshMeta;
    document.body.appendChild(wrap);
    smoothWheel(refs.content);
    smoothWheel(refs.categories);
    render();
    return refs;
  }

  function smoothWheel(node) {
    let target = 0;
    let current = 0;
    let frame = 0;

    function step() {
      current += (target - current) * 0.22;
      node.scrollTop = current;
      if (Math.abs(target - current) > 0.5) {
        frame = requestAnimationFrame(step);
      } else {
        node.scrollTop = target;
        frame = 0;
      }
    }

    node.addEventListener("wheel", (event) => {
      if (document.documentElement.classList.contains("bgpt-reduced-motion")) return;
      if (event.target.closest("textarea, select, input, pre")) return;
      const max = node.scrollHeight - node.clientHeight;
      if (max <= 0) return;
      event.preventDefault();
      current = node.scrollTop;
      target = frame ? target : current;
      target = Math.max(0, Math.min(max, target + event.deltaY));
      if (!frame) frame = requestAnimationFrame(step);
    }, { passive: false });
  }

  window.BetterGPT = window.BetterGPT || {};
  window.BetterGPT.createPanel = createPanel;
})();
