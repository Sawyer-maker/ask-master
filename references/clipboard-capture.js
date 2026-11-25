// Browse execute fragment. Run on the verified completed assistant turn, with explicit tab.
async function captureReply(copyButton, domSelector, archive) {
  const key = "__askMasterCopy";
  const main = (fn, arg) => page.evaluate(fn, arg, false);
  const installed = await main((key) => {
    if (window[key]) return false;
    const originals = [];
    let active = true;
    const state = { text: "", method: "", pending: 0 };
    const save = (text, method) => {
      if (active && typeof text === "string" && text && !state.text) {
        state.text = text;
        state.method = method;
      }
    };
    const cb = navigator.clipboard;
    function patch(name, value) {
      if (!cb) return;
      const descriptor = Object.getOwnPropertyDescriptor(cb, name);
      Object.defineProperty(cb, name, { configurable: true, value });
      originals.push([name, descriptor]);
    }
    const prevent = (event) => {
      // Let the page's listeners supply data, but do not let default copy reach the OS.
      event.preventDefault();
      queueMicrotask(() => {
        save(event.clipboardData?.getData("text/markdown") ||
             event.clipboardData?.getData("text/plain"), "copy-event");
      });
    };
    state.dispose = () => {
      active = false;
      document.removeEventListener("copy", prevent, true);
      for (const [name, descriptor] of originals) {
        if (descriptor) Object.defineProperty(cb, name, descriptor);
        else delete cb[name];
      }
      delete window[key];
    };
    try {
      patch("writeText", async (text) => save(text, "writeText"));
      patch("write", async (items) => {
        state.pending++;
        try {
          for (const mime of ["text/markdown", "text/plain"]) {
            for (const item of items) {
              if (item.types.includes(mime)) {
                save(await (await item.getType(mime)).text(), "write");
                if (state.text) return;
              }
            }
          }
        } finally { state.pending--; }
      });
      document.addEventListener("copy", prevent, true);
      window[key] = state;
      return true;
    } catch {
      state.dispose();
      return false;
    }
  }, key);
  if (!installed) throw new Error("Clipboard capture unavailable; use bounded DOM fallback without clicking Copy.");
  try {
    await copyButton.click();
    let meta;
    for (let attempt = 0; attempt < 12; attempt++) {
      meta = await main((k) => {
        const s = window[k];
        return s && { length: s.text.length, method: s.method, pending: s.pending };
      }, key);
      if (!meta || (meta.length && !meta.pending)) break;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    if (!meta?.length || meta.pending) throw new Error("No stable clipboard capture.");
    const result = await readBounded(meta.length, (offset, end) =>
      main(readPageChunk, { key, offset, end, clipboard: true }));
    if (domSelector) {
      const anchors = await page.evaluate((selector) => {
        const matches = document.querySelectorAll(selector);
        if (matches.length !== 1) throw new Error("Expected one verified answer body");
        const words = matches[0].innerText.trim().split(/\s+/).filter(Boolean);
        return [words.slice(0, 3).map(w => w.slice(0, 40)), words.slice(-3).map(w => w.slice(0, 40))];
      }, domSelector);
      const folded = result.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
      for (const edge of anchors) {
        const terms = edge.map(w => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")).filter(Boolean);
        if (terms.some(term => !folded.includes(term))) {
          throw new Error("Clipboard capture does not match the answer boundaries.");
        }
      }
    }
    return { path: await files.write(archive, result), chars: result.length, source: meta.method };
  } finally { await main(k => window[k]?.dispose(), key); }
}

// Runs in the page: do not send either half of a surrogate pair across eval.
function readPageChunk({ key, offset, end, clipboard }) {
  const value = clipboard ? window[key].text : window[key];
  const left = value.charCodeAt(end - 1);
  const right = value.charCodeAt(end);
  if (left >= 0xd800 && left <= 0xdbff && right >= 0xdc00 && right <= 0xdfff) end--;
  return { end, text: value.slice(offset, end) };
}

async function readBounded(length, read) {
  if (!Number.isSafeInteger(length) || length < 1) throw new Error("Empty or invalid reply.");
  const chunks = [];
  // Even worst-case JSON string escaping stays below Browse v0.1.5's 100,000-character cap.
  for (let offset = 0; offset < length;) {
    const end = Math.min(length, offset + 8192);
    const chunk = await read(offset, end);
    const validEnd = chunk.end === end || (end < length && chunk.end === end - 1);
    if (!validEnd || chunk.text.length !== chunk.end - offset) {
      throw new Error("Truncated reply chunk.");
    }
    chunks.push(chunk.text);
    offset = chunk.end;
  }
  return chunks.join("");
}

async function archiveDomReply(domSelector, archive) {
  const key = "__askMasterDomText";
  const length = await page.evaluate(({ selector, key }) => {
    const matches = document.querySelectorAll(selector);
    if (matches.length !== 1) throw new Error("Expected one verified answer body");
    if (Object.hasOwn(window, key)) throw new Error("DOM capture already active");
    window[key] = matches[0].innerText;
    return window[key].length;
  }, { selector: domSelector, key });
  try {
    const result = await readBounded(length, (offset, end) =>
      page.evaluate(readPageChunk, { key, offset, end }));
    return { path: await files.write(archive, result), chars: length, source: "dom-text" };
  } finally { await page.evaluate(k => { delete window[k]; }, key); }
}
