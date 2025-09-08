import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should load the homepage', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Teen Training Program/);

    // Check if main content is visible
    await expect(page.locator('body')).toBeVisible();

    // Check for key elements on the page
    await expect(page.locator('h1, h2, h3')).toHaveCount(1);
  });

  test('should navigate to exercises page', async ({ page }) => {
    // Look for navigation to exercises - check both desktop and mobile navigation
    const exercisesLink = page.locator('[data-testid="desktop-navigation"] button:has-text("Exercises"), [data-testid="mobile-navigation"] button:has-text("Exercises")').first();

    // Wait for the link to be visible
    await expect(exercisesLink).toBeVisible({ timeout: 10000 });

    // Click the exercises link
    await exercisesLink.click();

    // Wait for navigation to complete
    await page.waitForURL('**/exercises', { timeout: 10000 });
    await expect(page).toHaveURL(/.*exercises/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check if content is visible on mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Check if mobile navigation is present
    const mobileNav = page.locator('[data-testid="mobile-navigation"]');
    await expect(mobileNav).toBeVisible();
  });

  test('should handle navigation between main pages', async ({ page }) => {
    // Test dashboard navigation
    await expect(page.locator('body')).toBeVisible();
    
    // Test session page navigation
    const sessionLink = page.locator('[data-testid="desktop-navigation"] button:has-text("Session"), [data-testid="mobile-navigation"] button:has-text("Session")').first();
    if (await sessionLink.isVisible()) {
      await sessionLink.click();
      await page.waitForURL('**/session', { timeout: 10000 });
      await expect(page).toHaveURL(/.*session/);
    }
    
    // Test progress page navigation
    const progressLink = page.locator('[data-testid="desktop-navigation"] button:has-text("Progress"), [data-testid="mobile-navigation"] button:has-text("Progress")').first();
    if (await progressLink.isVisible()) {
      await progressLink.click();
      await page.waitForURL('**/progress', { timeout: 10000 });
      await expect(page).toHaveURL(/.*progress/);
    }
    
    // Test settings page navigation
    const settingsLink = page.locator('[data-testid="desktop-navigation"] button:has-text("Settings"), [data-testid="mobile-navigation"] button:has-text("Settings")').first();
    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      await page.waitForURL('**/settings', { timeout: 10000 });
      await expect(page).toHaveURL(/.*settings/);
    }
  });

  test('should handle onboarding flow if no users exist', async ({ page }) => {
    // Check if onboarding is shown (this might happen if no users exist)
    const onboardingElement = page.locator('[data-testid="onboarding"], .onboarding');
    
    if (await onboardingElement.isVisible()) {
      // Test onboarding form
      await expect(page.locator('input[type="text"], input[name="full_name"]')).toBeVisible();
      await expect(page.locator('button:has-text("Next"), button:has-text("Complete")')).toBeVisible();
    }
  });
});
