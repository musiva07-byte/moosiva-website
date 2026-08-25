import { ANNOUNCEMENT_TEXT } from "@/lib/constants/site";

export function AnnouncementBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:text-[11px]">
      {ANNOUNCEMENT_TEXT}
    </div>
  );
}
