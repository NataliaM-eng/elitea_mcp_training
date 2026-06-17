import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: EPAM Services → Client Work Navigation
 *
 * Scenario:
 *   1. Navigate to https://www.epam.com/
 *   2. Select "Services" from the header menu
 *   3. Click the "Explore Our Client Work" link
 *   4. Verify that the "Client Work" text is visible on the page
 */
test.describe('EPAM Client Work Page Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the EPAM homepage
    await page.goto('https://www.epam.com/');

    // ── Proactively dismiss cookie consent banner if present ──────────────
    const cookieAcceptBtn = page.getByRole('button', { name: 'Accept All' });
    if (await cookieAcceptBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await cookieAcceptBtn.click();
      // Wait for the banner to disappear before continuing
      await cookieAcceptBtn.waitFor({ state: 'hidden', timeout: 5_000 });
    }
  });

  // ── Main test case ──────────────────────────────────────────────────────
  test('should navigate to Client Work page via Services header link', async ({ page }) => {
    // ── Step 2: Click "Services" in the top navigation ───────────────────
    // Use nth(1) to target the visible desktop navigation link
    // (the hamburger-menu duplicate is rendered but hidden on desktop)
    await page.getByRole('link', { name: 'Services' }).nth(1).click();

    // Assert we reached the Services page before proceeding
    await expect(page).toHaveURL(/\/services$/, { timeout: 10_000 });

    // ── Step 3: Click "Explore Our Client Work" ───────────────────────────
    await page.getByRole('link', { name: 'Explore Our Client Work' }).click();

    // Assert we reached the correct URL
    await expect(page).toHaveURL(/\/services\/client-work/, { timeout: 10_000 });

    // ── Step 4: Verify "Client Work" heading is visible ───────────────────
    const clientWorkHeading = page.getByRole('heading', { name: 'Client Work', level: 1 });
    await expect(clientWorkHeading).toBeVisible({ timeout: 10_000 });
  });

  // ── Edge-case / secondary assertion test ─────────────────────────────
  test('should display the correct page title for Client Work', async ({ page }) => {
    // Navigate directly via the known URL (verifies standalone page integrity)
    await page.goto('https://www.epam.com/services/client-work');

    await expect(page).toHaveTitle(/Client Work/i, { timeout: 10_000 });

    const clientWorkHeading = page.getByRole('heading', { name: 'Client Work', level: 1 });
    await expect(clientWorkHeading).toBeVisible({ timeout: 10_000 });
  });
});
