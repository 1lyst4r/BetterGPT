(function () {
  const key = "bettergpt.state";
  const api = typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

  function defaults() {
    const settings = {};
    window.BetterGPT.config.settings.forEach((item) => {
      settings[item.id] = item.value;
    });
    return {
      version: 1,
      settings,
      customThemes: [],
      prompts: [
        { id: crypto.randomUUID(), name: "Clarify", category: "Writing", favorite: true, text: "Rewrite this so it is clearer and easier to act on:\n\n" },
        { id: crypto.randomUUID(), name: "Code review", category: "Engineering", favorite: true, text: "Review this code for correctness, maintainability, and missing tests:\n\n" }
      ],
      quickActions: window.BetterGPT.config.quickActions,
      pins: [],
      favorites: [],
      backups: [],
      diagnostics: []
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function merge(base, saved) {
    const state = clone(base);
    if (!saved || typeof saved !== "object") return state;
    state.version = Number(saved.version) || state.version;
    state.settings = { ...state.settings, ...(saved.settings || {}) };
    state.customThemes = Array.isArray(saved.customThemes) ? saved.customThemes : state.customThemes;
    state.prompts = Array.isArray(saved.prompts) ? saved.prompts : state.prompts;
    state.quickActions = Array.isArray(saved.quickActions) ? saved.quickActions : state.quickActions;
    state.pins = Array.isArray(saved.pins) ? saved.pins : state.pins;
    state.favorites = Array.isArray(saved.favorites) ? saved.favorites : state.favorites;
    state.backups = Array.isArray(saved.backups) ? saved.backups : state.backups;
    state.diagnostics = Array.isArray(saved.diagnostics) ? saved.diagnostics : state.diagnostics;
    return state;
  }

  function load() {
    return new Promise((resolve) => {
      const base = defaults();
      if (!api) {
        resolve(base);
        return;
      }
      api.get(key, (result) => resolve(merge(base, result[key])));
    });
  }

  function save(state) {
    return new Promise((resolve) => {
      if (!api) {
        resolve();
        return;
      }
      api.set({ [key]: state }, resolve);
    });
  }

  function validateSettings(payload) {
    if (!payload || typeof payload !== "object") return null;
    const allowed = new Map(window.BetterGPT.config.settings.map((item) => [item.id, item]));
    const clean = {};
    Object.entries(payload.settings || payload).forEach(([id, value]) => {
      const item = allowed.get(id);
      if (!item) return;
      if (item.type === "toggle" && typeof value === "boolean") clean[id] = value;
      if (["text", "textarea", "select", "color", "file"].includes(item.type) && typeof value === "string") clean[id] = value.slice(0, item.type === "textarea" ? 24000 : 12000);
      if (item.type === "range" && Number.isFinite(Number(value))) clean[id] = Math.min(item.max, Math.max(item.min, Number(value)));
    });
    return clean;
  }

  function validateTheme(theme) {
    if (!theme || typeof theme !== "object") return null;
    const name = String(theme.name || "").trim().slice(0, 64);
    if (!name) return null;
    const colors = theme.colors && typeof theme.colors === "object" ? theme.colors : {};
    const safeColors = {};
    Object.entries(colors).forEach(([name, value]) => {
      if (/^[a-zA-Z][\w-]{0,30}$/.test(name) && typeof value === "string" && value.length < 120) safeColors[name] = value;
    });
    return {
      id: theme.id || crypto.randomUUID(),
      name,
      version: 1,
      colors: safeColors,
      gradient: typeof theme.gradient === "object" && theme.gradient ? theme.gradient : {},
      background: typeof theme.background === "object" && theme.background ? theme.background : {},
      typography: typeof theme.typography === "object" && theme.typography ? theme.typography : {},
      effects: typeof theme.effects === "object" && theme.effects ? theme.effects : {},
      spacing: typeof theme.spacing === "object" && theme.spacing ? theme.spacing : {}
    };
  }

  window.BetterGPT = window.BetterGPT || {};
  window.BetterGPT.storage = { load, save, defaults, validateSettings, validateTheme };
})();
