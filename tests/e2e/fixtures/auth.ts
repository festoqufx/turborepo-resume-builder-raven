import type { APIRequestContext, Browser, BrowserContext, Page } from "@playwright/test";
import type { E2EAccount } from "./data";

async function assertAuthResponse(response: Awaited<ReturnType<APIRequestContext["post"]>>) {
	if (response.ok()) return;

	throw new Error(`Authentication request failed with ${response.status()}: ${await response.text()}`);
}

export async function logoutViaUi(page: Page, account: E2EAccount) {
	await page.getByText(account.email).click();
	await page.getByRole("menuitem", { name: "Logout" }).click();
	await page.waitForURL(/\/dashboard/);
}

async function registerViaApi(request: APIRequestContext, account: E2EAccount, baseURL: string) {
	const response = await request.post("/api/auth/sign-up/email", {
		headers: {
			origin: baseURL,
			referer: `${baseURL}/auth/register`,
		},
		data: {
			name: account.name,
			email: account.email,
			password: account.password,
			username: account.username,
			displayUsername: account.username,
			callbackURL: "/dashboard",
		},
	});

	await assertAuthResponse(response);
}

export async function createAuthenticatedContext(
	browser: Browser,
	request: APIRequestContext,
	account: E2EAccount,
	baseURL: string,
): Promise<BrowserContext> {
	await registerViaApi(request, account, baseURL);

	return browser.newContext({
		baseURL,
		storageState: await request.storageState(),
	});
}
