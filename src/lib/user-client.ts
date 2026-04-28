"use client";
import Cookies from "js-cookie";

export const COOKIE_EMAIL = "selfish_email";
export const COOKIE_NAME = "selfish_name";

export type SelfishUser = { email: string; name: string };

export function getClientUser(): SelfishUser | null {
  const email = Cookies.get(COOKIE_EMAIL);
  const name = Cookies.get(COOKIE_NAME);
  return email && name ? { email, name } : null;
}
