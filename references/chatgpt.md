# ChatGPT (OpenAI Astra) 操作手册

- **入口与对话校验**：`https://chatgpt.com/`（仅对话模式；发送前确认未开启「临时聊天 / Temporary Chat」，否则无永久会话 URL）。
- **选可用最强模型与最高思考滑块（防并发失焦与侧边栏误命中）**：
  - 点击 `page.getByRole("button", { name: /选择 ChatGPT 模型|Model selector/i })`；
  - **必须使用 `page.locator('[role="menu"]:has([role="slider"])')`** 定位模型弹窗（严禁用 `[role="menu"].first()` 误中左侧边栏）；
  - 使用 `while` 循环读取 `slider` 的 `aria-valuenow` 与 `aria-valuemax`，每按一次 `ArrowRight` 检查是否递增，未变化则重新 `slider.focus()`，直至 `valuenow === valuemax`（如 `6 Pro` 第 5/5 档 `aria-valuenow="4"`）；若无 Pro 则选可用最强推理模型与最高档；关闭弹窗后回读模型按钮与思考深度胶囊文本做 Pre-Send 硬断言。
- **文件上传（支持至多 10 个独立文档/图片）与发送**：
  - 点击 `/添加文件|Add photos|Upload/i` 用 `Promise.all([page.waitForEvent("filechooser", { timeout: 10000 }), trigger.click()])`（或通用非 `image/*` 限制的 `input[type="file"]`）传入 `[files.path("..."), ...]`（跳过 0 字节文件）。
  - 轮询等待上传进度条消失、全部附件卡片就绪且 `/发送|Send/i` 按钮 `enabled`（上限 30s），在 `textbox /询问 ChatGPT|Ask anything|Message ChatGPT/i` 填入指令并记录 `prevAssistantTurnCount` 后点击发送。
  - 若开启 `深度研究`，发送后留意澄清提问/确认按钮；遇业务架构澄清题以 `needs_clarification` 带回主智能体。
- **起跑确认、防抖完成与无损全量提取**：
  - 助手计数仅统计 `[data-message-author-role="assistant"]`；停止按钮过滤可见性：`page.locator('button[data-testid="stop-button"]:visible, button[aria-label*="停止"]:visible, button[aria-label*="Stop"]:visible').count() === 0`。
  - 轮询中若出现 `Continue generating / 继续生成` 按钮自动点击续写；若弹出 A/B 双卡对比回答则两份一并保存（标注 `Variant A/B`）。
  - **防误点代码块 Copy**：先定位 `lastAssistant = page.locator('[data-message-author-role="assistant"]').last()`，scroll + hover 后**仅点击其底部消息栏的 `button[data-testid="copy-turn-action-button"]`**（严禁匹配代码块内 `Copy code`），配合 [clipboard-hook.md](clipboard-hook.md) 提取并与 `lastAssistant.innerText()` 做长度校验兜底（废弃过宽的 `main.last()`）。
  - **产物完整下载**：扫描 `lastAssistant` 内的生成图片、Chart、`sandbox:` 下载链接与代码文件按钮，通过原生下载或大图源完整保存至 `artifacts/`（禁仅存缩略图或 URL）。
