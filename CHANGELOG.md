# Changelog

All notable changes to `ask-master` are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-11-25

### Added
- **Main-Orchestrator + 1-to-1 Concurrent Courier Architecture** in `SKILL.md`: Main Agent dispatches 1–3 lightweight sub-agents in parallel (each bound to 1 web Master, 1 playbook, and 1 explicit `tabId`), strictly forbids prompt compression or sub-agent overreach, and keeps synthesis/final decisions with the Main Agent.
- **Pre-Send Hard-Assertion Playbooks** for `ChatGPT` (`references/chatgpt.md`), `AIStudio` (`references/aistudio.md`), and `Gemini` (`references/gemini.md`), including positive/negative thinking-level verification, assistant-only turn tracking, and `degraded_completed` reporting.
- **In-Page Side-Effect-Free Clipboard Hook** (`references/clipboard-hook.md`) supporting `writeText`, `write([ClipboardItem])`, and `copy` events without OS clipboard contention, plus automatic DOM fallback.
- **High-Star Bilingual Documentation**: `README.md`, `README.zh-CN.md`, `CONTRIBUTING.md`, `assets/workflow-anime.png`, and `prompts/workflow-illustration.md`, including inspiration credits (`BV1thxB6dECQ`), character art attribution (`chen-006/meow-ai-arena`), wish-driven Agent setup prompts, and a browser MCP comparison (`OpenCode Browse`, `AgentLimb`, `Chrome DevTools MCP`, `Playwright MCP`).
