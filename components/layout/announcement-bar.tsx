import { ANNOUNCEMENT_TEXT } from "@/lib/constants/site";

/** Repeated enough times that even an ultra-wide viewport never shows a gap before the loop. */
const MARQUEE_REPEAT_COUNT = 6;

function MarqueeSegments() {
  return (
    <>
      {Array.from({ length: MARQUEE_REPEAT_COUNT }, (_, index) => (
        <span key={index} className="mx-6 whitespace-nowrap">
          {ANNOUNCEMENT_TEXT}
        </span>
      ))}
    </>
  );
}

export function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-primary py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[11px]">
      {/* prefers-reduced-motion: one static, centered, non-animated line — no marquee, no blink. */}
      <p className="hidden justify-center px-4 text-center motion-reduce:flex">{ANNOUNCEMENT_TEXT}</p>

      {/* Default: smooth, slow, seamless right-to-left marquee.
          Focusable (tabIndex + aria-label) so keyboard users can pause it, per
          the "pause on hover and keyboard focus" requirement (WCAG 2.2.2 —
          moving content needs a pause mechanism). The duplicated visual copies
          inside are aria-hidden since this wrapper's aria-label is the single
          accessible announcement. */}
      <div
        tabIndex={0}
        aria-label={ANNOUNCEMENT_TEXT}
        className="group flex motion-reduce:hidden"
      >
        <div
          aria-hidden="true"
          className="flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        >
          <div className="flex shrink-0">
            <MarqueeSegments />
          </div>
          <div className="flex shrink-0">
            <MarqueeSegments />
          </div>
        </div>
      </div>
    </div>
  );
}
