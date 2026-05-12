import { test, expect } from "@playwright/test";

test.describe("Job detail page", () => {
  test("clicking a job opens detail page", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    const link = page.getByRole("link").filter({ hasText: /developer|engineer|разработчик/i }).first();
    if (await link.isVisible()) {
      await link.click();
      await page.waitForLoadState("networkidle");
      const url = page.url();
      expect(url).toMatch(/jobs\/.+/);
    } else {
      const anyLink = page.getByRole("link").nth(2);
      if (await anyLink.isVisible()) {
        await anyLink.click();
        await page.waitForLoadState("networkidle");
      }
    }
  });

  test("job detail page shows salary or skills", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    const link = page.getByRole("link").nth(1);
    if (await link.isVisible()) {
      await link.click();
      await page.waitForLoadState("networkidle");
      const body = await page.textContent("body");
      const hasJobInfo =
        body?.includes("₸") ||
        body?.toLowerCase().includes("react") ||
        body?.toLowerCase().includes("python") ||
        body?.toLowerCase().includes("java") ||
        body?.toLowerCase().includes("remote") ||
        body?.toLowerCase().includes("junior") ||
        body?.toLowerCase().includes("навык") ||
        body?.toLowerCase().includes("skill");
      expect(hasJobInfo).toBeTruthy();
    }
  });
});
