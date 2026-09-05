# UI Context — Moosiva Ecommerce Website

## Theme

Moosiva Lux Wear is a premium ladies' boutique. The public website should feel elegant, feminine, warm, modern, and trustworthy. It should be more customer-facing and visually polished than the internal operations dashboard, but still fast and lightweight.

The visual language is a modern Kerala / South-Indian-inspired boutique for Bahrain, based on the Moosiva logo: muted mauve, dusty rose, blush, warm ivory, champagne, and rose-gold accents. Cultural direction belongs primarily in campaign imagery, drape, jewelry, texture, and restrained gold borders. Never use "Malayali" or "Mallu" in public copy. Hero copy: "ETHNIC • MODEST • OCCASION WEAR", "Ethnic elegance, curated for Bahrain", and "Discover elegant ethnic, modest, and occasion wear selected for women in Bahrain." Keep all hero copy in HTML, outside the image. A newly generated editorial asset may replace the generic campaign pending a client-approved photograph; document provenance and never describe it as a real catalog item or client-approved photo.

Avoid generic blue ecommerce styling, neon pink, dark technical dashboard styling, heavy gradients, low-contrast decorative text, and cluttered product layouts.

## Colors

Use CSS custom properties and Tailwind tokens. Do not scatter hardcoded hex colors across components.

| Role | CSS Variable | Value |
| --- | --- | --- |
| Page background | `--bg-base` | `#FCF8F0` |
| Soft background | `--bg-soft` | `#F3E7E5` |
| Surface | `--bg-surface` | `#FFFFFF` |
| Secondary surface | `--bg-surface-soft` | `#F8F2E9` |
| Primary text | `--text-primary` | `#2E2325` |
| Muted text | `--text-muted` | `#746267` |
| Deep rose text | `--text-rose-deep` | `#5A353B` |
| Primary accent | `--accent-primary` | `#9B5F68` |
| Primary accent hover | `--accent-primary-hover` | `#854E58` |
| Soft accent | `--accent-soft` | `#E7D2D5` |
| Champagne | `--accent-champagne` | `#C79A87` |
| Rose gold | `--accent-rose-gold` | `#B77C70` |
| Border | `--border-default` | `#E7D8D5` |
| Input border | `--border-input` | `#D8C4C1` |
| Error | `--state-error` | `#A34D52` |
| Success | `--state-success` | `#4F7A63` |
| Warning | `--state-warning` | `#A8753A` |
| Info | `--state-info` | `#6D758E` |

Suggested shadcn-style root variables:

```css
:root {
  --background: 20 38% 97%;
  --foreground: 348 14% 16%;
  --card: 0 0% 100%;
  --card-foreground: 348 14% 16%;
  --primary: 350 24% 49%;
  --primary-foreground: 20 40% 98%;
  --secondary: 10 30% 93%;
  --secondary-foreground: 348 22% 30%;
  --muted: 10 24% 94%;
  --muted-foreground: 345 9% 42%;
  --accent: 14 31% 66%;
  --accent-foreground: 348 18% 22%;
  --destructive: 357 36% 47%;
  --destructive-foreground: 0 0% 100%;
  --border: 10 22% 88%;
  --input: 10 19% 81%;
  --ring: 350 24% 49%;
  --radius: 0.9rem;
}
```

## Typography

| Role | Font | Variable |
| --- | --- | --- |
| UI text | Inter | `--font-sans` |
| Display headings | Cormorant Garamond, medium weight | `--font-display` |

Use Inter for body text, forms, prices, navigation, and checkout. Use Cormorant Garamond consistently for hero/section headings, product names, category names, About/Contact headings, and footer branding. Load only Latin through next/font with display swap; no extra script font. In the dark header, show the original rose-gold logo on a small ivory backing with ivory brand text and rose-gold underline. The dark footer retains the clean white logo filter. On light surfaces use the original rose-gold mark and deep rose brown text. Preserve logo aspect ratio; black is unsuitable directly against the dark header.

## Border Radius

| Context | Class |
| --- | --- |
| Small buttons / chips | `rounded-full` or `rounded-md` |
| Product cards | `rounded-2xl` |
| Forms / panels | `rounded-2xl` |
| Modals / overlays | `rounded-3xl` |

## Component Library

Use Tailwind CSS. Use shadcn/ui components where useful for forms, buttons, dialogs, sheets, and inputs.

## Layout Patterns

- Mobile-first design.
- Use a dark, high-contrast fashion header with Moosiva branding, centered commerce navigation, and a real WhatsApp CTA; do not add decorative cart/account controls.
- Homepage campaign sections should favor image-led commercial density: split editorial hero, a six-up category row, four larger New Arrivals cards, a compact five-service band, a strong horizontal promo, and a real-product lookbook strip.
- Product cards should be image-led with simple price and CTA.
- Product details should show image first, options and CTA clearly.
- Checkout should be a calm step or single-page form with clear sections.
- Header should include logo, shop link, contact/WhatsApp, and mobile menu.
- Footer should include brand, WhatsApp, Instagram, delivery/returns/privacy links.
- Homepage should have a premium hero, featured/new arrivals, category sections, and WhatsApp CTA.
- Avoid dense tables on public website.

## Product Image Rules

- One image per product in Phase 1.
- Use portrait-friendly display, recommended 4:5.
- Preserve aspect ratio.
- Do not stretch images.
- Use placeholders when no image exists.
- Product listing should be fast and lazy-loaded.

## Empty States

Use elegant empty states and never mock/demo products.

## Accessibility

Maintain contrast, labels, validation messages, mobile tap targets, and do not rely only on color.
