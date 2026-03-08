"use client";

import { GlobeIcon, XLogoIcon, GithubLogoIcon } from "@phosphor-icons/react";

const links = [
  {
    label: "wiar8.com",
    href: "https://wiar8.com",
    icon: GlobeIcon,
  },
  {
    label: "wiar_8",
    href: "https://twitter.com/wiar_8",
    icon: XLogoIcon,
  },
  {
    label: "wiar8",
    href: "https://github.com/wiar8",
    icon: GithubLogoIcon,
  },
];

export default function Footer() {
  return (
    <footer className="fixed bottom-0 inset-x-0 flex justify-center pb-6 pointer-events-none">
      <div className="flex items-center gap-5 pointer-events-auto">
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-stone-600 hover:text-stone-400 transition-colors duration-150"
          >
            <Icon size={16} weight="regular" />
          </a>
        ))}
      </div>
    </footer>
  );
}
