import "server-only";
import { cookies } from "next/headers";

export const COOKIE_EMAIL = "selfish_email";
export const COOKIE_NAME = "selfish_name";
const ONE_YEAR = 60 * 60 * 24 * 365;

export type SelfishUser = { email: string; name: string };

export async function getServerUser(): Promise<SelfishUser | null> {
  const c = await cookies();
  const email = c.get(COOKIE_EMAIL)?.value;
  const name = c.get(COOKIE_NAME)?.value;
  return email && name ? { email, name } : null;
}

export async function setServerUser(user: SelfishUser): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_EMAIL, user.email, {
    maxAge: ONE_YEAR,
    httpOnly: false, // allow client to read for email-trigger UX
    sameSite: "lax",
    path: "/",
  });
  c.set(COOKIE_NAME, user.name, {
    maxAge: ONE_YEAR,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
