import { describe, expect, it } from "vitest";

import { readSavedLooks, SAVED_LOOKS_STORAGE_KEY, toggleSavedLook } from "./saved-looks";

function memoryStorage(initial?: string) {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (key: string, next: string) => {
      expect(key).toBe(SAVED_LOOKS_STORAGE_KEY);
      value = next;
    },
  };
}

describe("saved looks", () => {
  it("saves and removes a product using browser-local storage only", () => {
    const storage = memoryStorage();
    expect(toggleSavedLook(storage, "product-1")).toBe(true);
    expect(readSavedLooks(storage)).toEqual(["product-1"]);
    expect(toggleSavedLook(storage, "product-1")).toBe(false);
    expect(readSavedLooks(storage)).toEqual([]);
  });

  it("safely ignores malformed or non-string stored values", () => {
    expect(readSavedLooks(memoryStorage("not-json"))).toEqual([]);
    expect(readSavedLooks(memoryStorage('["product-1", 7, null]'))).toEqual(["product-1"]);
  });
});
