(function () {
  let customStyle;
  let userStyle;
  let bgLayer;

  function ensureStyle() {
    if (!customStyle) {
      customStyle = document.createElement("style");
      customStyle.id = "bettergpt-theme-style";
      document.documentElement.appendChild(customStyle);
    }
    if (!userStyle) {
      userStyle = document.createElement("style");
      userStyle.id = "bettergpt-custom-css";
      document.documentElement.appendChild(userStyle);
    }
    if (!bgLayer) {
      bgLayer = document.createElement("div");
      bgLayer.className = "bgpt-background";
      (document.body || document.documentElement).prepend(bgLayer);
    }
  }

  function getTheme(state) {
    const id = state.settings["appearance.theme"];
    return window.BetterGPT.config.themes.find((theme) => theme.id === id) || state.customThemes.find((theme) => theme.id === id) || window.BetterGPT.config.themes[0];
  }

  function cssVars(theme, state) {
    const colors = theme.colors || {};
    const effects = theme.effects || {};
    const lines = [
      `--bgpt-accent:${state.settings["appearance.accent"] || colors.accent || "#10a37f"}`,
      `--bgpt-panel-width:${state.settings["system.panelWidth"]}px`,
      `--bgpt-panel-blur:${state.settings["system.panelBlur"]}px`,
      `--bgpt-speed:${state.settings["system.animSpeed"]}ms`,
      `--bgpt-chat-width:${state.settings["chat.fullWidth"] ? "min(100%, 1280px)" : `${state.settings["chat.width"]}px`}`,
      `--bgpt-chat-font:${state.settings["chat.fontSize"]}px`,
      `--bgpt-chat-space:${state.settings["chat.spacing"]}px`,
      `--bgpt-line-height:${state.settings["accessibility.lineHeight"]}`,
      `--bgpt-theme-blur:${Number(effects.blur || 0)}px`,
      `--bgpt-theme-opacity:${Number(effects.opacity || 1)}`,
      `--bgpt-theme-radius:${Number(effects.radius || 12)}px`
    ];
    Object.entries(colors).forEach(([name, value]) => {
      if (value) lines.push(`--bgpt-${name}:${value}`);
    });
    return `:root{${lines.join(";")}}`;
  }

  function gradientValue(state) {
    const preset = window.BetterGPT.config.gradients.find((item) => item.id === state.settings["appearance.gradient.preset"]) || window.BetterGPT.config.gradients[0];
    const angle = state.settings["appearance.gradient.angle"];
    return preset.value.replace(/linear-gradient\(\d+deg/i, `linear-gradient(${angle}deg`);
  }

  function apply(state) {
    ensureStyle();
    const theme = getTheme(state);
    const flags = [
      state.settings["appearance.compact"] ? "bgpt-compact" : "",
      state.settings["appearance.rounded"] ? "bgpt-rounded" : "",
      state.settings["chat.focusMode"] ? "bgpt-focus-mode" : "",
      state.settings["chat.smoothMessages"] ? "bgpt-smooth-messages" : "",
      state.settings["accessibility.highContrast"] ? "bgpt-high-contrast" : "",
      state.settings["accessibility.reducedMotion"] ? "bgpt-reduced-motion" : "",
      state.settings["accessibility.focusRing"] ? "bgpt-focus-ring" : "",
      state.settings["accessibility.dyslexiaFont"] ? "bgpt-dyslexia-font" : ""
    ].filter(Boolean);

    document.documentElement.classList.remove("bgpt-compact", "bgpt-rounded", "bgpt-focus-mode", "bgpt-smooth-messages", "bgpt-high-contrast", "bgpt-reduced-motion", "bgpt-focus-ring", "bgpt-dyslexia-font");
    flags.forEach((flag) => document.documentElement.classList.add(flag));
    customStyle.textContent = cssVars(theme, state);
    userStyle.textContent = state.settings["appearance.customCss.enabled"] ? String(state.settings["appearance.customCss.value"] || "") : "";

    const image = state.settings["appearance.image.file"] || state.settings["appearance.image.url"];
    if (state.settings["appearance.image.enabled"] && image) {
      document.documentElement.classList.add("bgpt-has-bg");
      bgLayer.style.backgroundImage = `url("${String(image).replace(/"/g, "%22")}")`;
      bgLayer.style.opacity = Number(state.settings["appearance.image.opacity"]) / 100;
      bgLayer.style.filter = `blur(${Number(state.settings["appearance.image.blur"])}px)`;
    } else if (state.settings["appearance.gradient.enabled"]) {
      document.documentElement.classList.add("bgpt-has-bg");
      bgLayer.style.backgroundImage = gradientValue(state);
      bgLayer.style.opacity = "1";
      bgLayer.style.filter = "none";
    } else {
      document.documentElement.classList.remove("bgpt-has-bg");
      bgLayer.style.backgroundImage = "";
      bgLayer.style.opacity = "0";
      bgLayer.style.filter = "none";
    }
  }

  window.BetterGPT = window.BetterGPT || {};
  window.BetterGPT.themes = { apply, getTheme, gradientValue };
})();
