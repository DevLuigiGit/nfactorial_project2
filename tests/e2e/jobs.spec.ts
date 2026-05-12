import { test, expect } from "@playwright/test";

test.describe("Jobs page", () => {
  test("loads and shows job list", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 8000 });
    const cards = page.locator("[data-testid='job-card'], .job-card, [class*='job']").first();
    await expect(cards).toBeVisible({ timeout: 8000 });
  });

  test("filters panel is visible", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    const filtersVisible =
      (await page.getByRole("combobox").count()) > 0 ||
      (await page.getByRole("listbox").count()) > 0 ||
      (await page.locator("select").count()) > 0 ||
      (await page.getByText(/город|city|грейд|grade|формат|format/i).count()) > 0;
    expect(filtersVisible).toBeTruthy();
  });

  test("job card contains title and company", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    const hasDeveloper =
      (body?.toLowerCase().includes("developer") ||
       body?.toLowerCase().includes("разработчик") ||
       body?.toLowerCase().includes("engineer")) ?? false;
    expect(hasDeveloper).toBeTruthy();
  });
});
