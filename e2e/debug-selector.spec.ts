import { test, expect } from '@playwright/test';

test.describe('Debug Selector Test', () => {
  test('should find error message with correct selector', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait a bit for the page to load
    await page.waitForTimeout(3000);
    
    // Check what elements are actually present
    const errorElement = await page.locator('[data-testid="error-message"]').count();
    const desktopNav = await page.locator('[data-testid="desktop-navigation"]').count();
    const mobileNav = await page.locator('[data-testid="mobile-navigation"]').count();
    const textDestructive = await page.locator('.text-destructive').count();
    
    console.log('Error element count:', errorElement);
    console.log('Desktop nav count:', desktopNav);
    console.log('Mobile nav count:', mobileNav);
    console.log('Text destructive count:', textDestructive);
    
    // Check if any of these elements exist
    const hasAnyElement = errorElement > 0 || desktopNav > 0 || mobileNav > 0 || textDestructive > 0;
    console.log('Has any expected element:', hasAnyElement);
    
    // Check the page content
    const bodyText = await page.textContent('body');
    console.log('Body contains error message:', bodyText?.includes('Connection Error'));
    console.log('Body contains navigation:', bodyText?.includes('Exercises'));
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-selector.png', fullPage: true });
    
    // The test should pass if we find any of the expected elements
    expect(hasAnyElement).toBe(true);
  });
});
