import { test, expect } from '@playwright/test';

test.describe('Minimal Page Test', () => {
  test('should show error message when Supabase fails', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(`Page error: ${error.message}`);
    });
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for either error message or navigation to appear
    try {
      await page.waitForSelector('[data-testid="error-message"], [data-testid="desktop-navigation"], [data-testid="mobile-navigation"]', { timeout: 15000 });
    } catch (e) {
      console.log('No expected elements found within timeout');
    }
    
    // Check what's actually on the page
    const bodyText = await page.textContent('body');
    console.log('Body text length:', bodyText?.length);
    console.log('Body contains error message:', bodyText?.includes('Connection Error') || bodyText?.includes('Unable to connect'));
    console.log('Body contains navigation:', bodyText?.includes('Exercises') || bodyText?.includes('Session'));
    
    // Check for any elements with our test IDs
    const errorElement = await page.locator('[data-testid="error-message"]').count();
    const desktopNav = await page.locator('[data-testid="desktop-navigation"]').count();
    const mobileNav = await page.locator('[data-testid="mobile-navigation"]').count();
    
    console.log('Error element count:', errorElement);
    console.log('Desktop nav count:', desktopNav);
    console.log('Mobile nav count:', mobileNav);
    
    // Check for any buttons
    const buttonCount = await page.locator('button').count();
    console.log('Button count:', buttonCount);
    
    // Check for error message content
    const hasErrorText = await page.locator('text=Connection Error').count();
    const hasTryAgainButton = await page.locator('text=Try Again').count();
    console.log('Has error text:', hasErrorText);
    console.log('Has try again button:', hasTryAgainButton);
    
    // Take a screenshot
    await page.screenshot({ path: 'minimal-test.png', fullPage: true });
    
    // Log errors
    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }
    
    // The test should pass if we can see the error message
    expect(hasErrorText).toBeGreaterThan(0);
    expect(hasTryAgainButton).toBeGreaterThan(0);
  });
});
