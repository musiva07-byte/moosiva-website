import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AnnouncementBar } from "./announcement-bar";
import { ANNOUNCEMENT_TEXT } from "@/lib/constants/site";

describe("AnnouncementBar", () => {
  it("renders the required announcement text", () => {
    const html = renderToStaticMarkup(<AnnouncementBar />);
    expect(html).toContain(ANNOUNCEMENT_TEXT);
  });

  it("repeats the text enough times for a seamless marquee loop", () => {
    const html = renderToStaticMarkup(<AnnouncementBar />);
    const occurrences = html.split(ANNOUNCEMENT_TEXT).length - 1;
    // At least the static fallback (1) plus a duplicated, multi-segment marquee track.
    expect(occurrences).toBeGreaterThanOrEqual(9);
  });

  it("never uses a blink/flash animation", () => {
    const html = renderToStaticMarkup(<AnnouncementBar />).toLowerCase();
    expect(html).not.toContain("blink");
    expect(html).not.toContain("flash");
    expect(html).not.toContain("animate-pulse");
  });

  it("uses the smooth CSS marquee animation, not a blink/marquee HTML tag", () => {
    const html = renderToStaticMarkup(<AnnouncementBar />);
    expect(html).toContain("animate-marquee");
    expect(html.toLowerCase()).not.toContain("<marquee");
  });

  it("provides a static, non-animated fallback for prefers-reduced-motion", () => {
    const html = renderToStaticMarkup(<AnnouncementBar />);
    // The reduced-motion fallback is a plain, hidden-by-default line that CSS
    // reveals under prefers-reduced-motion, with the animated track hidden instead.
    expect(html).toMatch(/<p class="hidden justify-center[^"]*motion-reduce:flex[^"]*">/);
    expect(html).toMatch(/motion-reduce:hidden/);
  });

  it("pauses the marquee on hover and keyboard focus", () => {
    const html = renderToStaticMarkup(<AnnouncementBar />);
    expect(html).toContain("group-hover:[animation-play-state:paused]");
    expect(html).toContain("group-focus-within:[animation-play-state:paused]");
  });

  it("is keyboard-focusable so the pause mechanism is reachable without a mouse", () => {
    const html = renderToStaticMarkup(<AnnouncementBar />);
    expect(html).toMatch(/tabindex="0"/i);
    expect(html).toContain(`aria-label="${ANNOUNCEMENT_TEXT}"`);
  });

  it("keeps the marquee track's duplicated text out of the accessibility tree", () => {
    const html = renderToStaticMarkup(<AnnouncementBar />);
    expect(html).toMatch(/aria-hidden="true"[^>]*>[\s\S]*New arrivals now available/);
  });
});
