(function () {
  let promptButton;
  let jumpBox;
  let copyButton;
  let responseWatcher;
  let watcherSignature = "";
  let lastNotifiedText = "";

  function remove(node) {
    if (node && node.parentElement) node.remove();
  }

  async function copyLatest(app) {
    const node = window.BetterGPT.dom.latestAssistantNode();
    if (!node) return;
    const text = (node.innerText || node.textContent || "").trim();
    if (!text) return;
    const plain = app.state.settings["productivity.plainCopy"];
    if (!plain && navigator.clipboard && window.ClipboardItem) {
      try {
        const html = node.innerHTML;
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": new Blob([text], { type: "text/plain" }),
            "text/html": new Blob([html], { type: "text/html" })
          })
        ]);
        return;
      } catch (error) {
        // Rich copy unsupported or blocked; fall back to plain text below.
      }
    }
    navigator.clipboard.writeText(text);
  }

  function installPromptInsert(app) {
    remove(promptButton);
    if (!app.state.settings["productivity.promptInsert"]) return;
    const input = window.BetterGPT.dom.composer();
    const parent = (input && input.closest("form, [role='form']")) || (input && input.parentElement);
    if (!parent) return;
    promptButton = document.createElement("button");
    promptButton.type = "button";
    promptButton.className = "bgpt-composer-button";
    promptButton.innerHTML = `${window.BetterGPT.icon("bettergpt")}<span>Prompts</span>`;
    promptButton.addEventListener("click", () => app.open("productivity"));
    parent.appendChild(promptButton);
  }

  function installJumpButtons(app) {
    remove(jumpBox);
    if (!app.state.settings["navigation.jumpButtons"]) return;
    jumpBox = document.createElement("div");
    jumpBox.className = "bgpt-jump-box";
    jumpBox.innerHTML = '<button type="button" aria-label="Jump to top">↑</button><button type="button" aria-label="Jump to bottom">↓</button>';
    const buttons = jumpBox.querySelectorAll("button");
    buttons[0].addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    buttons[1].addEventListener("click", () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }));
    document.body.appendChild(jumpBox);
  }

  function installCopyButton(app) {
    remove(copyButton);
    if (!app.state.settings["productivity.quickCopy"]) return;
    copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "bgpt-copy-latest";
    copyButton.innerHTML = `${window.BetterGPT.icon("copy")}<span>Copy latest</span>`;
    copyButton.addEventListener("click", () => copyLatest(app));
    document.body.appendChild(copyButton);
  }

  function isPinned(app, id) {
    return app.state.pins.some((item) => item.id === id);
  }

  function isFavorite(app, id) {
    return app.state.favorites.some((item) => item.id === id);
  }

  function togglePin(app, id, title, href) {
    const idx = app.state.pins.findIndex((item) => item.id === id);
    if (idx >= 0) app.state.pins.splice(idx, 1);
    else app.state.pins.unshift({ id, title, href, addedAt: Date.now() });
    app.persist();
  }

  function toggleFavorite(app, id, title, href) {
    const idx = app.state.favorites.findIndex((item) => item.id === id);
    if (idx >= 0) app.state.favorites.splice(idx, 1);
    else app.state.favorites.unshift({ id, title, href, addedAt: Date.now() });
    app.persist();
  }

  function installConversationControls(app) {
    const pinsOn = app.state.settings["navigation.pins"];
    const favoritesOn = app.state.settings["navigation.favorites"];
    if (!pinsOn && !favoritesOn) {
      document.querySelectorAll(".bgpt-convo-controls").forEach(remove);
      document.querySelectorAll(".bgpt-pinned-row").forEach((row) => row.classList.remove("bgpt-pinned-row"));
      return;
    }
    const links = window.BetterGPT.dom.findConversationLinks();
    links.forEach((link) => {
      const row = link.closest("li") || link.parentElement;
      if (!row || row.querySelector(".bgpt-convo-controls")) return;
      const id = window.BetterGPT.dom.getConversationId(link);
      if (!id) return;
      const title = window.BetterGPT.dom.getConversationTitle(link);
      const href = link.getAttribute("href") || "";

      const controls = document.createElement("div");
      controls.className = "bgpt-convo-controls";

      if (pinsOn) {
        const pinBtn = document.createElement("button");
        pinBtn.type = "button";
        pinBtn.className = `bgpt-convo-btn${isPinned(app, id) ? " is-active" : ""}`;
        pinBtn.innerHTML = window.BetterGPT.icon("pin", "Pin conversation");
        pinBtn.title = "Pin conversation";
        pinBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          togglePin(app, id, title, href);
        });
        controls.appendChild(pinBtn);
      }

      if (favoritesOn) {
        const favBtn = document.createElement("button");
        favBtn.type = "button";
        favBtn.className = `bgpt-convo-btn${isFavorite(app, id) ? " is-active" : ""}`;
        favBtn.innerHTML = window.BetterGPT.icon("star", "Favorite conversation");
        favBtn.title = "Favorite conversation";
        favBtn.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleFavorite(app, id, title, href);
        });
        controls.appendChild(favBtn);
      }

      if (getComputedStyle(row).position === "static") row.style.position = "relative";
      row.classList.add("bgpt-convo-row");
      row.classList.toggle("bgpt-pinned-row", pinsOn && isPinned(app, id));
      row.appendChild(controls);
    });
  }

  function playPing() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
      osc.onended = () => ctx.close();
    } catch (error) {
      // Audio unsupported or blocked; notification still fires without sound.
    }
  }

  function sendNotification(app, title, body) {
    try {
      if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ type: "bettergpt-notify", title, body });
      }
    } catch (error) {
      // Extension context may be invalidated (e.g. after an update); ignore.
    }
    if (app.state.settings["notifications.sound"]) playPing();
  }

  function sendTestNotification(app) {
    sendNotification(app, "BetterGPT test notification", "Notifications are working correctly.");
  }

  function notifyResponseDone(app) {
    const text = window.BetterGPT.dom.latestAssistantText().slice(0, 160);
    if (!text || text === lastNotifiedText) return;
    lastNotifiedText = text;
    sendNotification(app, "ChatGPT response ready", text);
  }

  function installResponseWatcher(app) {
    const sig = [
      app.state.settings["experimental.responseWatcher"],
      app.state.settings["notifications.enabled"],
      app.state.settings["notifications.responseDone"]
    ].join("|");
    if (sig === watcherSignature) return;
    watcherSignature = sig;

    if (responseWatcher) {
      responseWatcher.disconnect();
      responseWatcher = null;
    }

    const enabled = app.state.settings["experimental.responseWatcher"] &&
      app.state.settings["notifications.enabled"] &&
      app.state.settings["notifications.responseDone"];
    if (!enabled) return;

    let seenGenerating = false;
    let debounceTimer = null;

    responseWatcher = new MutationObserver(() => {
      const stopButton = window.BetterGPT.dom.findStopGeneratingButton();
      if (stopButton) {
        seenGenerating = true;
        clearTimeout(debounceTimer);
        return;
      }
      if (!seenGenerating) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        seenGenerating = false;
        notifyResponseDone(app);
      }, 600);
    });
    responseWatcher.observe(document.body, { childList: true, subtree: true });
  }

  function applyNativeTweaks(app) {
    const enabled = app.state.settings["experimental.nativeTweaks"];
    const disclaimer = window.BetterGPT.dom.findDisclaimerText();
    if (disclaimer) disclaimer.style.display = enabled ? "none" : "";

    if (enabled && document.activeElement === document.body) {
      const input = window.BetterGPT.dom.composer();
      if (input) input.focus();
    }
  }

  function apply(app) {
    requestAnimationFrame(() => {
      installPromptInsert(app);
      installJumpButtons(app);
      installCopyButton(app);
      installConversationControls(app);
      installResponseWatcher(app);
      applyNativeTweaks(app);
    });
  }

  window.BetterGPT = window.BetterGPT || {};
  window.BetterGPT.features = { apply, sendTestNotification, playTestSound: playPing };
})();
