import { describe, expect, it } from "vitest";
import { readChunked, writeChunked, type Kv } from "./chunks";

function memory(): Kv {
  const data = new Map<string, string>();
  return {
    get: async (key) => data.get(key) ?? null,
    set: async (key, value) => {
      data.set(key, value);
    },
    remove: async (key) => {
      data.delete(key);
    },
  };
}

describe("chunked secrets", () => {
  it("round-trips a value larger than one keychain item", async () => {
    const store = memory();
    const value = "x".repeat(4000);
    await writeChunked(store, "elite.cookies", value);
    expect(await readChunked(store, "elite.cookies")).toBe(value);
    await writeChunked(store, "elite.cookies", "short");
    expect(await readChunked(store, "elite.cookies")).toBe("short");
    expect(await store.get("elite.cookies.1")).toBeNull();
  });
});
