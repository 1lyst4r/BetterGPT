(function () {
  const themes = [
    {
      id: "default",
      name: "Default",
      colors: {
        bg: "",
        surface: "",
        text: "",
        muted: "",
        accent: "#10a37f",
        user: "",
        assistant: "",
        input: "",
        border: "",
        button: "",
        buttonHover: ""
      },
      effects: { blur: 0, opacity: 1, radius: 12 }
    },
    {
      id: "midnight",
      name: "Midnight",
      colors: {
        bg: "#0f1218",
        surface: "#171b24",
        text: "#f4f7fb",
        muted: "#9ca7b7",
        accent: "#8fb4ff",
        user: "#1c2637",
        assistant: "#11151d",
        input: "#161b24",
        border: "#2a3140",
        button: "#202838",
        buttonHover: "#293246"
      },
      effects: { blur: 0, opacity: 1, radius: 12 }
    },
    {
      id: "amoled",
      name: "AMOLED",
      colors: {
        bg: "#000000",
        surface: "#070707",
        text: "#f7f7f7",
        muted: "#9b9b9b",
        accent: "#ffffff",
        user: "#0d0d0d",
        assistant: "#000000",
        input: "#080808",
        border: "#1f1f1f",
        button: "#111111",
        buttonHover: "#1a1a1a"
      },
      effects: { blur: 0, opacity: 1, radius: 10 }
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      colors: {
        bg: "#12091f",
        surface: "#1b102b",
        text: "#f9f3ff",
        muted: "#c3afd4",
        accent: "#00e0ff",
        user: "#24133b",
        assistant: "#160b25",
        input: "#1b102c",
        border: "#4e2a72",
        button: "#25143a",
        buttonHover: "#321b50"
      },
      effects: { blur: 0, opacity: 1, radius: 14 }
    },
    {
      id: "glass",
      name: "Glass",
      colors: {
        bg: "#10151d",
        surface: "rgba(255,255,255,.08)",
        text: "#f8fafc",
        muted: "#cbd5e1",
        accent: "#8dd3ff",
        user: "rgba(255,255,255,.10)",
        assistant: "rgba(255,255,255,.05)",
        input: "rgba(255,255,255,.10)",
        border: "rgba(255,255,255,.18)",
        button: "rgba(255,255,255,.10)",
        buttonHover: "rgba(255,255,255,.16)"
      },
      effects: { blur: 18, opacity: .92, radius: 16 }
    },
    {
      id: "minimal",
      name: "Minimal",
      colors: {
        bg: "#f7f7f5",
        surface: "#ffffff",
        text: "#202123",
        muted: "#6b7280",
        accent: "#111827",
        user: "#f1f1ee",
        assistant: "#ffffff",
        input: "#ffffff",
        border: "#deded8",
        button: "#f1f1ee",
        buttonHover: "#e7e7e1"
      },
      effects: { blur: 0, opacity: 1, radius: 8 }
    },
    {
      id: "ocean",
      name: "Ocean",
      colors: {
        bg: "#061923",
        surface: "#0b2532",
        text: "#eef9ff",
        muted: "#9dc2d1",
        accent: "#49c6e5",
        user: "#103344",
        assistant: "#08202c",
        input: "#0c2a39",
        border: "#16475b",
        button: "#12394a",
        buttonHover: "#17485d"
      },
      effects: { blur: 0, opacity: 1, radius: 12 }
    },
    {
      id: "sunset",
      name: "Sunset",
      colors: {
        bg: "#241214",
        surface: "#301a1d",
        text: "#fff6f1",
        muted: "#dbb5a9",
        accent: "#ff9f68",
        user: "#3a2022",
        assistant: "#281618",
        input: "#321c1f",
        border: "#5c3632",
        button: "#3c2424",
        buttonHover: "#4a2c2a"
      },
      effects: { blur: 0, opacity: 1, radius: 12 }
    },
    {
      id: "forest",
      name: "Forest",
      colors: {
        bg: "#081711",
        surface: "#10221a",
        text: "#f0fff7",
        muted: "#9ecab1",
        accent: "#7ee0a0",
        user: "#183326",
        assistant: "#0c1c15",
        input: "#12251c",
        border: "#244d38",
        button: "#1a3528",
        buttonHover: "#234333"
      },
      effects: { blur: 0, opacity: 1, radius: 12 }
    },
    {
      id: "sakura",
      name: "Sakura",
      colors: {
        bg: "#fff7f8",
        surface: "#ffffff",
        text: "#2a2024",
        muted: "#7e6670",
        accent: "#d85b82",
        user: "#ffe8ef",
        assistant: "#ffffff",
        input: "#fffafa",
        border: "#f0cad6",
        button: "#fff0f5",
        buttonHover: "#ffe3ec"
      },
      effects: { blur: 0, opacity: 1, radius: 14 }
    },
    {
      id: "neon",
      name: "Neon",
      colors: {
        bg: "#080a12",
        surface: "#101322",
        text: "#f6f8ff",
        muted: "#adb7d5",
        accent: "#b5ff4d",
        user: "#141a2f",
        assistant: "#0c0f1a",
        input: "#111524",
        border: "#303857",
        button: "#182036",
        buttonHover: "#202947"
      },
      effects: { blur: 0, opacity: 1, radius: 12 }
    },
    {
      id: "monochrome",
      name: "Monochrome",
      colors: {
        bg: "#f5f5f5",
        surface: "#ffffff",
        text: "#171717",
        muted: "#6f6f6f",
        accent: "#171717",
        user: "#eeeeee",
        assistant: "#ffffff",
        input: "#ffffff",
        border: "#d7d7d7",
        button: "#ededed",
        buttonHover: "#e2e2e2"
      },
      effects: { blur: 0, opacity: 1, radius: 6 }
    }
  ];

  const gradients = [
    { id: "purple-blue", name: "Purple to Blue", value: "linear-gradient(135deg, #6d5dfc 0%, #28c7fa 100%)" },
    { id: "pink-purple", name: "Pink to Purple", value: "linear-gradient(135deg, #ff6cab 0%, #7366ff 100%)" },
    { id: "orange-pink", name: "Orange to Pink", value: "linear-gradient(135deg, #ff9a3d 0%, #ff5f7e 100%)" },
    { id: "cyan-purple", name: "Cyan to Purple", value: "linear-gradient(135deg, #2de2e6 0%, #8a5cff 100%)" },
    { id: "black-red", name: "Black to Red", value: "linear-gradient(135deg, #050505 0%, #7f1d1d 100%)" },
    { id: "green-blue", name: "Green to Blue", value: "linear-gradient(135deg, #2fce8f 0%, #2f80ed 100%)" }
  ];

  const settings = [
    { id: "appearance.theme", category: "appearance", group: "Themes", type: "select", label: "Theme", description: "Apply a built-in or custom theme.", value: "default", options: themes.map((theme) => ({ label: theme.name, value: theme.id })) },
    { id: "appearance.accent", category: "appearance", group: "Themes", type: "color", label: "Accent color", description: "Controls BetterGPT highlights and selected controls.", value: "#10a37f" },
    { id: "appearance.gradient.enabled", category: "appearance", group: "Backgrounds", type: "toggle", label: "Gradient background", description: "Use a custom gradient behind ChatGPT.", value: false },
    { id: "appearance.gradient.preset", category: "appearance", group: "Backgrounds", type: "select", label: "Gradient preset", description: "Choose a gradient starting point.", value: "purple-blue", options: gradients.map((gradient) => ({ label: gradient.name, value: gradient.id })) },
    { id: "appearance.gradient.angle", category: "appearance", group: "Backgrounds", type: "range", label: "Gradient angle", description: "Rotates linear gradient backgrounds.", value: 135, min: 0, max: 360, step: 1, unit: "deg" },
    { id: "appearance.image.enabled", category: "appearance", group: "Image background", type: "toggle", label: "Image background", description: "Use a local file or image URL as the page background.", value: false },
    { id: "appearance.image.url", category: "appearance", group: "Image background", type: "text", label: "Image URL", description: "Optional remote image URL.", value: "" },
    { id: "appearance.image.file", category: "appearance", group: "Image background", type: "file", label: "Browse files", description: "Pick a local image. It stays in Chrome storage.", value: "" },
    { id: "appearance.image.opacity", category: "appearance", group: "Image background", type: "range", label: "Image opacity", description: "Controls background image visibility.", value: 40, min: 0, max: 100, step: 1, unit: "%" },
    { id: "appearance.image.blur", category: "appearance", group: "Image background", type: "range", label: "Image blur", description: "Softens the background image.", value: 0, min: 0, max: 24, step: 1, unit: "px" },
    { id: "appearance.customCss.enabled", category: "appearance", group: "Custom CSS", type: "toggle", label: "Enable custom CSS", description: "Advanced CSS overrides. CSS can break the interface.", value: false },
    { id: "appearance.customCss.value", category: "appearance", group: "Custom CSS", type: "textarea", label: "Custom CSS", description: "Only CSS is accepted. JavaScript is not executed.", value: "" },
    { id: "appearance.compact", category: "appearance", group: "Interface", type: "toggle", label: "Compact mode", description: "Tightens spacing across ChatGPT.", value: false },
    { id: "appearance.rounded", category: "appearance", group: "Interface", type: "toggle", label: "Rounded UI", description: "Applies softer corners to BetterGPT and supported ChatGPT elements.", value: true },
    { id: "chat.width", category: "chat", group: "Layout", type: "range", label: "Chat width", description: "Limits the conversation width.", value: 820, min: 640, max: 1400, step: 20, unit: "px" },
    { id: "chat.fullWidth", category: "chat", group: "Layout", type: "toggle", label: "Full-width chat", description: "Allows the conversation to use more horizontal space.", value: false },
    { id: "chat.fontSize", category: "chat", group: "Typography", type: "range", label: "Font size", description: "Adjusts conversation text size.", value: 16, min: 13, max: 22, step: 1, unit: "px" },
    { id: "chat.spacing", category: "chat", group: "Layout", type: "range", label: "Message spacing", description: "Changes vertical spacing between messages.", value: 16, min: 8, max: 36, step: 1, unit: "px" },
    { id: "chat.focusMode", category: "chat", group: "Focus", type: "toggle", label: "Focus mode", description: "Reduces surrounding visual noise where possible.", value: false },
    { id: "chat.smoothMessages", category: "chat", group: "Motion", type: "toggle", label: "Smooth message animations", description: "Adds subtle entry motion to newly rendered messages.", value: true },
    { id: "productivity.quickCopy", category: "productivity", group: "Copying", type: "toggle", label: "Quick-copy latest response", description: "Adds copy helpers for the newest assistant response.", value: true },
    { id: "productivity.plainCopy", category: "productivity", group: "Copying", type: "toggle", label: "Copy without formatting", description: "Copies response text as plain text.", value: true },
    { id: "productivity.promptInsert", category: "productivity", group: "Prompts", type: "toggle", label: "Insert Prompt near composer", description: "Shows a native prompt insertion control near ChatGPT input.", value: true },
    { id: "productivity.quickActions", category: "productivity", group: "Quick actions", type: "toggle", label: "Quick actions", description: "Enable configurable prompt actions.", value: true },
    { id: "navigation.favorites", category: "navigation", group: "Conversations", type: "toggle", label: "Conversation favorites", description: "Adds local-only conversation favorite controls.", value: false },
    { id: "navigation.pins", category: "navigation", group: "Conversations", type: "toggle", label: "Conversation pinning", description: "Adds local-only pin markers for navigation.", value: false },
    { id: "navigation.jumpButtons", category: "navigation", group: "Page", type: "toggle", label: "Jump buttons", description: "Adds jump to top and bottom controls.", value: true },
    { id: "tools.enabled", category: "tools", group: "Utilities", type: "toggle", label: "Enable tools", description: "Enables the BetterGPT utility shelf.", value: true },
    { id: "tools.defaultTool", category: "tools", group: "Utilities", type: "select", label: "Default tool", description: "Tool opened first in the utilities view.", value: "json", options: [
      { label: "JSON formatter", value: "json" },
      { label: "Markdown preview", value: "markdown" },
      { label: "Counters", value: "counter" },
      { label: "Regex tester", value: "regex" },
      { label: "Base64", value: "base64" },
      { label: "URL codec", value: "url" },
      { label: "Timestamp", value: "timestamp" }
    ] },
    { id: "notifications.enabled", category: "notifications", group: "Desktop", type: "toggle", label: "Desktop notifications", description: "Allows BetterGPT to send optional desktop notifications.", value: false },
    { id: "notifications.responseDone", category: "notifications", group: "Desktop", type: "toggle", label: "Response completion", description: "Notify when a response appears complete.", value: false },
    { id: "notifications.sound", category: "notifications", group: "Sound", type: "toggle", label: "Notification sound", description: "Play a subtle local sound with notifications.", value: false },
    { id: "accessibility.highContrast", category: "accessibility", group: "Vision", type: "toggle", label: "High contrast", description: "Raises contrast for BetterGPT and supported ChatGPT surfaces.", value: false },
    { id: "accessibility.reducedMotion", category: "accessibility", group: "Motion", type: "toggle", label: "Reduced motion", description: "Reduces BetterGPT animations in addition to system settings.", value: false },
    { id: "accessibility.focusRing", category: "accessibility", group: "Keyboard", type: "toggle", label: "Visible focus indicators", description: "Strengthens keyboard focus outlines.", value: true },
    { id: "accessibility.lineHeight", category: "accessibility", group: "Reading", type: "range", label: "Line spacing", description: "Adjusts readable line height.", value: 1.55, min: 1.2, max: 2, step: .05, unit: "" },
    { id: "accessibility.dyslexiaFont", category: "accessibility", group: "Reading", type: "toggle", label: "Dyslexia-friendly font", description: "Uses a widely available readable font stack.", value: false },
    { id: "experimental.nativeTweaks", category: "experimental", group: "Experimental", type: "toggle", label: "Native UI tweaks", description: "Experimental selectors for extra ChatGPT interface customization.", value: false, experimental: true },
    { id: "experimental.responseWatcher", category: "experimental", group: "Experimental", type: "toggle", label: "Response watcher", description: "Experimental detection for response-complete notifications.", value: false, experimental: true },
    { id: "system.panelWidth", category: "system", group: "Panel", type: "range", label: "Panel width", description: "Controls BetterGPT panel width.", value: 420, min: 340, max: 560, step: 10, unit: "px" },
    { id: "system.panelBlur", category: "system", group: "Panel", type: "range", label: "Panel blur", description: "Adjusts BetterGPT panel backdrop blur.", value: 18, min: 0, max: 32, step: 1, unit: "px" },
    { id: "system.animSpeed", category: "system", group: "Panel", type: "range", label: "Animation speed", description: "Controls BetterGPT motion timing.", value: 220, min: 80, max: 500, step: 10, unit: "ms" }
  ];

  const categories = [
    { id: "appearance", label: "Appearance", icon: "palette" },
    { id: "chat", label: "Chat", icon: "message" },
    { id: "productivity", label: "Productivity", icon: "bolt" },
    { id: "navigation", label: "Navigation", icon: "compass" },
    { id: "tools", label: "Tools", icon: "tool" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "accessibility", label: "Accessibility", icon: "accessibility" },
    { id: "experimental", label: "Experimental", icon: "flask" },
    { id: "system", label: "System", icon: "settings" }
  ];

  const quickActions = [
    { id: "summarize", name: "Summarize", icon: "align", prompt: "Summarize the following clearly and briefly:\n\n" },
    { id: "explain", name: "Explain simply", icon: "message", prompt: "Explain this in simple terms:\n\n" },
    { id: "shorter", name: "Make shorter", icon: "minimize", prompt: "Make this shorter while preserving the meaning:\n\n" },
    { id: "longer", name: "Make longer", icon: "maximize", prompt: "Expand this with useful detail:\n\n" },
    { id: "grammar", name: "Fix grammar", icon: "check", prompt: "Fix grammar, spelling, and clarity:\n\n" },
    { id: "professional", name: "Rewrite professionally", icon: "briefcase", prompt: "Rewrite this in a professional tone:\n\n" },
    { id: "code", name: "Explain code", icon: "code", prompt: "Explain what this code does:\n\n" },
    { id: "review", name: "Review code", icon: "search", prompt: "Review this code for bugs, risks, and maintainability issues:\n\n" },
    { id: "continue", name: "Continue", icon: "arrowRight", prompt: "Continue from here:\n\n" }
  ];

  window.BetterGPT = window.BetterGPT || {};
  window.BetterGPT.config = { settings, categories, themes, gradients, quickActions };
})();
