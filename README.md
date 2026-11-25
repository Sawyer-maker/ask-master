<div align="center">

# ask-master

**Single-Brain Orchestration + 1-to-1 Concurrent Messenger Sub-Agents**

Pair fast, low-cost local coding "apprentices" with full-strength web frontier "masters" (`ChatGPT` · `Gemini` · `AIStudio`) via **OpenCode Browse**—forwarding prompts and up to 10 standalone files verbatim, harvesting raw Markdown replies plus generated images/code/Canvas artifacts, and leaving synthesis strictly to the Main Agent.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Agent Skill](https://img.shields.io/badge/Standard-Agent%20Skill-8A2BE2.svg)](./SKILL.md)
[![Browser Bridge](https://img.shields.io/badge/MCP-OpenCode%20Browse-00A67E.svg)](https://opencode.ai/product/browse)
[![Web Masters](https://img.shields.io/badge/Masters-ChatGPT%20%C2%B7%20Gemini%20%C2%B7%20AIStudio-FF8C00.svg)](#the-three-web-masters)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[English](./README.md) · [简体中文](./README.zh-CN.md)

[Origin & Philosophy](#origin--core-philosophy) · [Quick Start (Wish Setup)](#quick-start) · [Architecture](#core-architecture--non-negotiable-rules) · [The Masters](#the-three-web-masters) · [Browser MCP Comparison](#browser-control-bridge-comparison) · [Contributing](./CONTRIBUTING.md)

<br>

![ask-master Workflow Overview](./assets/workflow-anime.png)

*Figure: The `ask-master` 1-to-1 concurrent workflow—the Main Agent owns dispatch and final decisions, while dedicated lightweight couriers travel isolated `OpenCode Browse` lanes (`Tab 1 / Tab 2 / Tab 3`) to consult `OpenAI Astra`, `Gemini Neon`, and `Claude Fable`, bringing back verbatim replies plus all generated artifacts.*

</div>

---

## Origin & Core Philosophy

Inspired by [**Antigravity Zero-to-One & "Apprentice Asks Master" (`BV1thxB6dECQ`)**](https://www.bilibili.com/video/BV1thxB6dECQ/), `ask-master` solves a daily pain point for AI-assisted engineering and research:

- **Why Bridge Local CLI to Web Masters?** Running top-tier reasoning models exclusively via pay-per-token APIs burns through budgets (and risks rate limits or account throttling), while web subscriptions (`ChatGPT`, `Gemini`, `AIStudio`) already include generous flagship reasoning quotas—yet sit stranded in browser tabs without visibility into your local repository.
- **Orthogonal Role Split (Flagship Quality on a Shoestring Budget)**:
  - **Fast, Cheap Sub-Agents as "Apprentices"**: Read local files, redact secrets, package logs/code, and travel isolated browser lanes **`1 Web Master = 1 Dedicated Courier`** in parallel—**never compressing prompts or making architectural decisions**.
  - **Full-Power Web Models as "Masters"**: Handle deep system architecture, experiment root-cause attribution, and gnarly debugging at locked maximum tiers (`6 Pro` / `Extra High` / `高（超级详尽）`).
  - **Main Agent as "Sole Brain"**: Harvests verbatim Markdown alongside full-resolution images, code, and Canvas exports, runs optional Round 2 anonymous peer reviews across Masters, and makes the final call.

---

## Quick Start

> This skill drives [**OpenCode Browse**](https://opencode.ai/product/browse) directly. (If you want to evaluate alternatives such as [`AgentLimb`](https://github.com/hooosberg/AgentLimb), see the [Browser Control Bridge Comparison](#browser-control-bridge-comparison) below.)

### Option A — One-Prompt "Wish" Setup (Recommended)

Copy and paste the prompt below directly to your AI coding agent (**Antigravity**, **Claude Code**, **OpenCode**, **Codex**, **Cursor**, or **Gemini CLI**) and let it install, configure, and verify everything for you:

```text
Please install and configure the `ask-master` skill from https://github.com/Sawyer-maker/ask-master for my environment:
1. Install `SKILL.md` and `references/` into my global skills directory (for example `~/.gemini/config/skills/ask-master/` or `.claude/skills/ask-master/`, keeping UTF-8 without BOM and LF line endings).
2. Check whether `OpenCode Browse` (`browse` MCP) is installed and connected via `browse` `status`. If missing or disconnected, follow https://opencode.ai/product/browse to install it, configure my agent MCP config, and guide me to pair it with my logged-in Chrome/Edge browser.
3. Verify `browse` `status` returns `"connected": true` and confirm `SKILL.md` + `references/` are loaded and ready so I can trigger `ask-master` directly in conversation.
```

### Option B — Manual CLI Setup

1. **Install & Pair `OpenCode Browse`**: Follow [https://opencode.ai/product/browse](https://opencode.ai/product/browse), pair the extension with your logged-in Chrome/Edge, and verify `browse` `status` reports `"connected": true`.
2. **Clone & Copy the Skill**:
   ```bash
   git clone https://github.com/Sawyer-maker/ask-master.git
   # Copy SKILL.md and references/ into your agent's global skills folder, e.g.:
   # ~/.gemini/config/skills/ask-master/  or  ~/.claude/skills/ask-master/
   ```

### "Wish" Usage Examples (Zero-Friction Trigger)

Once installed and signed in to `ChatGPT` / `Gemini` / `AIStudio` in your browser, just tell your agent what you want:

- **Architecture / Research Escalation**:
  > *"Use `ask-master` to send these design docs and source files verbatim to ChatGPT, Gemini, and AIStudio, collect all replies and diagrams, and synthesize the best plan for me."*
- **Stubborn Bug Attribution**:
  > *"I'm stuck on this race condition. Use `ask-master` to consult ChatGPT and AIStudio with the full error trace and `src/worker.ts`, keeping their tabs open so I can inspect."*
- **Follow-up Cross-Review (Same Context)**:
  > *"Reuse those open Master tabs from `ask-master` to run an anonymized Round 2 cross-review on their disagreements."*

---

## Core Architecture & Non-Negotiable Rules

| Role | Responsibilities & Guardrails |
| --- | --- |
| **Main Agent (Sole Brain)** | Decides whether to consult **1, 2, or 3 web masters**; redacts secrets on `.ask-master/<run_id>/staging/` copies; prepares the uncompressed prompt (`prompt_r<round>.md`) plus up to **10 standalone files**; reads every raw reply and artifact firsthand; optionally triggers Round 2 same-context follow-ups or anonymous cross-reviews (`Master A/B/C`, max 2 rounds) and makes the final call. |
| **Messenger Sub-Agents (1-to-1 Couriers)** | Strictly **`1 Master = 1 Dedicated Sub-Agent = 1 Explicit tabId + Isolated r<round> Directory`**; loads only its own platform playbook; **never summarizes, compresses, or rewrites** the prompt; treats all web content, replies, and downloads as **untrusted data** (anti-prompt-injection); keeps tabs open after completion and returns only a 5-field structured receipt (`completed` / `degraded_completed` / `needs_clarification` / `needs_handoff` / `failed`). |

---

## The Three Web Masters

Unified policy: **Always lock onto the strongest available model and highest thinking tier for the current account, verified via visible text & `aria-label` Pre-Send hard assertions (max 3 repair attempts, then `handoff()`; never silently downgrade).**

| Master | Platform & Route Status | Max-Strength Locking Policy (Pre-Send Hard Assertion) | Playbook |
| --- | --- | --- | --- |
| **OpenAI Astra** | [ChatGPT](https://chatgpt.com/) (Built-in Route) | Chat mode only + Temporary Chat OFF + strongest available model & rightmost thinking slider (`aria-valuenow === aria-valuemax`, e.g., `6 Pro`) | [references/chatgpt.md](references/chatgpt.md) |
| **Gemini Neon** | [AIStudio](https://aistudio.google.com/prompts/new_chat?model=gemini-4-neon) / [Gemini](https://gemini.google.com/app) (Built-in Dual Endpoints) | AIStudio: verify model card + `Thinking Level === Extra High` (no downgrade without approval); Gemini: `4 Carbon` (if unlocked) else `4 Neon` + positive/negative assertion for `高（超级详尽）` / `High (Extremely detailed)` | [references/aistudio.md](references/aistudio.md) · [references/gemini.md](references/gemini.md) |
| **Claude Fable** | Claude Web (Extensible Slot) | Follows the identical Pre-Send hard-assertion, lossless extraction & artifact-capture protocol; add `references/claude.md` to enable (see [CONTRIBUTING.md](./CONTRIBUTING.md)) | Extensible |

---

## Browser Control Bridge Comparison

Choosing the right browser MCP directly impacts auth stability, token cost, and 1-to-1 concurrency:

| Dimension | [**OpenCode Browse**](https://opencode.ai/product/browse) (Skill Default) | [**AgentLimb**](https://github.com/hooosberg/AgentLimb) (Local Reference) | [**Chrome DevTools MCP**](https://github.com/ChromeDevTools/chrome-devtools-mcp) | [**Playwright MCP**](https://github.com/microsoft/playwright-mcp) |
| --- | --- | --- | --- | --- |
| **Architecture** | Rust relay + Chrome extension + QuickJS sandbox | Zero-dep Node host + MV3 extension + persistent CDP | Google official Puppeteer + CDP (no extension) | Microsoft cross-browser automation MCP |
| **Auth Reuse & Anti-Bot** | ★★★★★ Reuses logged-in Chrome/Edge, human-like input, native `handoff()` on CAPTCHA/2FA | ★★★★☆ Reuses real Chrome + multi-profile aliases (`browser`), CSP-bypassing eval; no blocking `handoff()` | ★★★★☆ `--autoConnect` (Chrome 144+) works but prompts manual *Allow* on each session | ★★☆☆☆ Isolated profile triggers 2FA/bot gates; `--extension` mode still hits edge bugs |
| **Token & Tool Efficiency** | ★★★★★ 3 tools (~7.5 KB); single QuickJS `execute` chains asserts, uploads, polling & disk writes | ★★★★☆ `v0.8` 16 tools, `browser_batch` (≤20 steps) & `javascript_eval` | ★★★☆☆ Heavy default toolset (`--slim` option); `evaluate_script` writes directly to file | ★★☆☆☆ Default full A11y snapshots burn context fast unless switched to `browser_run_code` |
| **1-to-1 Concurrency & Files** | ★★★★★ Explicit `tabId` parallel tabs, native multi-file upload, `files.write` | ★★☆☆☆ Single-controller serial lock across separate MCP clients; no native `filechooser`/download API | ★★★★☆ `v1.8+` `--pageIdRouting` & array `upload_file`; downloads go to system folder | ★★★☆☆ Best native uploads & `--output-dir` downloads; lacks stateless `tabId` on actions |
| **Setup & Remote SSH** | One-time pairing code; first-class `browse install --remote` (SSH/Tailscale) | **One-prompt pairing** (30-min auto-trust, no pairing code); `127.0.0.1` local-only, ASCII path on Win | Requires Chrome 144+ remote debugging flag; SSH via CDP tunnel | Zero-config local launch; `--port` SSE supported |

- **Pros, Cons & Limitations Summary**:
  - **OpenCode Browse** *(Used by this Skill)*: Best fit for 3-way `1-to-1` parallel fan-out, 10-file native uploads, remote SSH devboxes driving local browsers, and reliable `handoff()` on login/CAPTCHA checks; requires installing the relay + extension.
  - **[AgentLimb](https://github.com/hooosberg/AgentLimb)**: Shines in purely local setups needing **one-prompt zero-pairing-code onboarding** or **multi-profile Chrome switching** (`browser: "<alias>"`), with lightweight `browser_batch` + `site_memory`. Limitations for `ask-master`: single-controller serial lock blocks concurrent independent MCP sub-agents, no native `filechooser`/download-dir APIs, `127.0.0.1`-only without remote relay, and Windows unpacked extensions require ASCII-only paths.
  - **Chrome DevTools MCP / Playwright MCP**: Choose Chrome DevTools MCP (`--autoConnect`) when third-party extensions are banned on Chrome 144+ or frontend profiling is needed; choose Playwright MCP/CLI for unauthenticated QA testing and download-heavy E2E pipelines.

---

<details>
<summary><strong>Repository Structure & Key Engineering Guardrails (Click to Expand)</strong></summary>

```text
ask-master/
├── README.md                        # English documentation (main landing page)
├── README.zh-CN.md                  # 简体中文完整文档
├── SKILL.md                         # Core Agent Skill specification (concise, OpenCode Browse)
├── CONTRIBUTING.md                  # Guide for adding new Master playbooks
├── CHANGELOG.md                     # Release history
├── LICENSE                          # MIT License
├── references/
│   ├── chatgpt.md                   # ChatGPT (OpenAI Astra) playbook
│   ├── aistudio.md                  # AIStudio (Gemini Neon) playbook
│   ├── gemini.md                    # Gemini (Gemini Neon) playbook
│   └── clipboard-hook.md            # Side-effect-free in-page clipboard hook + DOM fallback
├── assets/
│   └── workflow-anime.png           # 16:9 anime workflow hero banner
└── prompts/
    └── workflow-illustration.md     # Bilingual generation prompts for the workflow banner
```

- **In-Page Side-Effect-Free Clipboard Hook**: Intercepts `writeText`, `write([ClipboardItem])`, and `copy` events in-page **without** writing back to the OS clipboard during parallel runs; falls back cleanly to DOM / `data-markdown-copy-text` when extension isolated worlds or strict CSP block `MAIN`-world interception.
- **No False-Positive Completion**: Tracks assistant-only turns (`prevAssistantTurnCount`) + 15s post-send start confirmation + 4–5s double-frame Stop debounce; targets message-level copy controls instead of code-block buttons.
- **`Uint8Array` & Locale Safety**: Uses `await files.read(path, "utf8")` for text to prevent raw byte stringification (`45,45,45,...`), uses bilingual regexes without Chinese `\b`, and rejects Gemini `"低 快速、高效"` false positives via positive/negative assertions.
- **Round Isolation & Context Reuse**: Archives under `.ask-master/<run_id>/<master>/r<round>/` so Round 2 follow-ups never overwrite Round 1; validates `(run_id, master, conversationUrl)` before reusing open tabs, while starting fresh sessions for unrelated tasks.

</details>

---

## Inspiration, Art Credits & License

- **Workflow Inspiration**: ["Antigravity Zero-to-One & Apprentice Asks Master" (`BV1thxB6dECQ`)](https://www.bilibili.com/video/BV1thxB6dECQ/); ecosystem references to [anomalyco/browse](https://github.com/anomalyco/browse) and [hooosberg/AgentLimb](https://github.com/hooosberg/AgentLimb).
- **Character Art Credits**: Visual designs for **OpenAI Astra**, **Gemini Neon**, and **Claude Fable** in `assets/workflow-anime.png` are adapted from the MIT-licensed project [chen-006/meow-ai-arena](https://github.com/chen-006/meow-ai-arena):
  > Character design reference: **小叶子XIYZ** (Bilibili); art and production: **喵了个猫了个咪了个猫**.
- **License**: Released under the [MIT License](./LICENSE). Company, platform, and model names belong to their respective owners and are used strictly for routing and character identification, implying no official endorsement or affiliation.
