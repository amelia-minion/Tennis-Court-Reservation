import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

export const COACH_SESSION_COOKIE = "coach_session";
export const COACH_EMAIL_COOKIE = "coach_session_email";

const DEFAULT_COACH_EMAILS = [
  "ameliadangwork@gmail.com",
  "sangnhvt10012@gmail.com",
];

const DEFAULT_COACH_PASSWORD = "tennisso1thegioi143@!";
const DEFAULT_SESSION_SECRET = "xanh-tennis-coach-secret";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getCoachCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    ...(process.env.NODE_ENV === "production"
      ? { domain: ".xanhtennis.com" as const }
      : {}),
  };
}

export function getAllowedCoachEmails(): string[] {
  const configured = process.env.COACH_EMAIL?.trim();

  if (!configured) {
    return DEFAULT_COACH_EMAILS.map(normalizeEmail);
  }

  return configured
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);
}

export function getCoachPassword(): string {
  const configured = process.env.COACH_PASSWORD?.trim();
  return configured || DEFAULT_COACH_PASSWORD;
}

function getSessionSecret(): string {
  const configured = process.env.COACH_SESSION_SECRET?.trim();
  return configured || DEFAULT_SESSION_SECRET;
}

function signSession(email: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(normalizeEmail(email))
    .digest("hex");
}

function tokensMatch(token: string, email: string) {
  const expected = signSession(email);

  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyCoachCredentials(
  email: string,
  password: string
): boolean {
  const normalizedEmail = normalizeEmail(email);
  const allowedEmails = getAllowedCoachEmails();

  return (
    allowedEmails.includes(normalizedEmail) &&
    password.trim() === getCoachPassword()
  );
}

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

export function getLoggedInCoachEmailFromCookies(
  cookieStore: CookieReader
): string | null {
  const token = cookieStore.get(COACH_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const emailFromCookie = cookieStore.get(COACH_EMAIL_COOKIE)?.value;

  if (emailFromCookie) {
    const normalizedEmail = normalizeEmail(emailFromCookie);

    if (!getAllowedCoachEmails().includes(normalizedEmail)) {
      return null;
    }

    if (!tokensMatch(token, normalizedEmail)) {
      return null;
    }

    return normalizedEmail;
  }

  return (
    getAllowedCoachEmails().find((email) => tokensMatch(token, email)) ?? null
  );
}

export function applyCoachSessionCookies(
  response: NextResponse,
  email: string
) {
  const normalizedEmail = normalizeEmail(email);
  const token = signSession(normalizedEmail);
  const options = getCoachCookieOptions();

  response.cookies.set(COACH_SESSION_COOKIE, token, options);
  response.cookies.set(COACH_EMAIL_COOKIE, normalizedEmail, options);

  return response;
}

export function clearCoachSessionCookies(response: NextResponse) {
  const options = { ...getCoachCookieOptions(), maxAge: 0 };

  response.cookies.set(COACH_SESSION_COOKIE, "", options);
  response.cookies.set(COACH_EMAIL_COOKIE, "", options);

  return response;
}

export async function createCoachSession(email: string) {
  const cookieStore = await cookies();
  const normalizedEmail = normalizeEmail(email);
  const token = signSession(normalizedEmail);
  const options = getCoachCookieOptions();

  cookieStore.set(COACH_SESSION_COOKIE, token, options);
  cookieStore.set(COACH_EMAIL_COOKIE, normalizedEmail, options);
}

export async function clearCoachSession() {
  const cookieStore = await cookies();
  const options = { ...getCoachCookieOptions(), maxAge: 0 };

  cookieStore.set(COACH_SESSION_COOKIE, "", options);
  cookieStore.set(COACH_EMAIL_COOKIE, "", options);
}

export async function getLoggedInCoachEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return getLoggedInCoachEmailFromCookies(cookieStore);
}

export async function isCoachAuthenticated(): Promise<boolean> {
  return (await getLoggedInCoachEmail()) !== null;
}

export async function requireCoach() {
  const authenticated = await isCoachAuthenticated();

  if (!authenticated) {
    redirect("/coach/login");
  }
}
