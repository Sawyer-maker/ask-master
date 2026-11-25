# Gemini (Gemini Neon) 操作手册

- **入口**：`https://gemini.google.com/app`。
- **选可用最强模型、最高思考等级（正反双校验）与模式**：
  - 点击 `modeBtn = page.getByRole("button", { name: /打开模式选择器|Open mode picker/i })` 前先检查 `await modeBtn.getAttribute("aria-expanded") !== "true"`（菜单在主 DOM 中，重复点击会关闭）。
  - 检查 **`4 Carbon`** 是否未锁定（无锁图标且可点击）：未锁定则选 `4 Carbon`，锁定则选 **`4 Neon`**。
  - 点击 **`思考等级` / `Thinking level`** 展开子菜单，用 `/超级详尽|Extremely detailed|^高$/i` 点击 **`高（超级详尽）`**（注意 JS `\b` 不支持中文边界）。
  - **Pre-Send 正反双校验硬断言**（彻底根除 `"低 快速、高效"` 含 `"高"` 的假阳性）：
    ```javascript
    const txt = `${await modeBtn.innerText()} ${await modeBtn.getAttribute("aria-label") || ""}`;
    const isHigh = /(?:^|[\s“"(\[（])(高|High)(?:$|[\s”")\]）])|超级详尽|Extremely detailed/i.test(txt);
    const isLow = /低|快速|高效|Low|Fast/i.test(txt);
    if (!isHigh || isLow) throw new Error(`Gemini 思考等级硬断言失败: ${txt}`);
    ```
    若 3 次重试仍未通过，立即 `handoff()`，严禁降级发送。
  - **模式选择（仅 Gemini 区分）**：按任务在输入框下方选择 **`对话`** 或 **`任务`**；按需在 `+` 菜单开启 `在 Google 上搜索` / `Deep Research`（须检测并点击 `开始研究 / Start research`）。
- **多附件上传（至多 10 个）与全量就绪硬断言**：
  - 点击 `/上传和工具|Upload and tools/i` 展开菜单，使用 `Promise.all([page.waitForEvent("filechooser", { timeout: 10000 }), uploadItem.click()])`（对应 `menuitem /上传文件|Upload files/i`）传入最多 10 个本地路径（跳过 0 字节文件）。
  - **全量附件就绪断言**：轮询上限 30s，确认 `close <filename>` 预览 chip 数量 **`>= files.length`** 且上传中 spinner（`mat-progress-spinner:visible, [aria-label*="上传中"]:visible, [aria-label*="Uploading"]:visible`）为 `0`，**未全量就绪严禁发送**。
  - 若输入区因窄屏 `width=0` 不可见，先点 `/关闭边栏|Close sidebar/i`；填入指令并记录 `prevAssistantTurnCount`（`model-response` 数量）后点击 `/发送|Send/i`。
- **完成防抖与全量提取（含 Canvas / 原图下载）**：
  - `page.locator('button[aria-label*="停止"]:visible, button[aria-label*="Stop"]:visible').count() === 0` 且 `curAssistantTurnCount > prevAssistantTurnCount` 连续 2 帧稳定。
  - 先定位末条 `model-response`，点击其底部消息级复制按钮（避开代码块 Copy）配合 [clipboard-hook.md](clipboard-hook.md) 提取无损 Markdown，兜底取末条 `model-response message-content, .model-response-text` 文本。
  - **全量产物下载**：若开启 Canvas 或 Deep Research 打开了右侧沉浸面板，必须额外抓取面板完整正文存为 `artifacts/canvas_<idx>.md`；若生成图片或图表，必须下载完整原尺寸文件保存至 `artifacts/`（勿以缩略图替代原图）。
