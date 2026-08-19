import { auth } from "@reactive-resume/auth/config";
import { env } from "@reactive-resume/env/server";

export const LOCAL_USER = {
	name: "Local User",
	email: "local@example.com",
	username: "local",
	password: "local-dev-password",
} as const;

const signUpBody = {
	name: LOCAL_USER.name,
	email: LOCAL_USER.email,
	password: LOCAL_USER.password,
	username: LOCAL_USER.username,
	displayUsername: LOCAL_USER.username,
};

export function isGetSessionRequest(request: Request): boolean {
	if (request.method !== "GET") return false;
	return new URL(request.url).pathname.endsWith("/get-session");
}

function hasSessionUser(body: unknown): boolean {
	return Boolean(body && typeof body === "object" && "user" in body && body.user);
}

function cookieHeaderFromSetCookie(setCookies: string[]): string {
	return setCookies
		.map((cookie) => cookie.split(";", 1)[0]?.trim())
		.filter((part): part is string => Boolean(part))
		.join("; ");
}

function authApiHeaders(request: Request): Headers {
	const headers = new Headers(request.headers);
	if (!headers.get("origin")) {
		headers.set("origin", env.APP_URL);
	}
	return headers;
}

async function ensureLocalUserExists(request: Request): Promise<void> {
	try {
		await auth.api.signUpEmail({ body: signUpBody, headers: authApiHeaders(request) });
	} catch {
		// The local user already exists from a previous visit.
	}
}

function signInLocalUser(request: Request): Promise<Response> {
	return auth.api.signInEmail({
		body: {
			email: LOCAL_USER.email,
			password: LOCAL_USER.password,
		},
		headers: authApiHeaders(request),
		asResponse: true,
	});
}

export async function ensureLocalSession(request: Request): Promise<Response> {
	await ensureLocalUserExists(request);

	const signInResponse = await signInLocalUser(request);
	const setCookies = signInResponse.headers.getSetCookie();
	const headers = new Headers(request.headers);
	const signedInCookies = cookieHeaderFromSetCookie(setCookies);
	const existingCookies = headers.get("cookie");
	headers.set("cookie", [existingCookies, signedInCookies].filter(Boolean).join("; "));

	const sessionResponse = await auth.handler(new Request(request.url, { method: "GET", headers }));
	const body = await sessionResponse.text();
	const next = new Response(body, sessionResponse);

	for (const cookie of setCookies) {
		next.headers.append("Set-Cookie", cookie);
	}

	return next;
}

export async function withLocalSessionIfNeeded(request: Request, response: Response): Promise<Response> {
	if (!isGetSessionRequest(request)) return response;

	const text = await response.text();
	let body: unknown = null;
	if (text) {
		try {
			body = JSON.parse(text) as unknown;
		} catch {
			body = null;
		}
	}

	if (hasSessionUser(body)) {
		return new Response(text, response);
	}

	return ensureLocalSession(request);
}
