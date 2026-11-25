# 回复归档（Browse v0.1.5）

将 [clipboard-capture.js](clipboard-capture.js) 作为 Browse `execute` 片段，末尾调用 `captureReply(copyButton, domSelector, archive)`。先核验 `copyButton` 唯一且属于已完成的助手消息；`domSelector` 必须唯一匹配该回复正文，不含思考或工具栏；`archive` 使用本轮隔离的文件名。

- 用 `page.evaluate(fn, arg, false)` 在主执行环境安装、读回和清理 Hook（原生工具为 `world: "main"`）。不得调用操作系统剪贴板写入。同一个标签页不要并发捕获。
- 捕获为空、拦截或校验失败时，不继续点 Copy。改用 `archiveDomReply(domSelector, archive)`，把收据标为 `degraded_completed` / `dom-text`（并非原始 Markdown）。
- 冻结正文、分段读取并验证长度，归档后只返回路径、字符数和来源。HTML 或 Canvas 正文另存时同样分段，不把全文塞进单次调用。
- 验收时实际点击网页 Copy 按钮，并用超过 100,000 字符、末尾带 Unicode 标记的样例比对全文。真实平台和无账户样例分开记录。
