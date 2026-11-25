# AIStudio (Gemini Neon) 操作手册

- **入口与模型双硬断言**：`https://aistudio.google.com/prompts/new_chat?model=gemini-4-neon`。
  - **禁止只凭 URL 参数假定模型生效**（若账号权限或 slug 变化可能静默回退）：发送前必须回读页面当前模型卡片/选择器文本 + `page.getByRole("combobox", { name: /Thinking Level/i }).innerText()`，断言命中可用最强思考模型（如 `Gemini 4 Neon`）且 `Thinking Level === "Extra High"`；点击后若 `.cdk-overlay-backdrop` 遮挡，先点击遮罩或按 `Escape`。3 次修复失败立即 `handoff()`。
  - Tools 面板切换前先读 `aria-checked` 做到幂等；`Structured outputs` 与 `Grounding with Google Search` / `URL context` / `Code execution` 互斥，常规请教保持 `Structured outputs` 关闭。
- **文件上传与防误填注入（至多 10 个独立附件）**：
  - Browse v0.1.5 不支持等待 `filechooser`。定位唯一且接受所需文件类型的 `input[type=file]`，用 `await input.setInputFiles(relayPaths)` 或原生 `browse.upload`（`selector` 与 `files`）上传。路径以 relay 主机为准，核对附件名称和上传就绪状态后才发送。找不到输入就接管，不猜选择器。 如弹出版权确认，交由用户处理。
  - **纯文本注入防错框**：展开 System Instructions 后页面有多个 `textarea`，必须限定底部输入容器内的 `textarea[aria-label="Enter a prompt"]`（排除 `ms-system-instructions`）；若从文件读文本，必须用 `await files.read(path, "utf8")` 读 UTF-8（严禁 `Uint8Array` 直接拼接变成字节数字乱码），`nativeSetter` 写入后**同时派发 `input` 与 `change` 事件**，断言 `textarea.value.length > 0` 且 `Run` 变为 `enabled`，按 `Control+Enter` 提交。
- **助手计数、降级恢复与全量提取**：
  - 发送前记录助手侧计数 `ms-chat-turn:has([data-turn-role="Model"])`（严禁统计 User turn）。
  - 完成后确认 `page.locator('button:visible', { hasText: /Stop/i }).count() === 0` 且新增末条 Model turn 非空、正文连续两次稳定。短回复也可完成。最高档空输出时报告失败；不得未经授权降档重试。
  - **无损提取**：优先点击末条模型回复右上角 `⋮`（`More options`）→ `Copy markdown` 配合 [clipboard-hook.md](clipboard-hook.md) 提取与 DOM 校对；兜底提取过滤 `!n.parentElement?.closest('ms-cmark-node') && !n.closest('.thoughts-container, ms-thought-chunk')` 防思考块混入或嵌套翻倍。同时下载保存 Code Execution 生成的全部文件至 `artifacts/`。
  - **精确 Token 与断线恢复**：读取 `ms-token-count` / `/[\d,]+\s*tokens/i`；会话自动保存于 `https://aistudio.google.com/library`，断线先回原永久 URL 检查结果，严禁盲目重发。
