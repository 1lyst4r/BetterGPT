(function () {
  const paths = {
    bettergpt: '<path d="M12 3.25 19.2 7.4v8.3L12 19.85 4.8 15.7V7.4L12 3.25Z"/><path d="M12 7.15 15.85 9.4v4.45L12 16.1l-3.85-2.25V9.4L12 7.15Z"/>',
    palette: '<path d="M12 4a8 8 0 0 0 0 16h1.05a1.85 1.85 0 0 0 1.3-3.16.98.98 0 0 1 .7-1.67H16a4 4 0 0 0 0-8h-1.1A7.96 7.96 0 0 0 12 4Z"/><path d="M7.8 12.1h.01M9.25 8.85h.01M13 8.15h.01"/>',
    message: '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-4.4 4v-4.25A2.5 2.5 0 0 1 5 13V6.5Z"/>',
    bolt: '<path d="m13 2-7 11h5l-1 9 8-12h-5l0-8Z"/>',
    compass: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="m15.2 8.8-1.8 4.6-4.6 1.8 1.8-4.6 4.6-1.8Z"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.35 4.9l-5.1 5.1a2.1 2.1 0 0 0 2.97 2.97l5.1-5.1a4 4 0 0 0 4.9-5.35l-2.6 2.6-2.1-2.1 2.18-3.02Z"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-2.25 7-2.25 7h16.5S18 16 18 9Z"/><path d="M9.75 19a2.5 2.5 0 0 0 4.5 0"/>',
    accessibility: '<path d="M12 5.6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M4.5 8.2h15M12 8.2V22M8 22l4-8 4 8"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v5.3l-4.5 8A3.2 3.2 0 0 0 8.3 21h7.4a3.2 3.2 0 0 0 2.8-4.75L14 8.3V3"/><path d="M8 15h8"/>',
    settings: '<path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="m19.4 15-.3.65 1.25 2.4-2.3 2.3-2.4-1.25-.65.3-.85 2.6h-3.3L10 19.4l-.65-.3-2.4 1.25-2.3-2.3 1.25-2.4-.3-.65L3 14.15v-3.3L5.6 10l.3-.65-1.25-2.4 2.3-2.3 2.4 1.25.65-.3L10.85 3h3.3L15 5.6l.65.3 2.4-1.25 2.3 2.3-1.25 2.4.3.65 2.6.85v3.3L19.4 15Z"/>',
    search: '<path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="7"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    upload: '<path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M5 15v4h14v-4"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 19h14"/>',
    copy: '<path d="M8 8h10v12H8z"/><path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/>',
    edit: '<path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m14 6 4 4"/>',
    align: '<path d="M4 6h16M4 12h12M4 18h8"/>',
    minimize: '<path d="M5 12h14"/>',
    maximize: '<path d="M5 5h6M5 5v6M19 19h-6M19 19v-6M5 19h6M5 19v-6M19 5h-6M19 5v6"/>',
    briefcase: '<path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"/><path d="M9 8V5h6v3"/><path d="M4 13h16"/>',
    code: '<path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    star: '<path d="m12 3 2.6 5.9 6.4.6-4.85 4.3 1.45 6.3L12 16.9l-5.6 3.2 1.45-6.3L3 9.5l6.4-.6L12 3Z"/>',
    pin: '<path d="M12 2.5 14 8l4.5 1.4-3.3 3.4.6 5.2L12 15.9l-3.8 2.1.6-5.2L5.5 9.4 10 8l2-5.5Z"/><path d="M12 15.9V21.5"/>'
  };

  function icon(name, label) {
    const body = paths[name] || paths.bettergpt;
    const title = label ? `<title>${label}</title>` : "";
    return `<svg class="bgpt-icon" viewBox="0 0 24 24" aria-hidden="${label ? "false" : "true"}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${title}${body}</svg>`;
  }

  window.BetterGPT = window.BetterGPT || {};
  window.BetterGPT.icon = icon;
})();
