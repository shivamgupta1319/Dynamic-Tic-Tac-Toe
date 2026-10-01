import type { Page } from '@playwright/test';

export async function signIn(page: Page) {
  await page.goto('/sign-in');
  const emailInput = page.getByLabel(/email/i);
  const passwordInput = page.getByLabel(/password/i);
  await emailInput.fill(process.env.E2E_EMAIL || 'admin@example.com');
  await passwordInput.fill(process.env.E2E_PASSWORD || 'secret123');
  const submitButton = page.getByRole('button', { name: /sign in/i });
  await submitButton.click();
  await page.waitForURL('**/dashboard');
}
