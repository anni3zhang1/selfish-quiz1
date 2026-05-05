"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function getEmailCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)selfish_email=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function clearSession() {
  document.cookie = "selfish_email=; max-age=0; path=/";
  document.cookie = "selfish_name=; max-age=0; path=/";
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEmail(getEmailCookie());
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function signOut() {
    clearSession();
    setEmail(null);
    setOpen(false);
    router.push("/start");
  }

  if (pathname === "/start") return null;

  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 sm:px-8 h-12 bg-neutral-50/80 backdrop-blur-sm border-b border-neutral-200/60">
      <Link
        href="/"
        className="text-base font-semibold tracking-tight text-neutral-900 hover:opacity-70 transition-opacity"
      >
        Self<em>ish</em>
      </Link>

      {email && (
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Account menu"
            aria-expanded={open}
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
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-neutral-200 bg-white shadow-lg py-1 text-sm">
              <Link
                href={`/profile?email=${encodeURIComponent(email)}`}
                className="block px-4 py-2 text-neutral-800 hover:bg-neutral-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                My Profile
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="block w-full text-left px-4 py-2 text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
