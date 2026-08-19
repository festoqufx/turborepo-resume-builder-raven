import { expect, test } from "../fixtures/test";

test("opens the dashboard without signing in", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveURL(/\/dashboard/);
	await expect(page.getByRole("heading", { name: "Resumes" })).toBeVisible();
});
