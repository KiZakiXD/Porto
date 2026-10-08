export interface PortfolioLink {
  label: string
  href: string
}

export interface Profile {
  name: string
  handle: string
  title: string
  bio: string
  location: string
  email: string
  links: PortfolioLink[]
  image: string
  approach: string
}

// Identity and contact links preserved from the production portfolio.
export const profile: Profile = {
  name: "Aldi Zakia Pratama",
  handle: "KIZAKIXD",
  title: "Developer Archive",
  bio: "Independent developer exploring AI, automation, web engineering, and onchain tools. I build practical software with small teams and learn through experiments that become working products.",
  location: "Indonesia",
  email: "aldizakiapratama@gmail.com",
  image: "/images/profile-real.jpeg",
  approach: "Learn the system. Test the idea. Build something useful.",
  links: [
    { label: "GitHub", href: "https://github.com/KiZakiXD" },
    { label: "Email", href: "mailto:aldizakiapratama@gmail.com" },
    { label: "WhatsApp", href: "https://wa.me/15812592235" },
    { label: "Instagram", href: "https://instagram.com/iamkizakixd" },
    { label: "Facebook", href: "https://www.facebook.com/share/1BxtFbdeZF/" },
  ],
}
