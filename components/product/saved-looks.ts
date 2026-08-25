export const SAVED_LOOKS_STORAGE_KEY = "moosiva:saved-looks";

export function readSavedLooks(storage: Pick<Storage, "getItem">): string[] {
  try {
    const value = JSON.parse(storage.getItem(SAVED_LOOKS_STORAGE_KEY) ?? "[]");
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function toggleSavedLook(
  storage: Pick<Storage, "getItem" | "setItem">,
  productId: string,
): boolean {
  const saved = new Set(readSavedLooks(storage));
  const willSave = !saved.has(productId);

  if (willSave) saved.add(productId);
  else saved.delete(productId);

  storage.setItem(SAVED_LOOKS_STORAGE_KEY, JSON.stringify([...saved]));
  return willSave;
}
