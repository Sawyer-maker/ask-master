# Clipboard Hook（并发零踩踏无损提取脚本）

> 核心原则：只做**页内静默拦截**，并发期间**严禁调用原始剪贴板方法回写操作系统剪贴板**（防止多路子智能体争抢系统剪贴板、触发 `NotAllowedError` 或丢失 `navigator.clipboard.write([ClipboardItem])`）。注意部分隔离上下文（Extension `ISOLATED` world）或严格 CSP 站点会阻止覆写 `MAIN` world 剪贴板，若捕获长度为 `0` 属正常现象，按下面第 3 步自动切回平台专属 DOM / `data-markdown-copy-text` 提取。

```javascript
// 1. 点击「消息级」复制按钮前注入（兼容 writeText / write([ClipboardItem]) / copy 事件）
await page.evaluate(() => {
  const state = { text: "", html: "", method: "", tasks: Promise.resolve() };
  window.__askMasterClipboard = state;
  const take = (val, method, html = "") => {
    const s = String(val ?? "");
    if (s.length >= state.text.length && s.length > 0) {
      state.text = s;
      state.method = method;
    }
    if (html && html.length > state.html.length) state.html = String(html);
  };

  const cb = navigator.clipboard;
  if (cb) {
    try {
      Object.defineProperty(cb, "writeText", {
        configurable: true,
        value: async (t) => take(t, "writeText")
      });
    } catch {}
    try {
      Object.defineProperty(cb, "write", {
        configurable: true,
        value: async (items) => {
          state.tasks = state.tasks.then(async () => {
            for (const it of items || []) {
              const types = it.types || [];
              const read = async (mime) =>
                types.includes(mime) ? await (await it.getType(mime)).text() : "";
              const md = await read("text/markdown");
              const plain = await read("text/plain");
              const html = await read("text/html");
              take(md || plain, "clipboard.write", html);
            }
          });
          await state.tasks;
        }
      });
    } catch {}
  }

  // 兜底监听 execCommand('copy')
  document.addEventListener("copy", (e) => {
    const plain = e.clipboardData?.getData("text/plain");
    const html = e.clipboardData?.getData("text/html");
    if (plain) take(plain, "copy-event", html || "");
  }, true);
});

// 2. scroll + hover 末条助手消息并点击「消息级」复制按钮后，动态等待异步 Blob 读取（上限 2000ms）
await page.waitForFunction(
  () => (window.__askMasterClipboard?.text || "").length > 0,
  { timeout: 2000 }
).catch(() => {});
const captured = await page.evaluate(async () => {
  await window.__askMasterClipboard?.tasks;
  return window.__askMasterClipboard?.text || "";
});

// 3. DOM 完整性防截断校验（防止误点代码块 Copy 或空拦截）
// const finalMd = (captured.trim().length >= domText.trim().length * 0.65 && captured.trim().length > 0) ? captured : domText;
```
