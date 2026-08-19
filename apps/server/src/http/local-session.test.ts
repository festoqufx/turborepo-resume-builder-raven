import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	signUpEmail: vi.fn(),
	signInEmail: vi.fn(),
	handler: vi.fn(),
}));

vi.mock("@reactive-resume/auth/config", () => ({
	auth: {
		api: {
			signUpEmail: mocks.signUpEmail,
			signInEmail: mocks.signInEmail,
		},
		handler: mocks.handler,
	},
}));

vi.mock("@reactive-resume/env/server", () => ({
	env: { APP_URL: "http://localhost:3000" },
}));

const { ensureLocalSession, isGetSessionRequest, withLocalSessionIfNeeded } = await import("./local-session");

beforeEach(() => {
	vi.clearAllMocks();
	mocks.signUpEmail.mockResolvedValue({});
	mocks.signInEmail.mockResolvedValue(
		new Response("signed-in", { headers: { "set-cookie": "better-auth.session_token=abc; Path=/" } }),
	);
	mocks.handler.mockResolvedValue(Response.json({ user: { id: "local" }, session: { id: "session" } }));
});

describe("isGetSessionRequest", () => {
	it("matches Better Auth session lookups", () => {
		expect(isGetSessionRequest(new Request("http://localhost:3001/api/auth/get-session"))).toBe(true);
		expect(isGetSessionRequest(new Request("http://localhost:3001/api/auth/sign-in/email", { method: "POST" }))).toBe(
			false,
		);
	});
});

describe("withLocalSessionIfNeeded", () => {
	it("passes through non-session routes", async () => {
		const request = new Request("http://localhost:3001/api/auth/ok");
		const response = new Response("ok");

		await expect(withLocalSessionIfNeeded(request, response)).resolves.toBe(response);
		expect(mocks.signInEmail).not.toHaveBeenCalled();
	});

	it("passes through an existing session", async () => {
		const request = new Request("http://localhost:3001/api/auth/get-session");
		const response = Response.json({ user: { id: "existing" }, session: { id: "s1" } });

		const next = await withLocalSessionIfNeeded(request, response);
		await expect(next.json()).resolves.toMatchObject({ user: { id: "existing" } });
		expect(mocks.signInEmail).not.toHaveBeenCalled();
	});

	it("signs in the local user when get-session is empty", async () => {
		const request = new Request("http://localhost:3001/api/auth/get-session");
		const response = new Response("null");

		const next = await withLocalSessionIfNeeded(request, response);

		expect(mocks.signUpEmail).toHaveBeenCalledOnce();
		expect(mocks.signInEmail).toHaveBeenCalledOnce();
		expect(mocks.signInEmail.mock.calls[0]?.[0]?.headers.get("origin")).toBe("http://localhost:3000");
		await expect(next.json()).resolves.toMatchObject({ user: { id: "local" } });
		expect(next.headers.getSetCookie().join(";")).toContain("better-auth.session_token=abc");
	});
});

describe("ensureLocalSession", () => {
	it("continues when the local user already exists", async () => {
		mocks.signUpEmail.mockRejectedValueOnce(new Error("USER_ALREADY_EXISTS"));

		const response = await ensureLocalSession(new Request("http://localhost:3001/api/auth/get-session"));

		expect(mocks.signInEmail).toHaveBeenCalledOnce();
		await expect(response.json()).resolves.toMatchObject({ user: { id: "local" } });
	});
});
