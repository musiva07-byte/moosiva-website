export const SITE_NAME = "Moosiva Lux Wear";

export const MAIN_NAV = [
  { label: "New Arrivals", href: "/shop?sort=new_arrival" },
  { label: "Categories", href: "/#categories" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const ANNOUNCEMENT_TEXT =
  "New arrivals now available in Bahrain · Order easily through WhatsApp · Ethnic modest occasion wear ·";

export const POLICY_LINKS = [
  { label: "Delivery Policy", href: "/policies/delivery" },
  { label: "Returns & Exchange", href: "/policies/returns" },
  { label: "Privacy Policy", href: "/policies/privacy" },
] as const;

/** Dedicated footer shopping links, separate from the broader main navigation. */
export const FOOTER_SHOP_LINKS = [
  { label: "New Arrivals", href: "/shop?sort=new_arrival" },
  { label: "Categories", href: "/#categories" },
  { label: "All Products", href: "/shop" },
] as const;

/** Public customer-care pages and contact route. */
export const FOOTER_CARE_LINKS = [
  ...POLICY_LINKS,
  { label: "Contact", href: "/contact" },
] as const;
