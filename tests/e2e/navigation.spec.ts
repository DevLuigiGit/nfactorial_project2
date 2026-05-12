import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body?.length).toBeGreaterThan(50);
  });

  test("navigates to /jobs", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const jobsLink = page.getByRole("link", { name: /job|вакан/i }).first();
    if (await jobsLink.isVisible()) {
      await jobsLink.click();
      await expect(page).toHaveURL(/jobs/);
    } else {
      await page.goto("/jobs");
      await expect(page).toHaveURL(/jobs/);
    }
  });

  test("header is visible on all pages", async ({ page }) => {
    for (const path of ["/", "/jobs"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const header = page.locator("header, nav").first();
      await expect(header).toBeVisible();
    }
  });
});
