"use client";

import { useSyncExternalStore } from "react";

import { readSavedLooks, toggleSavedLook } from "./saved-looks";

export function SaveLookButton({ productId }: { productId: string }) {
  const saved = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("moosiva:saved-looks-change", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("moosiva:saved-looks-change", onStoreChange);
      };
    },
    () => readSavedLooks(window.localStorage).includes(productId),
    () => false,
  );

  function handleSave() {
    toggleSavedLook(window.localStorage, productId);
    window.dispatchEvent(new Event("moosiva:saved-looks-change"));
  }

  return (
    <button
      type="button"
      title="Save look"
      aria-label={saved ? "Remove saved look" : "Save look"}
      aria-pressed={saved}
      onClick={handleSave}
      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 bg-surface/92 text-rose-deep shadow-[0_6px_16px_rgba(90,53,59,0.14)] backdrop-blur-md transition-[color,transform,background-color,box-shadow] hover:scale-110 hover:bg-surface hover:text-primary hover:shadow-[0_8px_20px_rgba(90,53,59,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
        <path d="M20.8 5.8a5.2 5.2 0 0 0-7.4 0L12 7.2l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 22l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z" />
      </svg>
    </button>
  );
}
