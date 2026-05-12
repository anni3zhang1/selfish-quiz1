"use client";

import { useState } from "react";
import PhoneInput from "@/components/PhoneInput";

export function PhoneField() {
  const [phone, setPhone] = useState("");
  const [showInput, setShowInput] = useState(false);

  if (!showInput) {
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="text-sm text-neutral-500 hover:text-neutral-700 transition underline underline-offset-4"
      >
        + Add phone number (optional)
      </button>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        Phone <span className="text-neutral-400 font-normal">(optional)</span>
      </label>
      <PhoneInput
        value={phone}
        onChange={(fullNumber, isValid) => {
          setPhone(isValid ? fullNumber : "");
        }}
      />
      <input type="hidden" name="phone" value={phone} />
      <p className="mt-1.5 text-xs text-neutral-400">
        We&rsquo;ll text you personalized content based on your quiz results.
      </p>
    </div>
  );
}
