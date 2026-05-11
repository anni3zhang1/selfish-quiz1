"use client";

import { useState, useRef, useEffect } from "react";

type Country = {
  code: string;  // ISO 2-letter
  name: string;
  dial: string;  // e.g. "+1"
  digits: number; // expected digits in national number
  flag: string;
};

const COUNTRIES: Country[] = [
  { code: "US", name: "United States", dial: "+1", digits: 10, flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "CA", name: "Canada", dial: "+1", digits: 10, flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "GB", name: "United Kingdom", dial: "+44", digits: 10, flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "AU", name: "Australia", dial: "+61", digits: 9, flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "DE", name: "Germany", dial: "+49", digits: 11, flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "FR", name: "France", dial: "+33", digits: 9, flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "IT", name: "Italy", dial: "+39", digits: 10, flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "ES", name: "Spain", dial: "+34", digits: 9, flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "NL", name: "Netherlands", dial: "+31", digits: 9, flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "SE", name: "Sweden", dial: "+46", digits: 10, flag: "\u{1F1F8}\u{1F1EA}" },
  { code: "CH", name: "Switzerland", dial: "+41", digits: 9, flag: "\u{1F1E8}\u{1F1ED}" },
  { code: "JP", name: "Japan", dial: "+81", digits: 10, flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "KR", name: "South Korea", dial: "+82", digits: 10, flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "CN", name: "China", dial: "+86", digits: 11, flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "IN", name: "India", dial: "+91", digits: 10, flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "BR", name: "Brazil", dial: "+55", digits: 11, flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "MX", name: "Mexico", dial: "+52", digits: 10, flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "IL", name: "Israel", dial: "+972", digits: 9, flag: "\u{1F1EE}\u{1F1F1}" },
  { code: "SG", name: "Singapore", dial: "+65", digits: 8, flag: "\u{1F1F8}\u{1F1EC}" },
  { code: "NZ", name: "New Zealand", dial: "+64", digits: 9, flag: "\u{1F1F3}\u{1F1FF}" },
  { code: "IE", name: "Ireland", dial: "+353", digits: 9, flag: "\u{1F1EE}\u{1F1EA}" },
  { code: "PT", name: "Portugal", dial: "+351", digits: 9, flag: "\u{1F1F5}\u{1F1F9}" },
  { code: "DK", name: "Denmark", dial: "+45", digits: 8, flag: "\u{1F1E9}\u{1F1F0}" },
  { code: "NO", name: "Norway", dial: "+47", digits: 8, flag: "\u{1F1F3}\u{1F1F4}" },
  { code: "FI", name: "Finland", dial: "+358", digits: 10, flag: "\u{1F1EB}\u{1F1EE}" },
  { code: "AT", name: "Austria", dial: "+43", digits: 10, flag: "\u{1F1E6}\u{1F1F9}" },
  { code: "BE", name: "Belgium", dial: "+32", digits: 9, flag: "\u{1F1E7}\u{1F1EA}" },
  { code: "PL", name: "Poland", dial: "+48", digits: 9, flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "AE", name: "UAE", dial: "+971", digits: 9, flag: "\u{1F1E6}\u{1F1EA}" },
  { code: "ZA", name: "South Africa", dial: "+27", digits: 9, flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "TW", name: "Taiwan", dial: "+886", digits: 9, flag: "\u{1F1F9}\u{1F1FC}" },
  { code: "HK", name: "Hong Kong", dial: "+852", digits: 8, flag: "\u{1F1ED}\u{1F1F0}" },
  { code: "PH", name: "Philippines", dial: "+63", digits: 10, flag: "\u{1F1F5}\u{1F1ED}" },
  { code: "TH", name: "Thailand", dial: "+66", digits: 9, flag: "\u{1F1F9}\u{1F1ED}" },
  { code: "NG", name: "Nigeria", dial: "+234", digits: 10, flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "KE", name: "Kenya", dial: "+254", digits: 9, flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "CO", name: "Colombia", dial: "+57", digits: 10, flag: "\u{1F1E8}\u{1F1F4}" },
  { code: "AR", name: "Argentina", dial: "+54", digits: 10, flag: "\u{1F1E6}\u{1F1F7}" },
  { code: "CL", name: "Chile", dial: "+56", digits: 9, flag: "\u{1F1E8}\u{1F1F1}" },
];

