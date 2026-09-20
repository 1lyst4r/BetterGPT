chrome.runtime.onMessage.addListener((message) => {
  if (!message || message.type !== "bettergpt-notify") return false;

  chrome.notifications.create(`bettergpt-${Date.now()}`, {
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/icon128.png"),
    title: message.title || "BetterGPT",
    message: (message.body || "").slice(0, 200),
    silent: true
  });

  return false;
});
