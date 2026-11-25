# Contributing to `ask-master`

Thank you for helping improve `ask-master`!

## Adding a New Web Master Playbook

To add support for an extensible web Master (such as `Claude Fable` / Claude Web):

1. Create a concise playbook at `references/<platform>.md` (kebab-case filename).
2. Document and verify live DOM behavior across all 4 checkpoints:
   - **Pre-Send Hard Assertions**: Explicitly read visible UI text and `aria-label` to verify the strongest available model and highest thinking tier before sending (max 3 repair retries, then `handoff()`).
   - **Native File Upload**: Prefer `Promise.all([page.waitForEvent("filechooser"), trigger.click()])` supporting up to 10 standalone files with attachment-chip readiness verification.
   - **Assistant-Only Turn Counting & Debounce**: Track assistant-side containers only (`prevAssistantTurnCount`), verify post-send start within 15s, and debounce `:visible` Stop buttons for 4–5s across two consecutive checks.
   - **Lossless Extraction & Artifacts**: Target message-level copy controls with in-page `references/clipboard-hook.md` + platform DOM fallback, and download full-resolution images/code/Canvas panels rather than thumbnails.
3. Keep selector regexes bilingual (English + Chinese where applicable) and avoid `\b` word boundaries on CJK characters in JavaScript.
4. Keep `SKILL.md` concise and update the Master matrix in `SKILL.md`, `README.md`, and `README.zh-CN.md`.

## File Hygiene

- Encode all Markdown files as **UTF-8 without BOM** with **LF (`\n`)** line endings.
- Never commit secrets, personal cookies, tokens, or `.ask-master/` run logs.
