import { test, expect } from '@playwright/test';
import path from 'path';

// List of all pages in the application
const pages = [
  { name: 'home', path: '/', needsAuth: false },
  { name: 'login', path: '/login', needsAuth: false },
  { name: 'register', path: '/register', needsAuth: false },
  { name: 'dashboard', path: '/dashboard', needsAuth: true },
  { name: 'domains', path: '/domains', needsAuth: true },
  { name: 'providers', path: '/providers', needsAuth: true },
  { name: 'providers-add', path: '/providers/add', needsAuth: true },
  { name: 'certificates', path: '/certificates', needsAuth: true },
  { name: 'proxy', path: '/proxy', needsAuth: true },
  { name: 'settings', path: '/settings', needsAuth: true },
];

test.describe('Page Screenshots', () => {
  // Take screenshots of pages that don't require authentication
  test.describe('Public Pages', () => {
    for (const page of pages.filter(p => !p.needsAuth)) {
      test(`Screenshot: ${page.name}`, async ({ page: playwrightPage }) => {
        await playwrightPage.goto(page.path);
        await playwrightPage.waitForLoadState('networkidle');
        
        // Wait a bit for any animations to complete
        await playwrightPage.waitForTimeout(500);
        
        const screenshotPath = path.join('screenshots', `${page.name}.png`);
        await playwrightPage.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        
        console.log(`Screenshot saved: ${screenshotPath}`);
      });
    }
  });

  // Take screenshots of pages that require authentication
  test.describe('Authenticated Pages', () => {
    test.beforeEach(async ({ page }) => {
      // Skip authentication for now - these will show the login redirect or error state
      // In a real scenario, you would authenticate here first
    });

    for (const page of pages.filter(p => p.needsAuth)) {
      test(`Screenshot: ${page.name}`, async ({ page: playwrightPage }) => {
        await playwrightPage.goto(page.path);
        await playwrightPage.waitForLoadState('networkidle');
        
        // Wait a bit for any animations to complete
        await playwrightPage.waitForTimeout(500);
        
        const screenshotPath = path.join('screenshots', `${page.name}.png`);
        await playwrightPage.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        
        console.log(`Screenshot saved: ${screenshotPath}`);
      });
    }
  });
});
