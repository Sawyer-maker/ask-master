# ChatGPT (OpenAI Astra) 操作手册

- **入口与对话校验**：`https://chatgpt.com/`（仅对话模式；发送前确认未开启「临时聊天 / Temporary Chat」，否则无永久会话 URL）。
- **选可用最强模型与最高思考滑块（防并发失焦与侧边栏误命中）**：
  - 点击 `page.getByRole("button", { name: /选择 ChatGPT 模型|Model selector/i })`；
  - **必须使用 `page.locator('[role="menu"]:has([role="slider"])')`** 定位模型弹窗（严禁用 `[role="menu"].first()` 误中左侧边栏）；
  - 使用 `while` 循环读取 `slider` 的 `aria-valuenow` 与 `aria-valuemax`，每按一次 `ArrowRight` 检查是否递增，未变化则重新 `slider.focus()`，直至 `valuenow === valuemax`（如 `6 Pro` 第 5/5 档 `aria-valuenow="4"`）；若无 Pro 则选可用最强推理模型与最高档；关闭弹窗后回读模型按钮与思考深度胶囊文本做 Pre-Send 硬断言。
- **文件上传（支持至多 10 个独立文档/图片）与发送**：
  - 优先核对 `input[type=file][aria-label="附加文件"]`（英文界面核对实际名称），排除拍照、图片和视频专用输入。Browse v0.1.5 不支持等待 `filechooser`。定位唯一且接受所需文件类型的 `input[type=file]`，用 `await input.setInputFiles(relayPaths)` 或原生 `browse.upload`（`selector` 与 `files`）上传。路径以 relay 主机为准，核对附件名称和上传就绪状态后才发送。找不到输入就接管，不猜选择器。
  - 轮询等待上传进度条消失、全部附件卡片就绪且 `/发送|Send/i` 按钮 `enabled`（上限 30s），在 `textbox /询问 ChatGPT|Ask anything|Message ChatGPT/i` 填入指令并记录 `prevAssistantTurnCount` 后点击发送。
  - 若开启 `深度研究`，发送后留意澄清提问/确认按钮；遇业务架构澄清题以 `needs_clarification` 带回主智能体。
- **起跑确认、防抖完成与无损全量提取**：
  - 在提交前按当前 DOM 固定一种助手计数方式：旧界面用 `[data-message-author-role="assistant"]`；新版可核对 `main [data-talvt-turn-state]:has([data-response-body])`，不可统计用户气泡。只计算可见的生成停止按钮；若有 `data-talvt-turn-state`，还要确认本轮为 `complete`，正文连续两次稳定。
  - 轮询中若出现 `Continue generating / 继续生成` 按钮自动点击续写；若弹出 A/B 双卡对比回答则两份一并保存（标注 `Variant A/B`）。
  - **防误点代码块 Copy**：锁定本轮助手容器。旧界面找消息级 `button[data-testid="copy-turn-action-button"]`；新版在该轮的 `.turn-action-controls` 内找唯一名为 `复制` / `Copy` 的按钮，正文取该轮唯一 `[data-response-body]`，不要点用户「复制消息」或代码 Copy。配合 [clipboard-hook.md](clipboard-hook.md) 分段归档并核对回复正文（废弃过宽的 `main.last()`）。
  - **产物完整下载**：扫描 `lastAssistant` 内的生成图片、Chart、`sandbox:` 下载链接与代码文件按钮，通过原生下载或大图源完整保存至 `artifacts/`（禁仅存缩略图或 URL）。
