import { test, expect } from '@playwright/test';

test.describe('Simple Page Test', () => {
  test('should render something on the page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait a bit for the page to load
    await page.waitForTimeout(3000);
    
    // Get the page content
    const bodyText = await page.textContent('body');
    console.log('Body text length:', bodyText?.length);
    console.log('Body contains "Teen Training":', bodyText?.includes('Teen Training'));
    console.log('Body contains "Connection Error":', bodyText?.includes('Connection Error'));
    console.log('Body contains "Dashboard":', bodyText?.includes('Dashboard'));
    
    // Check for any elements with data-testid
    const testIds = await page.locator('[data-testid]').count();
    console.log('Elements with data-testid:', testIds);
    
    // List all data-testid attributes
    const testIdElements = await page.locator('[data-testid]').all();
    for (const element of testIdElements) {
      const testId = await element.getAttribute('data-testid');
      console.log('Found data-testid:', testId);
    }
    
    // Take a screenshot
    await page.screenshot({ path: 'simple-page-test.png', fullPage: true });
    
    // The page should at least have some content
    expect(bodyText?.length).toBeGreaterThan(0);
  });
});