// Format a digit string into groups for readability
function formatNumber(digits: string, totalExpected: number): string {
  if (totalExpected === 10) {
    // (XXX) XXX-XXXX
    const area = digits.slice(0, 3);
    const mid = digits.slice(3, 6);
    const last = digits.slice(6, 10);
    if (digits.length <= 3) return area;
    if (digits.length <= 6) return `(${area}) ${mid}`;
    return `(${area}) ${mid}-${last}`;
  }
  if (totalExpected === 11) {
    // XX XXXXX-XXXX (Brazil style) or XXX XXXX XXXX
    const a = digits.slice(0, 3);
    const b = digits.slice(3, 7);
    const c = digits.slice(7, 11);
    if (digits.length <= 3) return a;
    if (digits.length <= 7) return `${a} ${b}`;
    return `${a} ${b} ${c}`;
  }
  if (totalExpected === 9) {
    // XXX XXX XXX
    const a = digits.slice(0, 3);
    const b = digits.slice(3, 6);
    const c = digits.slice(6, 9);
    if (digits.length <= 3) return a;
    if (digits.length <= 6) return `${a} ${b}`;
    return `${a} ${b} ${c}`;
  }
  if (totalExpected === 8) {
    // XXXX XXXX
    const a = digits.slice(0, 4);
    const b = digits.slice(4, 8);
    if (digits.length <= 4) return a;
    return `${a} ${b}`;
  }
  // Fallback: groups of 3
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

export default function PhoneInput({
  value,
  onChange,
  disabled,
}: {
  value: string;  // full E.164 string like "+14155551234"
  onChange: (fullNumber: string, isValid: boolean) => void;
  disabled?: boolean;
}) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [rawDigits, setRawDigits] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (dropdownOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [dropdownOpen]);

  function handleDigitChange(input: string) {
    const digits = input.replace(/\D/g, "").slice(0, country.digits);
    setRawDigits(digits);
    const full = `${country.dial}${digits}`;
    onChange(full, digits.length === country.digits);
  }

  function handleCountrySelect(c: Country) {
    setCountry(c);
    setDropdownOpen(false);
    setSearch("");
    // Revalidate with new country
    const digits = rawDigits.slice(0, c.digits);
    setRawDigits(digits);
    const full = `${c.dial}${digits}`;
    onChange(full, digits.length === c.digits);
  }

  const filtered = search
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES;

  const isComplete = rawDigits.length === country.digits;
  const displayValue = rawDigits ? formatNumber(rawDigits, country.digits) : "";

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex gap-2">
        {/* Country selector */}
        <button
          type="button"
          onClick={() => !disabled && setDropdownOpen(!dropdownOpen)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-3 border border-neutral-300 rounded-lg bg-white hover:border-neutral-400 transition text-sm shrink-0 disabled:opacity-50"
        >
          <span className="text-lg leading-none">{country.flag}</span>
          <span className="text-neutral-600">{country.dial}</span>
          <svg width="10" height="6" viewBox="0 0 10 6" className="text-neutral-400 ml-0.5">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        {/* Number input */}
        <div className="relative flex-1">
          <input
            type="tel"
            value={displayValue}
            onChange={(e) => handleDigitChange(e.target.value)}
            disabled={disabled}
            placeholder={`${"0".repeat(country.digits).replace(/(\d{3})(?=\d)/g, "$1 ").trim()}`}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50"
          />
          {rawDigits.length > 0 && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${isComplete ? "text-emerald-600" : "text-neutral-400"}`}>
              {rawDigits.length}/{country.digits}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-neutral-100">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCountrySelect(c)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-50 transition text-left ${
                  c.code === country.code ? "bg-neutral-100 font-medium" : ""
                }`}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-neutral-400 text-xs">{c.dial}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-neutral-400 text-center">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
