(function () {
  function text(node) {
    return (node && (node.getAttribute("aria-label") || node.textContent || "")).trim();
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function isVisible(node) {
    if (!node || !(node instanceof Element)) return false;
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  }

  function navRow(node) {
    if (!node) return null;
    return node.closest("li,[role='listitem'],a,button,[role='button']") || node;
  }

  function control(node) {
    if (!node) return null;
    return node.closest("a,button,[role='button']") || node;
  }

  function findUpgradePlanItem() {
    const selectors = [
      'a[aria-label*="Upgrade plan" i]',
      'button[aria-label*="Upgrade plan" i]',
      '[role="button"][aria-label*="Upgrade plan" i]',
      'a',
      'button',
      '[role="button"]'
    ];
    const seen = new Set();
    for (const selector of selectors) {
      for (const node of qsa(selector)) {
        if (seen.has(node) || !isVisible(node)) continue;
        seen.add(node);
        if (/upgrade plan/i.test(text(node))) return control(node);
      }
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (seen.has(node) || !isVisible(node)) continue;
      if (/upgrade plan/i.test(text(node))) return control(node);
    }

    return null;
  }

  function findCodexItem() {
    const selectors = [
      'a[aria-label*="Codex" i]',
      'button[aria-label*="Codex" i]',
      '[role="button"][aria-label*="Codex" i]',
      'nav a',
      'nav button',
      'aside a',
      'aside button',
      '[data-testid*="codex" i]'
    ];
    const seen = new Set();
    for (const selector of selectors) {
      for (const node of qsa(selector)) {
        if (seen.has(node)) continue;
        seen.add(node);
        if (/codex/i.test(text(node)) && isVisible(node)) return navRow(node);
      }
    }

    const sidebar = findSidebar();
    if (!sidebar) return null;
    const walker = document.createTreeWalker(sidebar, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (seen.has(node) || !isVisible(node)) continue;
      const value = text(node);
      if (/^codex$/i.test(value) || /\bcodex\b/i.test(value)) return navRow(node);
    }

    return null;
  }

  function findSidebar() {
    return document.querySelector("nav") || document.querySelector("aside") || document.querySelector('[role="navigation"]');
  }

  function insertAfter(reference, node) {
    const parent = reference && reference.parentElement;
    if (!parent) return false;
    parent.insertBefore(node, reference.nextSibling);
    return true;
  }

  function insertBefore(reference, node) {
    const parent = reference && reference.parentElement;
    if (!parent) return false;
    parent.insertBefore(node, reference);
    return true;
  }

  function composer() {
    return document.querySelector("textarea") || document.querySelector('[contenteditable="true"]');
  }

  function setComposerText(value) {
    const input = composer();
    if (!input) return false;
    input.focus();
    if (input.tagName === "TEXTAREA") {
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }
    input.textContent = value;
    input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: value }));
    return true;
  }

  function appendComposerText(value) {
    const input = composer();
    const current = input && input.tagName === "TEXTAREA" ? input.value : input ? input.textContent : "";
    return setComposerText(`${current}${current ? "\n" : ""}${value}`);
  }

  function latestAssistantNode() {
    const candidates = qsa('[data-message-author-role="assistant"], article, [class*="markdown"], .markdown');
    for (let i = candidates.length - 1; i >= 0; i -= 1) {
      const value = candidates[i].innerText || candidates[i].textContent || "";
      if (value.trim().length > 20) return candidates[i];
    }
    return null;
  }

  function latestAssistantText() {
    const node = latestAssistantNode();
    if (!node) return "";
    return (node.innerText || node.textContent || "").trim();
  }

  function findConversationLinks() {
    return qsa('a[href*="/c/"]').filter(isVisible);
  }

  function getConversationId(link) {
    const match = (link.getAttribute("href") || "").match(/\/c\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  }

  function getConversationTitle(link) {
    const value = text(link);
    return value || "Untitled conversation";
  }

  function findDisclaimerText() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.children.length === 0 && /can make mistakes/i.test(node.textContent || "") && isVisible(node)) return node;
    }
    return null;
  }

  function findStopGeneratingButton() {
    const selectors = [
      'button[aria-label*="Stop generating" i]',
      'button[aria-label*="Stop streaming" i]',
      'button[data-testid="stop-button"]'
    ];
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (node && isVisible(node)) return node;
    }
    return null;
  }

  function download(name, content, type) {
    const blob = new Blob([content], { type: type || "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  function pickFile(accept) {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept || "";
      input.addEventListener("change", () => resolve(input.files && input.files[0] ? input.files[0] : null), { once: true });
      input.click();
    });
  }

  function readFile(file, asText) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      if (asText) reader.readAsText(file);
      else reader.readAsDataURL(file);
    });
  }

  window.BetterGPT = window.BetterGPT || {};
  window.BetterGPT.dom = {
    findCodexItem,
    findUpgradePlanItem,
    findSidebar,
    insertAfter,
    insertBefore,
    composer,
    setComposerText,
    appendComposerText,
    latestAssistantText,
    latestAssistantNode,
    findConversationLinks,
    getConversationId,
    getConversationTitle,
    findDisclaimerText,
    findStopGeneratingButton,
    download,
    pickFile,
    readFile
  };
})();
