(function () {
  function jsonTool(value) {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch (error) {
      return `Invalid JSON: ${error.message}`;
    }
  }

  function markdownTool(value) {
    return String(value)
      .replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]))
      .replace(/^### (.*)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }

  function counterTool(value) {
    const words = String(value).trim().split(/\s+/).filter(Boolean).length;
    return `Characters: ${String(value).length}\nWords: ${words}\nLines: ${String(value).split(/\r\n|\r|\n/).length}`;
  }

  function regexTool(value, pattern) {
    try {
      const regex = new RegExp(pattern || "", "g");
      return JSON.stringify(Array.from(String(value).matchAll(regex)).map((match) => match[0]), null, 2);
    } catch (error) {
      return `Invalid regex: ${error.message}`;
    }
  }

  function base64Tool(value, mode) {
    try {
      return mode === "decode" ? decodeURIComponent(escape(atob(value))) : btoa(unescape(encodeURIComponent(value)));
    } catch (error) {
      return `Base64 error: ${error.message}`;
    }
  }

  function urlTool(value, mode) {
    try {
      return mode === "decode" ? decodeURIComponent(value) : encodeURIComponent(value);
    } catch (error) {
      return `URL error: ${error.message}`;
    }
  }

  function timestampTool(value) {
    const number = Number(value);
    const date = Number.isFinite(number) ? new Date(number < 10000000000 ? number * 1000 : number) : new Date(value);
    return Number.isNaN(date.getTime()) ? "Invalid timestamp" : date.toISOString();
  }

  window.BetterGPT = window.BetterGPT || {};
  window.BetterGPT.tools = { jsonTool, markdownTool, counterTool, regexTool, base64Tool, urlTool, timestampTool };
})();
