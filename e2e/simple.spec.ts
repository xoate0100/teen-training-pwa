import { test, expect } from '@playwright/test';

test.describe('Simple Page Test', () => {
  test('should load basic page content', async ({ page }) => {
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
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Check for errors
    if (errors.length > 0) {
      console.log('Errors found:', errors);
    }
    
    // Check if the page has any content
    const bodyText = await page.textContent('body');
    console.log('Body text length:', bodyText?.length);
    console.log('Body contains React content:', bodyText?.includes('React') || bodyText?.includes('Next.js'));
    
    // Check if the page title is set
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if there are any React components rendered
    const reactElements = await page.locator('[data-reactroot], [data-react-helmet]').count();
    console.log('React elements found:', reactElements);
    
    // Take a screenshot
    await page.screenshot({ path: 'simple-test.png', fullPage: true });
    
    // Basic assertion - the page should at least have a title
    expect(title).toBeTruthy();
  });
});
