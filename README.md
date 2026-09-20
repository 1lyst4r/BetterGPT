# BetterGPT

BetterGPT is a Manifest V3 Chrome extension that injects a native-looking BetterGPT entry into ChatGPT's top right, right next to the **"Upgrade plan"** button, when that navigation item is detected.

## Load locally

1. Open Chrome and go to `chrome://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked**.
4. Select the `BetterGPT` folder.
5. Open `https://chatgpt.com`.

## Included

- Robust sidebar placement using accessible labels and fallback navigation selectors.
- Smooth BetterGPT panel with category navigation and setting search.
- Chrome storage persistence.
- Built-in themes, custom theme saving, gradient and image backgrounds, with live blur/opacity/corner-radius effects per theme.
- Local image picker with no upload.
- Prompt manager and configurable quick actions.
- Conversation pinning and favoriting, with hover controls on each sidebar conversation and a dedicated management list in the panel.
- Desktop notifications (via a background service worker) with an experimental response-completion watcher and optional sound, plus one-click test buttons.
- Utility tools: JSON, Markdown, counters, regex, Base64, URL codec, timestamps — with a configurable default tool.
- Rich or plain-text copy for the latest response.
- Settings import/export, local backups, diagnostics.
- Reduced-motion support and optional accessibility tweaks (high contrast, focus rings, dyslexia-friendly font, adjustable line height).
- Optional native UI tweaks (hides ChatGPT's own disclaimer text, gently autofocuses the composer).

Every toggle and setting in the panel is wired to a real effect, nothing in the UI is decorative.

The extension does not collect analytics or upload conversations, prompts, images, settings, or backups. Desktop notifications are generated locally by the extension's own background script and never leave your device.
