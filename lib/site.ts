import { portfolio } from "@/data/portfolio";

function siteOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kizakixd.my.id")
      .origin;
  } catch {
    return "https://kizakixd.my.id";
  }
}
export const siteUrl = siteOrigin();
const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
export const contact =
  email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? { href: `mailto:${email}`, label: "via email" }
    : { href: portfolio.github, label: "via GitHub" };
