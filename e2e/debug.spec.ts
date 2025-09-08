import { test, expect } from '@playwright/test';

test.describe('Debug Navigation', () => {
  test('debug navigation rendering', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Check if any navigation elements exist
    const allButtons = await page.locator('button').all();
    console.log(`Found ${allButtons.length} buttons on the page`);
    
    // Check for navigation containers
    const desktopNav = await page.locator('[data-testid="desktop-navigation"]').count();
    const mobileNav = await page.locator('[data-testid="mobile-navigation"]').count();
    console.log(`Desktop navigation elements: ${desktopNav}`);
    console.log(`Mobile navigation elements: ${mobileNav}`);
    
    // Check for any buttons with navigation text
    const exercisesButtons = await page.locator('button:has-text("Exercises")').count();
    const sessionButtons = await page.locator('button:has-text("Session")').count();
    const progressButtons = await page.locator('button:has-text("Progress")').count();
    const settingsButtons = await page.locator('button:has-text("Settings")').count();
    
    console.log(`Exercises buttons: ${exercisesButtons}`);
    console.log(`Session buttons: ${sessionButtons}`);
    console.log(`Progress buttons: ${progressButtons}`);
    console.log(`Settings buttons: ${settingsButtons}`);
    
    // Check viewport size
    const viewport = page.viewportSize();
    console.log(`Viewport size: ${viewport?.width}x${viewport?.height}`);
    
    // Check if mobile detection is working
    const isMobile = await page.evaluate(() => window.innerWidth < 768);
    console.log(`Is mobile (window.innerWidth < 768): ${isMobile}`);
    
    // Check if navigation components are in the DOM but hidden
    const hiddenDesktopNav = await page.locator('[data-testid="desktop-navigation"]').isHidden();
    const hiddenMobileNav = await page.locator('[data-testid="mobile-navigation"]').isHidden();
    console.log(`Desktop nav hidden: ${hiddenDesktopNav}`);
    console.log(`Mobile nav hidden: ${hiddenMobileNav}`);
    
    // Check for any elements with navigation-related classes
    const navElements = await page.locator('.grid, .fixed, .bottom-0').count();
    console.log(`Elements with navigation classes: ${navElements}`);
    
    // Check for any errors in console
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });
    
    // Wait a bit more to catch any console messages
    await page.waitForTimeout(2000);
    
    console.log('Console messages:', consoleMessages);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-navigation.png', fullPage: true });
    
    // Check the page content
    const bodyText = await page.textContent('body');
    console.log('Body text contains navigation:', bodyText?.includes('Exercises') || bodyText?.includes('Session'));
    
    // Check if the navigation hook is working
    const hookState = await page.evaluate(() => {
      // Try to access the navigation state from the window object
      return {
        hasNavigation: !!document.querySelector('[data-testid="desktop-navigation"], [data-testid="mobile-navigation"]'),
        bodyHTML: document.body.innerHTML.substring(0, 500)
      };
    });
    console.log('Hook state:', hookState);
  });
});
