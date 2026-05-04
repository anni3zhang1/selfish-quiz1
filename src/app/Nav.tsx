"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  if (pathname === "/start") return null;

  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 sm:px-8 h-12 bg-neutral-50/80 backdrop-blur-sm border-b border-neutral-200/60">
      <Link
        href="/"
        className="text-base font-semibold tracking-tight text-neutral-900 hover:opacity-70 transition-opacity"
      >
        Self<em>ish</em>
      </Link>

      <Link
        href="/profile"
        aria-label="Your profile"
        className="flex items-center justify-center w-10 h-10 -mr-2 rounded-full hover:bg-neutral-100 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="text-neutral-600"
        >
          <circle cx="10" cy="6.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M2.5 17c0-3.314 3.358-6 7.5-6s7.5 2.686 7.5 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Link>
    </nav>
  );
}
