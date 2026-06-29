import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

export const COACH_SESSION_COOKIE = "coach_session";
/** @deprecated Legacy second cookie; cleared on login/logout. */
export const COACH_EMAIL_COOKIE = "coach_session_email";

const DEFAULT_COACH_EMAILS = [
  "ameliadangwork@gmail.com",
  "sangnhvt10012@gmail.com",
];

const DEFAULT_COACH_PASSWORD = "tennisso1thegioi143@!";
const DEFAULT_SESSION_SECRET = "xanh-tennis-coach-secret";

function normalizeEmail(email: string) {
  return decodeCookieValue(email).trim().toLowerCase();
}

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getCoachCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
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

function parseSessionValue(rawValue: string): string | null {
  const value = decodeCookieValue(rawValue);
  const separator = value.indexOf("|");

  if (separator === -1) {
    return null;
  }

  const email = normalizeEmail(value.slice(0, separator));
  const token = value.slice(separator + 1);

  if (!getAllowedCoachEmails().includes(email)) {
    return null;
  }

  if (!tokensMatch(token, email)) {
    return null;
  }

  return email;
}

function buildSessionValue(email: string) {
  const normalizedEmail = normalizeEmail(email);
  return `${normalizedEmail}|${signSession(normalizedEmail)}`;
}

const FORM_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

function signFormPayload(payload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(`form:${payload}`)
    .digest("hex");
}

export function createCoachFormToken(email: string): string {
  const normalizedEmail = normalizeEmail(email);
  const exp = Date.now() + FORM_TOKEN_TTL_MS;
  const payload = `${normalizedEmail}|${exp}`;
  const signature = signFormPayload(payload);

  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function verifyCoachFormToken(
  token: string | null | undefined
): string | null {
  if (!token) {
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const signatureStart = decoded.lastIndexOf("|");

    if (signatureStart === -1) {
      return null;
    }

    const payload = decoded.slice(0, signatureStart);
    const signature = decoded.slice(signatureStart + 1);
    const expected = signFormPayload(payload);

    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }

    const separator = payload.indexOf("|");

    if (separator === -1) {
      return null;
    }

    const email = normalizeEmail(payload.slice(0, separator));
    const exp = Number(payload.slice(separator + 1));

    if (!Number.isFinite(exp) || Date.now() > exp) {
      return null;
    }

    if (!getAllowedCoachEmails().includes(email)) {
      return null;
    }

    return email;
  } catch {
    return null;
  }
}

export function resolveCoachAuth(options: {
  cookieStore?: CookieReader;
  formToken?: string | null;
}): string | null {
  if (options.cookieStore) {
    const fromCookie = getLoggedInCoachEmailFromCookies(options.cookieStore);

    if (fromCookie) {
      return fromCookie;
    }
  }

  return verifyCoachFormToken(options.formToken);
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
  const sessionValue = cookieStore.get(COACH_SESSION_COOKIE)?.value;

  if (sessionValue) {
    const parsed = parseSessionValue(sessionValue);
    if (parsed) {
      return parsed;
    }
  }

  const legacyToken = sessionValue;
  if (!legacyToken || legacyToken.includes("|")) {
    return null;
  }

  const emailFromCookie = cookieStore.get(COACH_EMAIL_COOKIE)?.value;

  if (emailFromCookie) {
    const normalizedEmail = normalizeEmail(emailFromCookie);

    if (!getAllowedCoachEmails().includes(normalizedEmail)) {
      return null;
    }

    if (!tokensMatch(legacyToken, normalizedEmail)) {
      return null;
    }

    return normalizedEmail;
  }

  return (
    getAllowedCoachEmails().find((email) => tokensMatch(legacyToken, email)) ??
    null
  );
}

export function applyCoachSessionCookies(
  response: NextResponse,
  email: string
) {
  const options = getCoachCookieOptions();
  const cleared = { ...options, maxAge: 0 };

  response.cookies.set(COACH_SESSION_COOKIE, buildSessionValue(email), options);
  response.cookies.set(COACH_EMAIL_COOKIE, "", cleared);

  return response;
}

export function clearCoachSessionCookies(response: NextResponse) {
  const cleared = { ...getCoachCookieOptions(), maxAge: 0 };

  response.cookies.set(COACH_SESSION_COOKIE, "", cleared);
  response.cookies.set(COACH_EMAIL_COOKIE, "", cleared);

  return response;
}

export async function createCoachSession(email: string) {
  const cookieStore = await cookies();
  const options = getCoachCookieOptions();
  const cleared = { ...options, maxAge: 0 };

  cookieStore.set(COACH_SESSION_COOKIE, buildSessionValue(email), options);
  cookieStore.set(COACH_EMAIL_COOKIE, "", cleared);
}

export async function clearCoachSession() {
  const cookieStore = await cookies();
  const cleared = { ...getCoachCookieOptions(), maxAge: 0 };

  cookieStore.set(COACH_SESSION_COOKIE, "", cleared);
  cookieStore.set(COACH_EMAIL_COOKIE, "", cleared);
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
