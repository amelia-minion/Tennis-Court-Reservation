import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const COACH_SESSION_COOKIE = "coach_session";
export const COACH_EMAIL_COOKIE = "coach_session_email";

const DEFAULT_COACH_EMAILS = [
  "ameliadangwork@gmail.com",
  "sangnhvt10012@gmail.com",
];

const DEFAULT_COACH_PASSWORD = "tennisso1thegioi143@!";
const DEFAULT_SESSION_SECRET = "xanh-tennis-coach-session-secret";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

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
    password === getCoachPassword()
  );
}

export async function createCoachSession(email: string) {
  const cookieStore = await cookies();
  const normalizedEmail = normalizeEmail(email);
  const token = signSession(normalizedEmail);

  cookieStore.set(COACH_SESSION_COOKIE, token, cookieOptions);
  cookieStore.set(COACH_EMAIL_COOKIE, normalizedEmail, cookieOptions);
}

export async function clearCoachSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COACH_SESSION_COOKIE);
  cookieStore.delete(COACH_EMAIL_COOKIE);
}

export async function getLoggedInCoachEmail(): Promise<string | null> {
  const cookieStore = await cookies();
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

export async function isCoachAuthenticated(): Promise<boolean> {
  return (await getLoggedInCoachEmail()) !== null;
}

export async function requireCoach() {
  const authenticated = await isCoachAuthenticated();

  if (!authenticated) {
    redirect("/coach/login");
  }
}
