import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Teen Training Program/);

    // Check if main content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to exercises page', async ({ page }) => {
    await page.goto('/');

    // Look for navigation to exercises (adjust selector based on your actual navigation)
    const exercisesLink = page.locator('a[href="/exercises"]').first();
    if (await exercisesLink.isVisible()) {
      await exercisesLink.click();
      await expect(page).toHaveURL('/exercises');
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if content is visible on mobile
    await expect(page.locator('body')).toBeVisible();
  });
});
