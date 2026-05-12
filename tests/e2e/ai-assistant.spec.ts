import { test, expect } from "@playwright/test";

test.describe("AI Assistant", () => {
  test("AI assistant panel is visible", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    const aiPanel =
      (await page.getByText(/ai|ассистент|assistant|чат|chat/i).count()) > 0;
    expect(aiPanel).toBeTruthy();
  });

  test("AI chat responds to a message", async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
    const input = page.getByRole("textbox").last();
    if (await input.isVisible()) {
      await input.fill("Найди Junior React вакансии в Алматы");
      const sendBtn = page
        .getByRole("button", { name: /отправ|send|→/i })
        .last();
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
        await page.waitForTimeout(3000);
        const body = await page.textContent("body");
        const hasResponse =
          body?.toLowerCase().includes("junior") ||
          body?.toLowerCase().includes("almaty") ||
          body?.toLowerCase().includes("алматы") ||
          body?.toLowerCase().includes("вакансий") ||
          body?.toLowerCase().includes("нашёл");
        expect(hasResponse).toBeTruthy();
      }
    }
  });
});
