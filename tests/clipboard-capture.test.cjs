const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const script = fs.readFileSync(process.env.ASK_MASTER_TEST_SOURCE || path.join(__dirname, "../references/clipboard-capture.js"), "utf8");

test("clipboard and DOM archives preserve Unicode across eval boundaries", async () => {
  for (const input of ["短回复 🧪", "x".repeat(8191) + "🧪" + "y".repeat(8190) + "😀" + "\u0001汉字\n".repeat(33500) + " END-归档-🧪"]) {
    const cb = {};
    const window = {};
    let archived;
    const context = vm.createContext({
      window, navigator: { clipboard: cb },
      document: { addEventListener() {}, removeEventListener() {}, querySelectorAll: () => [{ innerText: input }] },
      files: { write: async (_, text) => { archived = text; return "response.md"; } },
      page: { evaluate: async (fn, arg) => {
        const value = fn(arg);
        if (value === undefined) return value;
        // Browse replaces lone UTF-16 surrogates in values crossing the page boundary.
        const json = JSON.stringify(value, (_, x) =>
          typeof x === "string" ? Buffer.from(x, "utf8").toString("utf8") : x);
        assert.ok(Array.from(json).length <= 100_000, "eval result must fit Browse's JSON limit");
        return JSON.parse(json);
      } },
    });
    vm.runInContext(script, context);
    const item = { types: ["text/plain"], getType: async () => ({ text: async () => input }) };
    const long = input.length > 8192;
    const button = { click: () => long ? cb.write([item]) : cb.writeText(input) };
    const result = await context.captureReply(button, "#answer", "response.md");
    assert.equal(result.source, long ? "write" : "writeText");
    assert.ok(archived === input, "clipboard archive must exactly match input");
    archived = undefined;
    await context.archiveDomReply("#answer", "response.md");
    assert.ok(archived === input, "DOM archive must exactly match input");
  }
});

test("readBounded rejects a missing final code unit", async () => {
  const context = vm.createContext({});
  vm.runInContext(script, context);
  await assert.rejects(context.readBounded(1, () => ({ end: 0, text: "" })), /Truncated reply chunk/);
});
